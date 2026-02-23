---
description: "FastAPI strict typing and dependency injection in backend/"
globs: backend/**/*.py
alwaysApply: false
---

# Backend: FastAPI

- **Strict Typing:** **Prohibited:** `dict`, `Any`, or raw JSON returns. Every endpoint must use a Pydantic `response_model`.
- **Async Standards:** Use `async def` for all routes and DB operations. No blocking I/O.
- **Modern DI:** Use `Annotated` for all dependencies: `db: Annotated[Client, Depends(get_supabase_client)]`.
- **Structure:** - Routers: `backend/app/routers/` (prefixed `/api/v1`).
  - Models: `backend/app/models/`.
- **Supabase:** Use `get_supabase_client()` from `app.db`. Never instantiate the client manually inside a route.