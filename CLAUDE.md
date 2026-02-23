# Choppe Ton Exam — Project Constitution

## Overview
French exam prep platform (TOEIC, TOEFL, etc.). Full-stack: Next.js (frontend), FastAPI (backend), Supabase (database/auth). Makefile for local dev, Docker for containerization.

## Tech Stack
| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | Next.js 15+ (App Router) + React + TypeScript       |
| Backend   | FastAPI (Python 3.12+) + Pydantic v2 + Supabase-py  |
| UI        | Tailwind CSS — path alias `@/` → `frontend/src/`    |
| Database  | PostgreSQL (Supabase managed)                       |
| Auth      | Supabase Auth (JWT)                                 |

## Sources of Truth — Read FIRST
- `docs/context/context_main.json`     → frontend component tree (LogicStamp AST)
- `docs/context/database.md`           → DB schema, RLS policies, RPC functions
- `docs/context/api.md`                → FastAPI routes, Pydantic schemas
- `docs/context/dead_code_report.json` → frontend files NOT to use
- `docs/adr/`                          → architectural decision history

> If outdated: `npm run context:sync`

## Clarification Protocol (MANDATORY)
Ask a question BEFORE coding if:
1. DB schema modification → check RLS impact first
2. Ambiguous scope (anonymous vs authenticated? SSR vs client component?)
3. FastAPI route modified → verify frontend type consistency
4. File in `dead_code_report.json` would be used → flag it explicitly
5. Two valid approaches exist with no ADR to decide between them

## Absolute Rules
- Tailwind only — no separate CSS files; reuse variables from `globals.css`
- No `any` in TypeScript; no raw `dict`/`Any` returns in Python
- Type annotations on every FastAPI function; `response_model` on every endpoint
- RLS mandatory on every Supabase table; migrations only via `supabase/migrations/`
- `frontend/src/types/` must mirror `backend/app/models/` — no manual type guessing
- `"use client"` only at leaf level — never on `page.tsx` or `layout.tsx`
- `params`, `searchParams`, `cookies` are Promises in Next.js 15 — always `await`
- `async def` for all FastAPI routes and DB operations — no blocking I/O
- Use **context7** MCP to verify library docs before suggesting deprecated APIs

## Frontend
- Server Components by default; `"use client"` only for interactivity at leaf level
- Data fetching: `fetch()` only — no axios; use `next: { revalidate: ... }` for caching
- Every main route segment needs `loading.tsx` and `error.tsx`
- Reusable UI in `frontend/src/components/`; imports via `@/` alias only
- API route validation: use **zod** schemas, export types with `z.infer<typeof schema>`
- Frontend calls backend via `/api/v1`; always provide TypeScript interfaces for responses

## Backend
- Entrypoint: `backend/app/main.py` — `uvicorn app.main:app --reload --port 8000`
- Routers in `backend/app/routers/` (prefix `/api/v1`); models in `backend/app/models/`
- DI pattern: `db: Annotated[Client, Depends(get_supabase_client)]` — never instantiate in handlers
- CORS: configured for `http://localhost:3000`; extend `allow_origins` only for new origins

## Supabase
- Frontend: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-side, RLS-restricted)
- Backend: `SUPABASE_URL` + `SUPABASE_ANON_KEY` via `get_supabase_client()` — never `NEXT_PUBLIC_`
- `SUPABASE_SERVICE_ROLE_KEY` — backend-only, bypasses RLS; use only for admin/migrations
- Route protection: Next.js middleware/SSR — not manual `getSession()` in every page
- RBAC via JWT claims or `profiles` table in SQL policies — not different API keys per tier
- Schema changes: always provide `CREATE POLICY` SQL for `anon`, `authenticated`, `admin`

## Git & PR Workflow
- Verify build before committing: `npm run build` (frontend) or `pytest` (backend)
- One logical change per commit; conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- After task + verification: commit and open PR via `gh pr create` without waiting for permission
- PR body: **Summary** (what/why) + **Test plan** (e.g. "Run `make dev`, log in, check `/dashboard`")
- If `gh` is unavailable: output commit message + PR text for manual use
- Migrations / new routers / model changes → consider an ADR in `docs/adr/` (use `archivist` agent)

## Key Commands
- `make dev` / `make frontend` / `make backend`
- `docker compose up --build` / `docker compose down`
- `npm run context:sync` — regenerate `docs/context/`
- `make install` — install all dependencies
