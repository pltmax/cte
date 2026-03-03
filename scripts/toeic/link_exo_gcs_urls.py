"""Replace relative audio paths in exercices_outputs JSON files with full GCS URLs.

Run this AFTER uploading exercices_outputs/ to GCS.

Usage:
    python scripts/toeic/link_exo_gcs_urls.py \\
        --base-url https://storage.googleapis.com/choppetonexam_toeic/exercices_outputs

This rewrites the JSON files in exercices_outputs/ in place.
The relative paths were set by generate_exo_audio.py:
    "audio/q01_A.mp3"  →  "<base-url>/part1/audio/q01_A.mp3"
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent
OUTPUT_DIR = PROJECT_ROOT / "exercices_outputs"

PART_JSON = {
    "part1": "part1_exercises.json",
    "part2": "part2_exercises.json",
    "part3": "part3_exercises.json",
    "part4": "part4_exercises.json",
}


def _replace_relative(value: str | None, base: str) -> str | None:
    """Convert 'audio/foo.mp3' → '<base>/audio/foo.mp3', leave None/full URLs alone."""
    if value is None:
        return None
    if value.startswith("http"):
        return value  # already absolute
    return f"{base}/{value}"


def link_part1(data: dict, base: str) -> dict:
    for q in data.get("questions", []):
        urls = q.get("audio_urls")
        if isinstance(urls, dict):
            q["audio_urls"] = {k: _replace_relative(v, base) for k, v in urls.items()}
    return data


def link_part2(data: dict, base: str) -> dict:
    for q in data.get("questions", []):
        q["question_audio_url"] = _replace_relative(q.get("question_audio_url"), base)
        urls = q.get("option_audio_urls")
        if isinstance(urls, dict):
            q["option_audio_urls"] = {k: _replace_relative(v, base) for k, v in urls.items()}
    return data


def link_part3(data: dict, base: str) -> dict:
    for conv in data.get("conversations", []):
        conv["audio_url"] = _replace_relative(conv.get("audio_url"), base)
    return data


def link_part4(data: dict, base: str) -> dict:
    for talk in data.get("talks", []):
        talk["audio_url"] = _replace_relative(talk.get("audio_url"), base)
    return data


LINKERS = {
    "part1": link_part1,
    "part2": link_part2,
    "part3": link_part3,
    "part4": link_part4,
}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--base-url",
        required=True,
        help="GCS public base URL, e.g. https://storage.googleapis.com/choppetonexam_toeic/exercices_outputs",
    )
    parser.add_argument(
        "--parts",
        nargs="+",
        choices=["1", "2", "3", "4"],
        default=["1", "2", "3", "4"],
    )
    args = parser.parse_args()
    base_url = args.base_url.rstrip("/")

    for part_num in args.parts:
        part_key = f"part{part_num}"
        json_path = OUTPUT_DIR / part_key / PART_JSON[part_key]

        if not json_path.exists():
            print(f"  [skip] {json_path} not found — run generate_exo_audio.py first")
            continue

        data = json.loads(json_path.read_text(encoding="utf-8"))
        part_base = f"{base_url}/{part_key}"
        data = LINKERS[part_key](data, part_base)
        json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  [Part{part_num}] URLs updated → {json_path.relative_to(PROJECT_ROOT)}")

    print("\nDone. JSON files now contain full GCS URLs.")


if __name__ == "__main__":
    main()
