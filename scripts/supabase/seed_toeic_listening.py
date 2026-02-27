#!/usr/bin/env python3
"""
Seed TOEIC Listening Parts 1–4 from transcript JSONs into Supabase.

Usage:
    python scripts/supabase/seed_toeic_listening.py              # all 4 parts
    python scripts/supabase/seed_toeic_listening.py --parts 1 3  # specific parts
    python scripts/supabase/seed_toeic_listening.py --dry-run     # preview only

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

# ── Paths ────────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parents[2]
TRANSCRIPT_DIR = REPO_ROOT / "mockexamData" / "TOEIC"

PART_CONFIG: dict[int, dict[str, Any]] = {
    1: {
        "json_path": TRANSCRIPT_DIR / "listening_part1" / "part1_transcript.json",
        "json_key": "questions",
        "table": "toeic_listening_part1",
    },
    2: {
        "json_path": TRANSCRIPT_DIR / "listening_part2" / "part2_transcript.json",
        "json_key": "questions",
        "table": "toeic_listening_part2",
    },
    3: {
        "json_path": TRANSCRIPT_DIR / "listening_part3" / "part3_transcript.json",
        "json_key": "conversations",
        "table": "toeic_listening_part3",
    },
    4: {
        "json_path": TRANSCRIPT_DIR / "listening_part4" / "part4_transcript.json",
        "json_key": "talks",
        "table": "toeic_listening_part4",
    },
}


# ── Row builders ─────────────────────────────────────────────────────────────

def build_part1_row(item: dict[str, Any], position: int) -> dict[str, Any]:
    return {
        "position": position,
        "image": item.get("image"),
        "statements": item["statements"],
        "answer": item["answer"],
        "image_url": item.get("image_url"),
        "audio_urls": item.get("audio_urls"),
        "is_exam": True,
    }


def build_part2_row(item: dict[str, Any], position: int) -> dict[str, Any]:
    return {
        "position": position,
        "category": item.get("category"),
        "question": item["question"],
        "options": item["options"],
        "answer": item["answer"],
        "question_audio_url": item.get("question_audio_url"),
        "option_audio_urls": item.get("option_audio_urls"),
        "is_exam": True,
    }


def build_part3_row(item: dict[str, Any], position: int) -> dict[str, Any]:
    return {
        "position": position,
        "dialogue": item["dialogue"],
        "questions": item["questions"],
        "audio_url": item.get("audio_url"),
        "is_exam": True,
    }


def build_part4_row(item: dict[str, Any], position: int) -> dict[str, Any]:
    return {
        "position": position,
        "title": item.get("title"),
        "text": item["text"],
        "questions": item["questions"],
        "audio_url": item.get("audio_url"),
        "graphic_title": item.get("graphic_title"),
        "graphic_doctype": item.get("graphic_doctype"),
        "graphic": item.get("graphic"),
        "is_exam": True,
    }


ROW_BUILDERS = {
    1: build_part1_row,
    2: build_part2_row,
    3: build_part3_row,
    4: build_part4_row,
}


# ── Core logic ────────────────────────────────────────────────────────────────

def load_rows(part: int) -> list[dict[str, Any]]:
    cfg = PART_CONFIG[part]
    with open(cfg["json_path"]) as f:
        data = json.load(f)
    items: list[dict[str, Any]] = data[cfg["json_key"]]
    builder = ROW_BUILDERS[part]
    return [builder(item, idx + 1) for idx, item in enumerate(items)]


def seed_part(
    client: Client,
    part: int,
    dry_run: bool,
) -> None:
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
    parser = argparse.ArgumentParser(description="Seed TOEIC listening data into Supabase")
    parser.add_argument(
        "--parts",
        nargs="+",
        type=int,
        choices=[1, 2, 3, 4],
        default=[1, 2, 3, 4],
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
