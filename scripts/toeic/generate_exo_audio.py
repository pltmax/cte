"""Generate audio files for TOEIC exercise JSONs.

Reads JSON from mockexamData/TOEIC/exo_partN/, synthesizes audio with
ElevenLabs, writes MP3s to exercices_outputs/partN/audio/, and updates
the JSON files in place with relative audio paths.

Relative paths (e.g. "audio/q01_A.mp3") are stable keys — once you upload
to GCS, run link_exo_gcs_urls.py to replace them with full public URLs.

Usage (first 3 items per part — default):
    python scripts/toeic/generate_exo_audio.py

Usage (all items):
    python scripts/toeic/generate_exo_audio.py --n 999

Usage (specific parts only):
    python scripts/toeic/generate_exo_audio.py --parts 1 3 --n 5
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from itertools import cycle
from pathlib import Path

# Allow importing sibling modules
sys.path.insert(0, str(Path(__file__).parent))
from tts import synthesize, synthesize_dialogue  # noqa: E402
from output import init_audio_dir, rel_audio  # noqa: E402

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
EXO_DATA_DIR = PROJECT_ROOT / "mockexamData" / "TOEIC"
OUTPUT_DIR = PROJECT_ROOT / "exercices_outputs"

# ── Voice IDs (fall back to hardcoded defaults matching .env.example) ─────────
VOICE_HALE = os.environ.get("ELEVENLABS_VOICE_HALE", "wWWn96OtTHu1sn8SRGEr")       # Male
VOICE_JUDE = os.environ.get("ELEVENLABS_VOICE_JUDE", "Yg7C1g7suzNt5TisIqkZ")       # Male
VOICE_JESSICA = os.environ.get("ELEVENLABS_VOICE_JESSICA", "DbwWo4rVEd5NrejHYUnm")  # Female
VOICE_BEA = os.environ.get("ELEVENLABS_VOICE_BEA", "aHCytOTnUOgfGPn5n89j")         # Female

# ── Voice rotation cycles ──────────────────────────────────────────────────────
# Part 1 — one voice per question (all 4 statements share the same voice)
PART1_VOICES = cycle([VOICE_JESSICA, VOICE_HALE, VOICE_BEA, VOICE_JUDE])
# Part 2 — question stems and options rotate independently
PART2_Q_VOICES  = cycle([VOICE_HALE, VOICE_JUDE])
PART2_OPT_VOICES = cycle([VOICE_JESSICA, VOICE_BEA])
# Part 3 — M and F pools each rotate so no two consecutive convs share the same pair
PART3_M_VOICES = cycle([VOICE_HALE, VOICE_JUDE])
PART3_F_VOICES = cycle([VOICE_JESSICA, VOICE_BEA])
# Part 4 — one voice per talk
PART4_VOICES = cycle([VOICE_JESSICA, VOICE_HALE, VOICE_BEA, VOICE_JUDE])


# ── Helpers ───────────────────────────────────────────────────────────────────

def _write_json(data: dict, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  → JSON written: {path.relative_to(PROJECT_ROOT)}")


# ── Part generators ───────────────────────────────────────────────────────────

def generate_part1(n: int, start: int = 0) -> None:
    """
    Each question → 4 statement MP3s (A/B/C/D).
    JSON field updated: audio_urls = {"A": "audio/q01_A.mp3", ...}
    """
    src = EXO_DATA_DIR / "exo_part1" / "part1_exercises.json"
    data = json.loads(src.read_text(encoding="utf-8"))
    audio_dir = init_audio_dir(OUTPUT_DIR / "part1")

    for i, q in enumerate(data["questions"]):
        if i < start:
            next(PART1_VOICES)  # keep cycle in sync
            continue
        if i >= n:
            break
        q_num = f"q{i + 1:02d}"
        voice = next(PART1_VOICES)
        audio_urls: dict[str, str] = {}

        for label, stmt in zip(["A", "B", "C", "D"], q["statements"]):
            filename = f"{q_num}_{label}.mp3"
            print(f"  [Part1] {filename}")
            synthesize(stmt, voice, audio_dir / filename)
            audio_urls[label] = rel_audio(filename)

        data["questions"][i]["audio_urls"] = audio_urls

    _write_json(data, OUTPUT_DIR / "part1" / "part1_exercises.json")


def generate_part2(n: int, start: int = 0) -> None:
    """
    Each question → 1 question MP3 + 3 option MP3s (A/B/C).
    JSON fields updated:
        question_audio_url   = "audio/q01_question.mp3"
        option_audio_urls    = {"A": "audio/q01_A.mp3", ...}
    """
    src = EXO_DATA_DIR / "exo_part2" / "part2_exercises.json"
    data = json.loads(src.read_text(encoding="utf-8"))
    audio_dir = init_audio_dir(OUTPUT_DIR / "part2")

    for i, q in enumerate(data["questions"]):
        if i < start:
            next(PART2_Q_VOICES); next(PART2_OPT_VOICES)  # keep cycles in sync
            continue
        if i >= n:
            break
        q_num = f"q{i + 1:02d}"

        # Question stem
        q_file = f"{q_num}_question.mp3"
        print(f"  [Part2] {q_file}")
        synthesize(q["question"], next(PART2_Q_VOICES), audio_dir / q_file)
        data["questions"][i]["question_audio_url"] = rel_audio(q_file)

        # Options A / B / C
        opt_voice = next(PART2_OPT_VOICES)
        option_audio_urls: dict[str, str] = {}
        for label, option in zip(["A", "B", "C"], q["options"]):
            filename = f"{q_num}_{label}.mp3"
            print(f"  [Part2] {filename}")
            synthesize(option, opt_voice, audio_dir / filename)
            option_audio_urls[label] = rel_audio(filename)

        data["questions"][i]["option_audio_urls"] = option_audio_urls

    _write_json(data, OUTPUT_DIR / "part2" / "part2_exercises.json")


def generate_part3(n: int, start: int = 0) -> None:
    """
    Each conversation → 1 combined dialogue MP3 (turns stitched with silence).
    JSON field updated: audio_url = "audio/conv01.mp3"
    """
    src = EXO_DATA_DIR / "exo_part3" / "part3_exercises.json"
    data = json.loads(src.read_text(encoding="utf-8"))
    audio_dir = init_audio_dir(OUTPUT_DIR / "part3")

    for i, conv in enumerate(data["conversations"]):
        if i < start:
            next(PART3_M_VOICES); next(PART3_F_VOICES)  # keep cycles in sync
            continue
        if i >= n:
            break
        filename = f"conv{i + 1:02d}.mp3"
        print(f"  [Part3] {filename}  ({conv['type']})")

        voice_m = next(PART3_M_VOICES)
        voice_f = next(PART3_F_VOICES)
        turns = [
            (turn["text"], voice_m if turn["speaker"] == "M" else voice_f)
            for turn in conv["dialogue"]
        ]
        synthesize_dialogue(turns, audio_dir / filename)
        data["conversations"][i]["audio_url"] = rel_audio(filename)

    _write_json(data, OUTPUT_DIR / "part3" / "part3_exercises.json")


def generate_part4(n: int, start: int = 0) -> None:
    """
    Each talk → 1 monologue MP3.
    JSON field updated: audio_url = "audio/talk01.mp3"
    """
    src = EXO_DATA_DIR / "exo_part4" / "part4_exercises.json"
    data = json.loads(src.read_text(encoding="utf-8"))
    audio_dir = init_audio_dir(OUTPUT_DIR / "part4")

    for i, talk in enumerate(data["talks"]):
        if i < start:
            next(PART4_VOICES)  # keep cycle in sync
            continue
        if i >= n:
            break
        filename = f"talk{i + 1:02d}.mp3"
        print(f"  [Part4] {filename}  — {talk['title']}")
        synthesize(talk["text"], next(PART4_VOICES), audio_dir / filename)
        data["talks"][i]["audio_url"] = rel_audio(filename)

    _write_json(data, OUTPUT_DIR / "part4" / "part4_exercises.json")


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    # Load .env if python-dotenv is available
    try:
        from dotenv import load_dotenv  # type: ignore[import-untyped]
        env_path = PROJECT_ROOT / ".env"
        if env_path.exists():
            load_dotenv(env_path)
            print(f"Loaded .env from {env_path}\n")
    except ImportError:
        pass

    parser = argparse.ArgumentParser(
        description="Generate ElevenLabs audio for TOEIC exercise JSONs",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--parts",
        nargs="+",
        choices=["1", "2", "3", "4"],
        default=["1", "2", "3", "4"],
        help="Which parts to generate (default: all)",
    )
    parser.add_argument(
        "--n",
        type=int,
        default=3,
        help="Number of questions / conversations / talks per part (default: 3)",
    )
    parser.add_argument(
        "--start",
        type=int,
        default=0,
        help="Skip the first N items (0-indexed) — useful to resume after a quota error (default: 0)",
    )
    args = parser.parse_args()

    print(f"Generating audio — items {args.start + 1}–{args.n} per part")
    print(f"Output: {OUTPUT_DIR}\n")

    if "1" in args.parts:
        print("=== Part 1 — Statements ===")
        generate_part1(args.n, args.start)

    if "2" in args.parts:
        print("\n=== Part 2 — Q&A ===")
        generate_part2(args.n, args.start)

    if "3" in args.parts:
        print("\n=== Part 3 — Dialogues ===")
        generate_part3(args.n, args.start)

    if "4" in args.parts:
        print("\n=== Part 4 — Monologues ===")
        generate_part4(args.n, args.start)

    print(
        "\nDone!\n"
        "Next steps:\n"
        "  1. Listen to the files in exercices_outputs/\n"
        "  2. Upload to GCS:  gsutil -m cp -r exercices_outputs/ gs://choppetonexam_toeic/\n"
        "  3. Link GCS URLs:  python scripts/toeic/link_exo_gcs_urls.py "
        "--base-url https://storage.googleapis.com/choppetonexam_toeic/exercices_outputs"
    )


if __name__ == "__main__":
    main()
