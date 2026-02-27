from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from app.db import get_admin_client
from app.dependencies import require_admin
from app.models.admin import AddCreditsRequest, MessageResponse

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


@router.post(
    "/users/{user_id}/premium",
    response_model=MessageResponse,
    summary="Grant premium role to a user",
)
async def grant_premium(
    user_id: str,
    _: Annotated[str, Depends(require_admin)],
) -> MessageResponse:
    """Set a user's role to 'premium'. Requires admin authorization."""
    admin = get_admin_client()

    result = (
        admin.table("profiles")
        .update({"role": "premium"})
        .eq("id", user_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    return MessageResponse(message=f"User {user_id} has been granted premium role")


@router.post(
    "/users/{user_id}/credits",
    response_model=MessageResponse,
    summary="Add credits to a user's account",
)
async def add_credits(
    user_id: str,
    body: AddCreditsRequest,
    _: Annotated[str, Depends(require_admin)],
) -> MessageResponse:
    """Add N credits to a user's account. Requires admin authorization."""
    admin = get_admin_client()

    try:
        admin.rpc(
            "increment_credits",
            {"target_user_id": user_id, "amount": body.amount},
        ).execute()
    except Exception as exc:
        if "user_not_found" in str(exc):
            raise HTTPException(status_code=404, detail="User not found")
        raise HTTPException(status_code=500, detail="Failed to add credits")

    return MessageResponse(
        message=f"Added {body.amount} credit(s) to user {user_id}"
    )
