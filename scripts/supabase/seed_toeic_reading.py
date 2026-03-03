#!/usr/bin/env python3
"""
Seed TOEIC Reading Parts 5–7 from content JSONs into Supabase.

Usage:
    python scripts/supabase/seed_toeic_reading.py              # all 3 parts
    python scripts/supabase/seed_toeic_reading.py --parts 5 7  # specific parts
    python scripts/supabase/seed_toeic_reading.py --dry-run    # preview only

Idempotency: deletes rows where is_exam=true before each insert, so re-running
is safe. Rows with is_exam=false (future exercises) are never touched.
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from supabase import create_client, Client

# ── Paths ─────────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parents[2]
READING_DIR = REPO_ROOT / "mockexamData" / "TOEIC"

PART_CONFIG: dict[int, dict[str, Any]] = {
    5: {
        "json_path": READING_DIR / "reading_part5" / "part5_content.json",
        "json_key": "questions",
        "table": "toeic_reading_part5",
    },
    6: {
        "json_path": READING_DIR / "reading_part6" / "part6_content.json",
        "json_key": "passages",
        "table": "toeic_reading_part6",
    },
    7: {
        "json_path": READING_DIR / "reading_part7" / "part7_content.json",
        "json_key": "passages",
        "table": "toeic_reading_part7",
    },
}


# ── Row builders ──────────────────────────────────────────────────────────────

def build_part5_row(item: dict[str, Any], position: int) -> dict[str, Any]:
    return {
        "position": position,
        "text": item["text"],
        "options": item["options"],
        "answer": item["answer"],
        "is_exam": True,
    }


def build_part6_row(item: dict[str, Any], position: int) -> dict[str, Any]:
    return {
        "position": position,
        "doctype": item.get("doctype"),
        "text": item["text"],
        "questions": item["questions"],
        "is_exam": True,
    }


def build_part7_row(item: dict[str, Any], position: int) -> dict[str, Any]:
    return {
        "position": position,
        "documents": item["documents"],
        "questions": item["questions"],
        "is_exam": True,
    }


ROW_BUILDERS = {
    5: build_part5_row,
    6: build_part6_row,
    7: build_part7_row,
}


# ── Core logic ────────────────────────────────────────────────────────────────

def load_rows(part: int) -> list[dict[str, Any]]:
    cfg = PART_CONFIG[part]
    with open(cfg["json_path"]) as f:
        data = json.load(f)
    items: list[dict[str, Any]] = data[cfg["json_key"]]
    builder = ROW_BUILDERS[part]
    return [builder(item, idx + 1) for idx, item in enumerate(items)]


def seed_part(client: Client, part: int, dry_run: bool) -> None:
    cfg = PART_CONFIG[part]
    table = cfg["table"]
    rows = load_rows(part)

    print(f"\nPart {part} → {table}")
    print(f"  {len(rows)} rows to insert")

    if dry_run:
        for i, row in enumerate(rows[:3]):
            print(f"  [dry-run] row {i + 1}: {json.dumps(row, ensure_ascii=False)[:120]}…")
        if len(rows) > 3:
            print(f"  [dry-run] … and {len(rows) - 3} more rows")
        return

    # Delete existing exam rows first (idempotent)
    client.table(table).delete().eq("is_exam", True).execute()
    print(f"  Deleted existing is_exam=true rows")

    # Insert in a single batch
    client.table(table).insert(rows).execute()
    print(f"  Inserted {len(rows)} rows ✓")


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed TOEIC reading data into Supabase")
    parser.add_argument(
        "--parts",
        nargs="+",
        type=int,
        choices=[5, 6, 7],
        default=[5, 6, 7],
        help="Parts to seed (default: all)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print rows without touching the DB",
    )
    args = parser.parse_args()

    load_dotenv(REPO_ROOT / ".env")

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set", file=sys.stderr)
        sys.exit(1)

    client: Client = create_client(url, key)

    print(f"Seeding parts: {args.parts}  dry_run={args.dry_run}")

    for part in sorted(args.parts):
        seed_part(client, part, dry_run=args.dry_run)

    if not args.dry_run:
        print("\nDone. Verify row counts in the Supabase dashboard.")


if __name__ == "__main__":
    main()
