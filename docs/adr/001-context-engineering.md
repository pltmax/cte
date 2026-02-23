# ADR-001: Setting up Context Engineering
**Date**: 2026-02-23
**Status**: Accepted

## Context
"Choppe Ton Exam" is a full-stack project (FastAPI + Next.js + Supabase) without a context
persistence system. Without it, Claude Code has no access to RLS logic, API routes, or frontend
architecture between sessions — leading to repeated mistakes and lost context.

## Decision
Setting up a deterministic context generation system:
- **SQL introspection** (`scripts/introspect-supabase.ts`) for full Supabase schema (tables, RLS, RPC)
- **OpenAPI introspection** (`scripts/introspect-fastapi.py`) for FastAPI routes and Pydantic schemas
- **Knip** for dead code detection in the Next.js frontend
- **Husky hooks** for automatic context regeneration on every push
- **CLAUDE.md** as the short project constitution (< 60 lines) pointing to generated docs
- **ADRs** in `docs/adr/` for decision history

## Consequences
- POSITIVE: Claude Code understands 100% of the project at the start of every session
- POSITIVE: Context auto-regenerated on every push without manual effort
- POSITIVE: RLS security always visible and verifiable
- POSITIVE: Dead code detected before it accumulates
- TRADEOFF: ~10-20s added to every `git push` for context regeneration
- CONSTRAINT: DB schema modifiable only via `supabase/migrations/` — never directly

## Rejected Alternatives
- Manual documentation: too costly to maintain, always drifts out of sync
- Inline comments only: not machine-readable; lost between sessions
- Single large CLAUDE.md: against the < 60 line rule; hard to maintain
