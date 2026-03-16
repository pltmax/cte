from slowapi import Limiter
from starlette.requests import Request


def _get_real_ip(request: Request) -> str:
    """Return the real client IP, honouring X-Forwarded-For set by Railway's proxy."""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # Header may be "client, proxy1, proxy2" — take the first entry
        return forwarded_for.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


# Shared rate-limiter instance — imported by main.py (for app wiring) and
# by any router that needs to apply per-route limits.
limiter = Limiter(key_func=_get_real_ip)
