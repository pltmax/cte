# /sync-context

Regenerate all context files in `docs/context/`.

Run:
```bash
npm run context:sync
```

Then confirm which files were updated:
- `docs/context/database.md` — Supabase schema, RLS, RPC
- `docs/context/api.md` — FastAPI routes and Pydantic schemas
- `docs/context/dead_code_report.json` — unused files in frontend

After running, read the updated files and summarize what changed (new tables, new routes, dead code detected).
