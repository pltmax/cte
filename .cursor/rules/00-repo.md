---
description: "Repo-wide stack, architecture, and core sync rules. Source of truth: .claude.md"
alwaysApply: true
---

# Global Project Rules

- **Step 0:** Always read `CLAUDE.md` before generating code. It is the absolute source of truth.
- **Stack:** Next.js 15+ (App Router), FastAPI (Python 3.12+), Pydantic v2, Supabase.
- **Next.js 15 Breaking Change:** `params`, `searchParams`, and `cookies` are **Promises**. You MUST `await` them before accessing properties.

## Context Sources — Read Before Coding
- `docs/context/database.md`           → current DB schema, RLS policies, RPC functions
- `docs/context/api.md`                → FastAPI routes and Pydantic schemas
- `docs/context/dead_code_report.json` → files NOT to use (dead code)
- `docs/adr/`                          → architectural decision history

> If outdated: `npm run context:sync`

## Clarification Protocol
Ask before coding if: DB schema change (→ RLS impact), ambiguous auth scope, FastAPI route change (→ frontend type sync), file in dead_code_report would be used, or two valid approaches exist without an ADR.

## Architecture & Sync
- **Type Safety:** Frontend TypeScript interfaces in `frontend/src/types/` must strictly mirror Backend Pydantic models in `backend/app/models/`. No manual "guessing" of types.
- **Naming:** PascalCase for React components; snake_case for Python logic.
- **Guardrails:** Ignore `backend/.venv/`, `node_modules/`, and `frontend/.next/`. Use **context7** MCP to verify library versions/docs before suggesting deprecated code.

## Commands
- Install: `make install` | Dev: `make dev` | Docker: `docker compose up --build`
- Regenerate context: `npm run context:sync`