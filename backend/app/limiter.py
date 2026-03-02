from slowapi import Limiter
from slowapi.util import get_remote_address

# Shared rate-limiter instance — imported by main.py (for app wiring) and
# by any router that needs to apply per-route limits.
limiter = Limiter(key_func=get_remote_address)
