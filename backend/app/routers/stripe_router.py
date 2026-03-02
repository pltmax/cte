import os
from datetime import datetime, timezone
from typing import Annotated

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request

from app.db import get_admin_client
from app.dependencies import require_auth
from app.limiter import limiter
from app.models.stripe import CheckoutRequest, CheckoutResponse, PortalResponse

# ─── Stripe config ────────────────────────────────────────────────────────────

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")

STRIPE_WEBHOOK_SECRET: str = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
STRIPE_PREMIUM_PRICE_ID: str = os.environ.get("STRIPE_PREMIUM_PRICE_ID", "")
STRIPE_CREDIT_PRICE_ID: str = os.environ.get("STRIPE_CREDIT_PRICE_ID", "")
APP_URL: str = os.environ.get("APP_URL", "http://localhost:3000")

# ─── Router ───────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/api/v1/stripe", tags=["stripe"])

# ─── Helpers ──────────────────────────────────────────────────────────────────


def _get_or_create_customer(admin: object, user_id: str, user_email: str) -> str:
    """Return existing Stripe customer ID or create a new one."""
    profile = (
        admin.table("profiles")  # type: ignore[attr-defined]
        .select("stripe_customer_id")
        .eq("id", user_id)
        .single()
        .execute()
    )
    existing = profile.data.get("stripe_customer_id") if profile.data else None

    if existing:
        return existing

    customer = stripe.Customer.create(
        email=user_email,
        metadata={"user_id": user_id},
    )
    admin.table("profiles").update({"stripe_customer_id": customer.id}).eq("id", user_id).execute()  # type: ignore[attr-defined]
    return customer.id


def _ts_to_iso(unix_ts: int | None) -> str | None:
    """Convert a Stripe Unix timestamp to an ISO-8601 string."""
    if unix_ts is None:
        return None
    return datetime.fromtimestamp(unix_ts, tz=timezone.utc).isoformat()


# ─── Checkout session ─────────────────────────────────────────────────────────


@router.post("/checkout", response_model=CheckoutResponse)
@limiter.limit("10/minute")
async def create_checkout_session(
    request: Request,
    body: CheckoutRequest,
    user_id: Annotated[str, Depends(require_auth)],
) -> CheckoutResponse:
    """Create a Stripe Checkout session for a subscription or credit purchase."""
    admin = get_admin_client()

    profile = (
        admin.table("profiles")
        .select("email, stripe_customer_id")
        .eq("id", user_id)
        .single()
        .execute()
    )
    user_email: str = (profile.data or {}).get("email") or ""
    customer_id = _get_or_create_customer(admin, user_id, user_email)

    if body.type == "subscription":
        session = stripe.checkout.Session.create(
            mode="subscription",
            customer=customer_id,
            line_items=[{"price": STRIPE_PREMIUM_PRICE_ID, "quantity": 1}],
            metadata={"user_id": user_id, "type": "subscription"},
            success_url=(
                f"{APP_URL}/credits/success?type=subscription"
                "&session_id={CHECKOUT_SESSION_ID}"
            ),
            cancel_url=f"{APP_URL}/credits",
        )
    else:
        session = stripe.checkout.Session.create(
            mode="payment",
            customer=customer_id,
            line_items=[{"price": STRIPE_CREDIT_PRICE_ID, "quantity": body.quantity}],
            metadata={
                "user_id": user_id,
                "type": "credits",
                "quantity": str(body.quantity),
            },
            success_url=(
                f"{APP_URL}/credits/success?type=credits&quantity={body.quantity}"
                "&session_id={CHECKOUT_SESSION_ID}"
            ),
            cancel_url=f"{APP_URL}/credits",
        )

    if not session.url:
        raise HTTPException(status_code=500, detail="Stripe did not return a URL")

    return CheckoutResponse(url=session.url)


# ─── Customer portal ──────────────────────────────────────────────────────────


