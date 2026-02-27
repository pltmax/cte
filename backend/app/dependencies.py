from typing import Annotated

from fastapi import Depends, Header, HTTPException

from app.db import get_admin_client


async def require_auth(authorization: Annotated[str, Header()]) -> str:
    """
    Verify Bearer JWT and return the caller's user_id.
    Raises 401 on any auth failure.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authorization header must be 'Bearer <token>'",
        )

    token = authorization.removeprefix("Bearer ").strip()
    admin = get_admin_client()

    try:
        user_resp = admin.auth.get_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if not user_resp or not user_resp.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return user_resp.user.id


async def require_admin(
    user_id: Annotated[str, Depends(require_auth)],
) -> str:
    """
    Verify Bearer JWT and assert the caller has admin role.
    Depends on require_auth — FastAPI resolves the chain automatically.
    Returns the caller's user_id on success.
    """
    admin = get_admin_client()
    profile = (
        admin.table("profiles")
        .select("role")
        .eq("id", user_id)
        .single()
        .execute()
    )
    if not profile.data or profile.data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin role required")

    return user_id
