import os
from datetime import datetime, timedelta, timezone
from typing import Annotated

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request

from app.db import get_admin_client
from app.dependencies import require_auth
from app.limiter import limiter
from app.models.stripe import CheckoutRequest, CheckoutResponse

# ─── Stripe config ────────────────────────────────────────────────────────────

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")

STRIPE_RUSH_PRICE_ID: str = os.environ.get("STRIPE_RUSH_PRICE_ID", "")
STRIPE_CHILL_PRICE_ID: str = os.environ.get("STRIPE_CHILL_PRICE_ID", "")
STRIPE_CREDIT_PRICE_ID: str = os.environ.get("STRIPE_CREDIT_PRICE_ID", "")
APP_URL: str = os.environ.get("APP_URL", "http://localhost:3000")

# Plan durations
PLAN_DURATIONS: dict[str, timedelta] = {
    "rush": timedelta(days=14),
    "chill": timedelta(days=30),
}

# Credits included per plan
PLAN_CREDITS: dict[str, int] = {
    "rush": 2,
    "chill": 4,
}

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


def _plan_active(profile_data: dict) -> bool:  # type: ignore[type-arg]
    """Return True if the user currently has an active (non-expired) plan."""
    if profile_data.get("role") not in ("premium", "admin"):
        return False
    if profile_data.get("role") == "admin":
        return True
    expires_at_str: str | None = profile_data.get("premium_expires_at")
    if not expires_at_str:
        return False
    expires_at = datetime.fromisoformat(expires_at_str.replace("Z", "+00:00"))
    return expires_at > datetime.now(timezone.utc)


# ─── Checkout session ─────────────────────────────────────────────────────────


@router.post("/checkout", response_model=CheckoutResponse)
@limiter.limit("10/minute")
async def create_checkout_session(
    request: Request,
    body: CheckoutRequest,
    user_id: Annotated[str, Depends(require_auth)],
) -> CheckoutResponse:
    """Create a Stripe Checkout session for a Rush/Chill plan or extra credit."""
    admin = get_admin_client()

    profile_res = (
        admin.table("profiles")
        .select("email, stripe_customer_id, role, premium_expires_at")
        .eq("id", user_id)
        .single()
        .execute()
    )
    profile_data: dict = profile_res.data or {}  # type: ignore[type-arg]
    user_email: str = profile_data.get("email") or ""
    active = _plan_active(profile_data)

    customer_id = _get_or_create_customer(admin, user_id, user_email)

    if body.type in ("rush", "chill"):
        if active:
            raise HTTPException(
                status_code=400,
                detail="You already have an active plan. Wait for it to expire before purchasing a new one.",
            )
        price_id = STRIPE_RUSH_PRICE_ID if body.type == "rush" else STRIPE_CHILL_PRICE_ID
        session = stripe.checkout.Session.create(
            mode="payment",
            customer=customer_id,
            line_items=[{"price": price_id, "quantity": 1}],
            metadata={"user_id": user_id, "type": body.type},
            success_url=(
                f"{APP_URL}/credits/success?type={body.type}"
                "&session_id={CHECKOUT_SESSION_ID}"
            ),
            cancel_url=f"{APP_URL}/parametres",
        )

    else:  # credit
        if not active:
            raise HTTPException(
                status_code=403,
                detail="An active Rush or Chill plan is required to purchase extra credits.",
            )
        session = stripe.checkout.Session.create(
            mode="payment",
            customer=customer_id,
            line_items=[{"price": STRIPE_CREDIT_PRICE_ID, "quantity": 1}],
            metadata={"user_id": user_id, "type": "credit"},
            success_url=(
                f"{APP_URL}/credits/success?type=credit"
                "&session_id={CHECKOUT_SESSION_ID}"
            ),
            cancel_url=f"{APP_URL}/parametres",
        )

    if not session.url:
        raise HTTPException(status_code=500, detail="Stripe did not return a URL")

    return CheckoutResponse(url=session.url)