@router.post("/portal", response_model=PortalResponse)
@limiter.limit("10/minute")
async def create_portal_session(
    request: Request,
    user_id: Annotated[str, Depends(require_auth)],
) -> PortalResponse:
    """Create a Stripe Customer Portal session for subscription management."""
    admin = get_admin_client()

    profile = (
        admin.table("profiles")
        .select("stripe_customer_id")
        .eq("id", user_id)
        .single()
        .execute()
    )
    customer_id = (profile.data or {}).get("stripe_customer_id")

    if not customer_id:
        raise HTTPException(status_code=400, detail="No Stripe customer found for this user")

    portal = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=f"{APP_URL}/credits",
    )

    return PortalResponse(url=portal.url)


# ─── Webhook ──────────────────────────────────────────────────────────────────


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: Annotated[str, Header(alias="stripe-signature")],
) -> dict[str, str]:
    """
    Stripe webhook endpoint.
    Verified via HMAC signature — no user auth required.
    Register this URL in the Stripe dashboard (or use `stripe listen` locally).
    """
    payload = await request.body()

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type: str = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        _handle_checkout_completed(data)
    elif event_type in ("customer.subscription.created", "customer.subscription.updated"):
        _handle_subscription_updated(data)
    elif event_type == "customer.subscription.deleted":
        _handle_subscription_deleted(data)

    return {"received": "true"}


# ─── Webhook handlers ─────────────────────────────────────────────────────────


def _handle_checkout_completed(session: dict) -> None:  # type: ignore[type-arg]
    user_id: str = session.get("metadata", {}).get("user_id", "")
    session_type: str = session.get("metadata", {}).get("type", "")
    customer_id: str = session.get("customer", "")

    if not user_id:
        return

    admin = get_admin_client()

    # Persist customer ID (idempotent)
    if customer_id:
        admin.table("profiles").update({"stripe_customer_id": customer_id}).eq(
            "id", user_id
        ).execute()

    if session_type == "subscription":
        # Role is set authoritatively by the subscription.updated event,
        # but grant premium here too for immediate access.
        admin.table("profiles").update({"role": "premium"}).eq(
            "id", user_id
        ).execute()

    elif session_type == "credits":
        quantity = int(session.get("metadata", {}).get("quantity", "1"))
        admin.rpc(
            "increment_credits",
            {"target_user_id": user_id, "amount": quantity},
        ).execute()


def _handle_subscription_updated(subscription: dict) -> None:  # type: ignore[type-arg]
    customer_id: str = subscription.get("customer", "")
    status: str = subscription.get("status", "")

    admin = get_admin_client()

    profile = (
        admin.table("profiles")
        .select("id")
        .eq("stripe_customer_id", customer_id)
        .single()
        .execute()
    )
    if not profile.data:
        return

    user_id: str = profile.data["id"]

    # Upsert subscription record
    admin.table("subscriptions").upsert(
        {
            "id": subscription["id"],
            "user_id": user_id,
            "stripe_customer_id": customer_id,
            "status": status,
            "current_period_end": _ts_to_iso(subscription.get("current_period_end")),
            "cancel_at": _ts_to_iso(subscription.get("cancel_at")),
        }
    ).execute()

    # Sync role: premium only when subscription is active
    new_role = "premium" if status == "active" else "user"
    admin.table("profiles").update({"role": new_role}).eq("id", user_id).execute()


def _handle_subscription_deleted(subscription: dict) -> None:  # type: ignore[type-arg]
    customer_id: str = subscription.get("customer", "")

    admin = get_admin_client()

    profile = (
        admin.table("profiles")
        .select("id")
        .eq("stripe_customer_id", customer_id)
        .single()
        .execute()
    )
    if not profile.data:
        return

    user_id: str = profile.data["id"]

    admin.table("profiles").update({"role": "user"}).eq("id", user_id).execute()
    admin.table("subscriptions").update({"status": "canceled"}).eq(
        "id", subscription["id"]
    ).execute()
