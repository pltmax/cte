# ADR-004: Stripe Payment Integration — Hosted Checkout, Subscription Management, Credit Purchases
**Date**: 2026-02-27
**Status**: Accepted

## Context
The platform must monetise access via two products:

1. **Premium subscription** (€15/month, recurring) — gates exercises and mock exams.
   ADR-003 established the role-based gating model; this ADR wires it to real payments.
2. **Extra credits** (€6.99/unit, one-time) — each credit grants one mock exam attempt.

Requirements that shaped the choice:
- No PCI scope on our servers: we must not handle raw card data.
- Subscription state must stay in sync with Supabase automatically; no manual admin grant
  should be necessary after a successful payment.
- Credit top-ups must feed into the same `profiles.credit_number` column used by
  `launch_exam()` (ADR-003), with no schema break.
- A single customer record in Stripe must be reused across purchases to support
  the customer portal for subscription self-management.

## Decision

**1. Stripe Checkout (hosted page)**
Both the subscription and the one-time credit purchase use `stripe.checkout.Session.create()`.
The browser is redirected to Stripe's hosted page — no custom payment form, no PCI scope.
`mode="subscription"` for premium; `mode="payment"` for credits. A `metadata.type` field
(`"premium"` | `"credits"`) is embedded in every session to route webhook events correctly.

**2. FastAPI owns all Stripe I/O** (`backend/app/routers/stripe_router.py`)
Three endpoints, all under `/api/v1/stripe`:
- `POST /checkout` — authenticated; creates a Checkout Session and returns its redirect URL.
- `POST /portal` — authenticated; creates a Customer Portal Session for subscription management.
- `POST /webhook` — no user auth; verified via HMAC using `stripe.Webhook.construct_event()`
  and the `STRIPE_WEBHOOK_SECRET` env var.

Keeping all Stripe logic in FastAPI co-locates checkout creation with the webhook handler,
avoiding duplication across two runtimes.

**3. Next.js Server Actions as the browser-to-backend bridge**
`frontend/src/app/(app)/credits/actions.ts` calls the FastAPI backend server-to-server
(no CORS exposure) and invokes `redirect(url)` to send the browser to Stripe.
The client-side `CheckoutButton` component calls the action via `useTransition` and
shows a loading state while the redirect is prepared.

**4. Stripe Customer lifecycle**
On first checkout, a Stripe Customer object is created with the user's email.
The resulting `stripe_customer_id` is persisted to `profiles`. All subsequent sessions
and portal calls reuse the same customer, enabling Stripe to aggregate receipts,
payment methods, and subscription history in one place.

**5. Webhook-driven state sync**
The webhook handler reacts to three events:
- `checkout.session.completed` — reads `metadata.type`:
  - `"premium"`: creates or upserts a `subscriptions` row and sets `profiles.role = 'premium'`.
  - `"credits"`: calls `increment_credits()` (ADR-003 RPC) via service-role client.
- `customer.subscription.updated` — upserts the `subscriptions` row; sets `profiles.role`
  to `'premium'` if `status = 'active'`, or `'user'` for any other status (e.g. `'past_due'`,
  `'canceled'`).
- `customer.subscription.deleted` — sets `profiles.role` back to `'user'`.

**6. DB changes**
New `subscriptions` table columns: `id`, `user_id` (FK → `profiles`), `stripe_subscription_id`,
`stripe_customer_id`, `status`, `current_period_end`, `created_at`, `updated_at`.
RLS: row-level read for owner (`user_id = auth.uid()`); all writes via service-role key only.
`profiles` gains a `stripe_customer_id` column (nullable text).
Migration: `supabase/migrations/20260227000002_stripe.sql`

**7. New env vars**
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PREMIUM_PRICE_ID`,
`STRIPE_CREDIT_PRICE_ID`, `APP_URL` (Stripe success/cancel redirects), `API_URL`
(Server Action → FastAPI base URL).

**New files introduced**
- `backend/app/dependencies.py` — shared `require_auth` / `require_admin` deps
  (refactors duplication out of `admin.py`)
- `backend/app/models/stripe.py`
- `backend/app/routers/stripe_router.py`
- `supabase/migrations/20260227000002_stripe.sql`
- `frontend/src/app/(app)/credits/page.tsx`, `loading.tsx`, `success/page.tsx`
- `frontend/src/app/(app)/credits/actions.ts`
- `frontend/src/components/app/CheckoutButton.tsx`
- `frontend/src/types/subscription.ts`

**Local dev note:** `stripe listen --forward-to localhost:8000/api/v1/stripe/webhook`
must be running for webhook events to reach the local backend.

## Consequences
- POSITIVE: No PCI scope — card data never touches our servers; Stripe's hosted page
  handles all payment collection.
- POSITIVE: Webhook-driven sync means subscription state is updated automatically on
  payment, renewal, failure, and cancellation without any cron job or polling.
- POSITIVE: The Customer Portal covers subscription cancellation and payment-method
  updates with no additional UI work on our side.
- POSITIVE: Reusing `increment_credits()` (ADR-003) for credit webhook events keeps
  the credit deduction path consistent — one RPC, one test surface.
- POSITIVE: `dependencies.py` centralises auth guards, reducing boilerplate in all
  current and future routers.
- TRADEOFF: Stripe Checkout redirects the user away from the site and back. The round
  trip adds latency and a visible page transition. Acceptable at this stage; Stripe
  Elements could replace it later if conversion data justifies the PCI work.
- TRADEOFF: Webhook delivery is asynchronous and not guaranteed to be instant. A
  user who completes payment may see stale role/credits for a few seconds before the
  webhook fires. A success page with a polling or optimistic state can mask this.
- TRADEOFF: `stripe_customer_id` is stored in `profiles` as plain text with no index.
  Webhook lookups by customer ID will require a sequential scan until an index is added.
- CONSTRAINT: Local webhook testing requires the Stripe CLI (`stripe listen`) to be
  running alongside `make dev`. This adds a step to the dev setup not covered by the
  Makefile.
- CONSTRAINT: Subscription status lives in both `subscriptions.status` and
  `profiles.role`. These two must be kept in sync exclusively by the webhook handler.
  Any manual update to one without the other will create inconsistency.

## Rejected Alternatives
- **Stripe Elements (custom payment form)**: Brings our servers into PCI scope and
  requires significant UI work for card input, error handling, and 3DS flows. No
  conversion benefit at this stage justifies the added complexity.
- **Calling Stripe directly from Next.js Server Actions**: Would duplicate checkout
  session creation and the `stripe_customer_id` persistence logic across two runtimes
  (Next.js and FastAPI). Keeping all Stripe I/O in FastAPI co-locates it with the
  webhook handler, which must run in the backend regardless.
- **Storing premium status only in JWT claims**: Every role change (payment, cancellation,
  renewal) would require calling the Supabase Admin API to update the user's JWT metadata,
  adding an async step and a service-role call per event. `profiles.role` is already read
  by the proxy (ADR-003) and is simpler to update from the webhook handler.
