#!/usr/bin/env python3
"""
Seed all 7 TOEIC part tables from the pre-built exam JSONs
(mockexamData/exams/exam_1..4.json), assigning dataset_id 1–4 to each row.

This replaces seed_toeic_listening.py + seed_toeic_reading.py for the exam flow.
Each table is fully cleared and reseeded from the exam JSONs so the DB is the
single source of truth for the mock exam page.

Usage:
    python scripts/supabase/seed_exam_datasets.py              # all 4 exams × 7 parts
    python scripts/supabase/seed_exam_datasets.py --exams 1 3  # specific exams only
    python scripts/supabase/seed_exam_datasets.py --dry-run    # preview only

Idempotency: deletes ALL rows from each table before reinserting, so re-running
is always safe.
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
EXAM_DIR = REPO_ROOT / "mockexamData" / "exams"

# ── Table names ───────────────────────────────────────────────────────────────

TABLES = [
    "toeic_listening_part1",
    "toeic_listening_part2",
    "toeic_listening_part3",
    "toeic_listening_part4",
    "toeic_reading_part5",
    "toeic_reading_part6",
    "toeic_reading_part7",
]

# ── Row builders ──────────────────────────────────────────────────────────────

def rows_part1(items: list[dict], dataset_id: int) -> list[dict[str, Any]]:
    return [
        {
            "position": i + 1,
            "dataset_id": dataset_id,
            "image": q.get("image"),
            "statements": q["statements"],
            "answer": q["answer"],
            "image_url": q.get("image_url"),
            "audio_urls": q.get("audio_urls"),
            "is_exam": True,
        }
        for i, q in enumerate(items)
    ]


def rows_part2(items: list[dict], dataset_id: int) -> list[dict[str, Any]]:
    return [
        {
            "position": i + 1,
            "dataset_id": dataset_id,
            "category": q.get("category"),
            "question": q["question"],
            "options": q["options"],
            "answer": q["answer"],
            "question_audio_url": q.get("question_audio_url"),
            "option_audio_urls": q.get("option_audio_urls"),
            "is_exam": True,
        }
        for i, q in enumerate(items)
    ]


def rows_part3(items: list[dict], dataset_id: int) -> list[dict[str, Any]]:
    return [
        {
            "position": i + 1,
            "dataset_id": dataset_id,
            "dialogue": c["dialogue"],
            "questions": c["questions"],
            "audio_url": c.get("audio_url"),
            "is_exam": True,
        }
        for i, c in enumerate(items)
    ]


def rows_part4(items: list[dict], dataset_id: int) -> list[dict[str, Any]]:
    return [
        {
            "position": i + 1,
            "dataset_id": dataset_id,
            "title": t.get("title"),
            "text": t["text"],
            "questions": t["questions"],
            "audio_url": t.get("audio_url"),
            "graphic_title": t.get("graphic_title"),
            "graphic_doctype": t.get("graphic_doctype"),
            "graphic": t.get("graphic"),
            "is_exam": True,
        }
        for i, t in enumerate(items)
    ]


def rows_part5(items: list[dict], dataset_id: int) -> list[dict[str, Any]]:
    return [
        {
            "position": i + 1,
            "dataset_id": dataset_id,
            "text": q["text"],
            "options": q["options"],
            "answer": q["answer"],
            "is_exam": True,
        }
        for i, q in enumerate(items)
    ]


def rows_part6(items: list[dict], dataset_id: int) -> list[dict[str, Any]]:
    return [
        {
            "position": i + 1,
            "dataset_id": dataset_id,
            "doctype": p.get("doctype"),
            "text": p["text"],
            "questions": p["questions"],
            "is_exam": True,
        }
        for i, p in enumerate(items)
    ]


def rows_part7(items: list[dict], dataset_id: int) -> list[dict[str, Any]]:
    return [
        {
            "position": i + 1,
            "dataset_id": dataset_id,
            "documents": p["documents"],
            "questions": p["questions"],
            "is_exam": True,
        }
        for i, p in enumerate(items)
    ]


PART_KEYS = ["part1", "part2", "part3", "part4", "part5", "part6", "part7"]
ROW_BUILDERS = [rows_part1, rows_part2, rows_part3, rows_part4, rows_part5, rows_part6, rows_part7]

# ── Core logic ────────────────────────────────────────────────────────────────

def collect_rows(exams: list[int]) -> dict[str, list[dict[str, Any]]]:
    """Read exam JSONs and build a {table: [rows]} mapping."""
    all_rows: dict[str, list[dict[str, Any]]] = {t: [] for t in TABLES}

    for exam_num in exams:
        path = EXAM_DIR / f"exam_{exam_num}.json"
        with open(path) as f:
            exam = json.load(f)

        for key, table, builder in zip(PART_KEYS, TABLES, ROW_BUILDERS):
            all_rows[table].extend(builder(exam[key], dataset_id=exam_num))

    return all_rows


def seed(client: Client, exams: list[int], dry_run: bool) -> None:
    rows_by_table = collect_rows(exams)

    for table, rows in rows_by_table.items():
        print(f"\n{table}")
        print(f"  {len(rows)} rows to insert (exams {exams})")

        if dry_run:
            for i, row in enumerate(rows[:2]):
                print(f"  [dry-run] row {i + 1}: {json.dumps(row, ensure_ascii=False)[:120]}…")
            continue

        # Clear all existing rows so the table exactly mirrors the exam JSONs
        client.table(table).delete().in_("dataset_id", exams).execute()
        print(f"  Deleted rows for dataset_id in {exams}")

        client.table(table).insert(rows).execute()
        print(f"  Inserted {len(rows)} rows ✓")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Seed all 7 TOEIC part tables from exam JSON files"
    )
    parser.add_argument(
        "--exams",
        nargs="+",
        type=int,
        choices=[1, 2, 3, 4],
        default=[1, 2, 3, 4],
        help="Exam datasets to seed (default: all 4)",
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
    print(f"Seeding exams {args.exams}  dry_run={args.dry_run}")
    seed(client, args.exams, dry_run=args.dry_run)

    if not args.dry_run:
        print("\nDone.")


if __name__ == "__main__":
    main()
