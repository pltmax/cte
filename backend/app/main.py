import os
from pathlib import Path

from dotenv import load_dotenv

# Load root .env (no-op in production where env vars are injected directly)
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent.parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.limiter import limiter
from app.routers import admin
from app.routers import stripe_router

app = FastAPI(title="Project 1 API")

# ─── Rate limiting ────────────────────────────────────────────────────────────

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore[arg-type]

# ─── CORS ─────────────────────────────────────────────────────────────────────
# Derive allowed origins from APP_URL (set in .env / deployment env vars).
# In development APP_URL defaults to http://localhost:3000.
# In production set APP_URL=https://yourdomain.com (and optionally
# CORS_EXTRA_ORIGINS=https://www.yourdomain.com as a comma-separated list).

_app_url = os.environ.get("APP_URL", "http://localhost:3000").rstrip("/")
_extra = os.environ.get("CORS_EXTRA_ORIGINS", "")
_allowed_origins: list[str] = list(
    filter(None, [_app_url] + [o.strip() for o in _extra.split(",") if o.strip()])
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type", "stripe-signature"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────

app.include_router(admin.router)
app.include_router(stripe_router.router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello World"}


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
