#!/bin/bash
set -e

echo "Generating architectural context..."
mkdir -p docs/context

# 1. DATABASE (Supabase)
echo "[1/3] Supabase introspection..."
if [ -f .env ] && grep -q DATABASE_URL .env 2>/dev/null; then
  npx tsx scripts/introspect-supabase.ts > docs/context/database.md
  echo "  -> docs/context/database.md"
else
  echo "  WARNING: DATABASE_URL missing in .env — skipping DB introspection"
  echo "  Add DATABASE_URL (Supabase session mode, port 5432) to .env"
fi

# 2. FASTAPI API
echo "[2/3] FastAPI introspection..."
if [ -d backend ] && [ -f backend/requirements.txt ]; then
  python3 scripts/introspect-fastapi.py > docs/context/api.md
  echo "  -> docs/context/api.md"
else
  echo "  WARNING: backend/ not found — skipping FastAPI introspection"
fi

# 3. DEAD CODE (Knip)
echo "[3/3] Dead code detection (Knip)..."
if [ -f frontend/knip.json ]; then
  cd frontend
  npx knip --reporter json > ../docs/context/dead_code_report.json 2>/dev/null || true
  cd ..
  echo "  -> docs/context/dead_code_report.json"
else
  echo "  WARNING: frontend/knip.json not found — skipping dead code detection"
fi

# Auto-stage if called from Husky
if [ "$HUSKY" = "1" ]; then
  git add docs/context/ 2>/dev/null || true
fi

echo ""
echo "Context generated in docs/context/"
echo "Files: $(ls docs/context/ 2>/dev/null | tr '\n' ' ')"
