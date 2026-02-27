# ADR-003: Premium Gating, Credit System, and Admin Management
**Date**: 2026-02-27
**Status**: Accepted

## Context
The platform needs to restrict exercises and mock exams to paying (premium) users.
Mock exams additionally require credits (1 credit per exam) to prevent unlimited consumption
once premium access is granted. Three problems had to be solved simultaneously:

1. Route-level enforcement: unauthenticated or non-premium users must be blocked before
   any page content is rendered, not client-side after the fact.
2. Atomic credit deduction: a race condition between "check credits" and "start exam"
   could allow multiple concurrent exam launches on a single credit.
3. Credit top-up and premium promotion: admin users need a controlled, backend-only path
   to manage user entitlements without exposing elevated privileges to the browser.

Payment integration is explicitly deferred; the data model must support it later without
a breaking migration.

## Decision

**1. Route protection in `proxy.ts`**
The Next.js proxy intercepts all requests to `/exercices/*` and `/mockexams/*`. It reads
`profiles.role` via the user's anon-key session (RLS guarantees the user can only read
their own row). Non-premium users are redirected to `/premium-required`. The check runs
at the edge before any page component is rendered.

**2. `launch_exam()` Supabase RPC (SECURITY DEFINER, `authenticated`)**
A single SQL function atomically decrements `profiles.credit_number` (WHERE `credit_number > 0`)
and inserts a `mock_exams` row with `status = 'in_progress'`, returning the new exam UUID.
If no row is updated by the conditional WHERE, the function raises an `insufficient_credits`
exception. Atomicity is achieved by a single `UPDATE … RETURNING` — no separate SELECT needed.

**3. `increment_credits(uuid, int)` Supabase RPC (SECURITY DEFINER, service-role only)**
EXECUTE is not granted to `authenticated` or `anon`. The RPC is callable exclusively from
the FastAPI backend using the service-role key, preventing any browser-level privilege
escalation.

**4. FastAPI admin endpoints**
`POST /api/v1/admin/users/{id}/premium` and `POST /api/v1/admin/users/{id}/credits` require
a Bearer JWT. A `require_admin` dependency decodes the token via Supabase and asserts
`profiles.role = 'admin'` using the service-role client (bypasses RLS for the lookup).
Granting premium sets `profiles.role = 'premium'`; adding credits calls `increment_credits`.
No admin action is exposed as a Supabase RLS policy — all elevation goes through FastAPI.

**5. `(exam)` route group**
The full-screen exam experience lives at `/mockexams/{examId}` inside a dedicated `(exam)`
route group with its own layout (no sidebar, no app shell). The `/mockexams` listing page
remains in the existing `(app)` group. This avoids layout-nesting conflicts and keeps the
exam renderer isolated.

**6. `LaunchExamButton` client component**
Calls `launch_exam()` via the Supabase browser client (authenticated RPC). On success it
receives the exam UUID and navigates to `/mockexams/{examId}`. On `insufficient_credits`
error it surfaces an inline message — no full-page redirect.

**Migration:** `supabase/migrations/20260227000001_admin_rpcs.sql`

**Files introduced or updated:**
- New: `supabase/migrations/20260227000001_admin_rpcs.sql`
- New: `backend/app/models/admin.py`, `backend/app/routers/admin.py`
- Updated: `backend/app/main.py`, `frontend/src/proxy.ts`, `frontend/src/components/app/LaunchExamButton.tsx`
- New: `frontend/src/app/(app)/premium-required/page.tsx`, `frontend/src/app/(exam)/mockexams/[examId]/page.tsx`

## Consequences
- POSITIVE: Credit deduction is race-condition-free — the conditional UPDATE ensures a credit
  can never be consumed twice, even under concurrent requests.
- POSITIVE: Admin entitlement operations are backend-only and service-role-gated; no
  browser client can promote itself or add credits.
- POSITIVE: Route protection at the proxy level renders pages only for eligible users,
  eliminating client-side flash of premium content.
- POSITIVE: `profiles` table already exists and absorbs `credit_number` and `role` changes
  with no new tables — the schema stays simple until a payments table is genuinely needed.
- TRADEOFF: Every request to `/exercices/*` and `/mockexams/*` incurs one additional DB
  round-trip for the profile role check. Acceptable at current scale; can be eliminated later
  by encoding `role` as a custom JWT claim updated on promotion.
- TRADEOFF: `role` is a free-text column with application-enforced values (`'premium'`,
  `'admin'`, `'user'`). A PostgreSQL ENUM would enforce values at the DB level but requires
  a migration to extend — deferred for flexibility.
- CONSTRAINT: Credits and premium status live in `profiles` with no audit log. Any future
  requirement for a credit transaction history (e.g. for receipts or disputes) will require
  a new `credit_ledger` table and a backfill.
- CONSTRAINT: `increment_credits` is service-role only — there is no self-serve credit
  purchase flow yet. Until payment integration is added, credits can only be granted by an admin.

## Rejected Alternatives
- **Middleware cookie / JWT custom claim for role**: Rejected for now — Supabase does not
  expose a hook to embed custom claims without a third-party Auth hook or a separate signing
  step. Deferred until the role check is proven to be a latency bottleneck.
- **Client-side premium check (React context)**: Rejected — any client-side gate can be
  bypassed by disabling JavaScript or patching in-memory state. Proxy-level enforcement is
  the only secure option for route protection.
- **Separate `credits` table**: Rejected — adds a join to every exam launch for a single
  integer value. Colocating with `profiles` is sufficient until a ledger is needed.
- **Supabase RLS policy for credit deduction**: Rejected — RLS policies cannot perform
  conditional atomic updates and insert into a second table in a single transaction.
  An RPC with SECURITY DEFINER is the correct tool for multi-step atomic operations.
- **Expose `increment_credits` to `authenticated` role (guarded by RLS)**: Rejected —
  RLS cannot restrict which user ID is passed as an argument. A malicious authenticated
  user could call the function with any UUID.
