#!/usr/bin/env python3
"""
Seed exercise data from local JSON files into Supabase.

Run once after applying migration 20260311000001_exercises_to_supabase.sql:
    DATABASE_URL=<url> python3 scripts/supabase/seed_exercises.py

Or with .env.local auto-loaded:
    python3 scripts/supabase/seed_exercises.py

Idempotent: deletes all is_exam=false rows first, then re-inserts.
"""

import json
import os
import re
import sys
from pathlib import Path

import psycopg2
import psycopg2.extras

# ── Paths ──────────────────────────────────────────────────────────────────────

BASE = Path(__file__).resolve().parent.parent.parent  # project root
EXERCISES_DIR = BASE / "frontend" / "src" / "data" / "exercices"
ENV_FILE = BASE / "frontend" / ".env.local"


def load_env():
    if not ENV_FILE.exists():
        return
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        m = re.match(r'^([A-Z_]+)=(.+)$', line)
        if m:
            key, val = m.group(1), m.group(2).strip('"\'')
            os.environ.setdefault(key, val)


def load_json(filename: str) -> dict:
    with open(EXERCISES_DIR / filename) as f:
        return json.load(f)


def j(v) -> str | None:
    """Serialize to JSON string for psycopg2 Json adapter."""
    return psycopg2.extras.Json(v)


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    load_env()
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("ERROR: DATABASE_URL not set", file=sys.stderr)
        sys.exit(1)

    conn = psycopg2.connect(db_url)
    conn.autocommit = False
    cur = conn.cursor()

    # ── Part 1 ─────────────────────────────────────────────────────────────────
    print("Seeding Part 1…")
    cur.execute("DELETE FROM toeic_listening_part1 WHERE is_exam = false")
    p1 = load_json("part1_exercises.json")
    for i, q in enumerate(p1["questions"], 1):
        cur.execute(
            """
            INSERT INTO toeic_listening_part1
              (is_exam, category, position, image, statements, answer,
               image_url, audio_urls, explanation)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                False,
                q["type"],
                i,
                q.get("image"),
                j(q.get("statements", [])),
                q["answer"],
                q.get("image_url"),
                j(q.get("audio_urls")),
                j(q["explanation"]),
            ),
        )
    print(f"  Inserted {len(p1['questions'])} rows")

    # ── Part 2 ─────────────────────────────────────────────────────────────────
    print("Seeding Part 2…")
    cur.execute("DELETE FROM toeic_listening_part2 WHERE is_exam = false")
    p2 = load_json("part2_exercises.json")
    for i, q in enumerate(p2["questions"], 1):
        cur.execute(
            """
            INSERT INTO toeic_listening_part2
              (is_exam, category, position, question, options, answer,
               question_audio_url, option_audio_urls, explanation)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                False,
                q["category"],
                i,
                q["question"],
                j(q.get("options", [])),
                q["answer"],
                q.get("question_audio_url"),
                j(q.get("option_audio_urls")),
                j(q["explanation"]),
            ),
        )
    print(f"  Inserted {len(p2['questions'])} rows")

    # ── Part 3 ─────────────────────────────────────────────────────────────────
    print("Seeding Part 3…")
    cur.execute("DELETE FROM toeic_listening_part3 WHERE is_exam = false")
    p3 = load_json("part3_exercises.json")
    for i, conv in enumerate(p3["conversations"], 1):
        # Embed explanation in each question inside the JSONB array
        questions_with_expl = conv["questions"]  # already have explanation
        cur.execute(
            """
            INSERT INTO toeic_listening_part3
              (is_exam, conv_type, position, dialogue, questions, audio_url)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                False,
                conv["type"],
                i,
                j(conv["dialogue"]),
                j(questions_with_expl),
                conv.get("audio_url"),
            ),
        )
    print(f"  Inserted {len(p3['conversations'])} rows")

    # ── Part 4 ─────────────────────────────────────────────────────────────────
    print("Seeding Part 4…")
    cur.execute("DELETE FROM toeic_listening_part4 WHERE is_exam = false")
    p4 = load_json("part4_exercises.json")
    for i, talk in enumerate(p4["talks"], 1):
        cur.execute(
            """
            INSERT INTO toeic_listening_part4
              (is_exam, position, title, text, questions, audio_url,
               graphic_title, graphic_doctype, graphic)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                False,
                i,
                talk.get("title"),
                talk.get("text", ""),
                j(talk["questions"]),  # questions already contain explanation
                talk.get("audio_url"),
                talk.get("graphic_title"),
                talk.get("graphic_doctype"),
                j(talk.get("graphic")) if talk.get("graphic") else None,
            ),
        )
    print(f"  Inserted {len(p4['talks'])} rows")

    # ── Part 5 ─────────────────────────────────────────────────────────────────
    print("Seeding Part 5…")
    cur.execute("DELETE FROM toeic_reading_part5 WHERE is_exam = false")
    p5 = load_json("part5_exercises.json")
    for i, q in enumerate(p5["questions"], 1):
        cur.execute(
            """
            INSERT INTO toeic_reading_part5
              (is_exam, category, position, text, options, answer, explanation)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                False,
                q["category"],
                i,
                q["sentence"],   # stored in "text" column
                j(q.get("options", [])),
                q["answer"],
                j(q["explanation"]),
            ),
        )
    print(f"  Inserted {len(p5['questions'])} rows")

    # ── Part 6 ─────────────────────────────────────────────────────────────────
    print("Seeding Part 6…")
    cur.execute("DELETE FROM toeic_reading_part6 WHERE is_exam = false")
    p6 = load_json("part6_exercises.json")
    for i, passage in enumerate(p6["passages"], 1):
        cur.execute(
            """
            INSERT INTO toeic_reading_part6
              (is_exam, position, doctype, title, text, questions)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                False,
                i,
                passage.get("doctype"),
                passage.get("title"),
                passage.get("text", ""),
                j(passage["questions"]),  # questions already contain explanation
            ),
        )
    print(f"  Inserted {len(p6['passages'])} rows")

    # ── Part 7 (single-document passages) ──────────────────────────────────────
    print("Seeding Part 7 (single)…")
    cur.execute("DELETE FROM toeic_reading_part7 WHERE is_exam = false AND doc_count = 1")
    p7 = load_json("part7_exercises.json")
    for i, passage in enumerate(p7["passages"], 1):
        # Store single doc as an array-of-one in the documents column
        documents = [
            {
                "doctype": passage.get("doctype"),
                "title": passage.get("title"),
                "text": passage.get("text", ""),
            }
        ]
        cur.execute(
            """
            INSERT INTO toeic_reading_part7
              (is_exam, position, documents, questions, doc_count)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                False,
                i,
                j(documents),
                j(passage["questions"]),  # questions already contain explanation
                1,
            ),
        )
    print(f"  Inserted {len(p7['passages'])} rows")

    # ── Part 7 Multi (multi-document passages) ─────────────────────────────────
    print("Seeding Part 7 Multi…")
    cur.execute("DELETE FROM toeic_reading_part7 WHERE is_exam = false AND doc_count > 1")
    p7m = load_json("part7_multi_exercises.json")
    for i, passage in enumerate(p7m["passages"], 1):
        doc_count = len(passage["documents"])
        cur.execute(
            """
            INSERT INTO toeic_reading_part7
              (is_exam, position, documents, questions, doc_count)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                False,
                i,
                j(passage["documents"]),
                j(passage["questions"]),  # questions already contain explanation
                doc_count,
            ),
        )
    print(f"  Inserted {len(p7m['passages'])} rows")

    conn.commit()
    cur.close()
    conn.close()
    print("\nAll exercise data seeded successfully.")


if __name__ == "__main__":
    main()
