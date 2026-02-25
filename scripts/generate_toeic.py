#!/usr/bin/env python3
"""TOEIC exam generator — CLI entry point.

Usage examples:
  python generate_toeic.py part1 --output ./exam_output \\
      --images photo1.jpg photo2.jpg --transcript part1.json --voice-id VOICE_ID

  python generate_toeic.py part3 --output ./exam_output \\
      --transcript part3.json --voice-id-m MALE_ID --voice-id-f FEMALE_ID

Run `python generate_toeic.py --help` for full usage.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Load .env from project root (if present) before anything else
try:
    from dotenv import load_dotenv

    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass  # python-dotenv optional at runtime if env vars are set externally

# Ensure the scripts/ directory is on sys.path so `toeic` package is importable
sys.path.insert(0, str(Path(__file__).parent))

from toeic.models import ExamManifest
from toeic.output import write_exam_manifest


def _path(value: str) -> Path:
    return Path(value)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="generate_toeic.py",
        description="Generate TOEIC exam audio and JSON manifests via ElevenLabs TTS.",
    )
    parser.add_argument(
        "--output",
        type=_path,
        default=Path("./exam_output"),
        help="Root output directory (default: ./exam_output)",
    )
    sub = parser.add_subparsers(dest="part", required=True, metavar="PART")

    # ── Part 1 ──────────────────────────────────────────────────────────────
    p1 = sub.add_parser("part1", help="Photographs (listening)")
    p1.add_argument("--transcript", type=_path, required=True, help="Path to part1_transcript.json")
    p1.add_argument(
        "--images", type=_path, nargs="+",
        help="Image files (one per question). Optional if 'image' field is set in the transcript JSON.",
    )
    p1.add_argument(
        "--voice-id", required=True, nargs="+", metavar="VOICE_ID",
        help="One or more ElevenLabs voice IDs (rotated per question set)",
    )

    # ── Part 2 ──────────────────────────────────────────────────────────────
    p2 = sub.add_parser("part2", help="Question-Response (listening)")
    p2.add_argument("--transcript", type=_path, required=True, help="Path to part2_transcript.json")
    p2.add_argument(
        "--voice-id", required=True, nargs="+", metavar="VOICE_ID",
        help="One or more ElevenLabs voice IDs (rotated per question set)",
    )

    # ── Part 3 ──────────────────────────────────────────────────────────────
    p3 = sub.add_parser("part3", help="Conversations (listening, multi-voice)")
    p3.add_argument("--transcript", type=_path, required=True, help="Path to part3_transcript.json")
    p3.add_argument(
        "--voice-id-m", required=True, nargs="+", metavar="VOICE_ID",
        help="One or more ElevenLabs voice IDs for male speakers (rotated per conversation)",
    )
    p3.add_argument(
        "--voice-id-f", required=True, nargs="+", metavar="VOICE_ID",
        help="One or more ElevenLabs voice IDs for female speakers (rotated per conversation)",
    )

    # ── Part 4 ──────────────────────────────────────────────────────────────
    p4 = sub.add_parser("part4", help="Short Talks (listening)")
    p4.add_argument("--transcript", type=_path, required=True, help="Path to part4_transcript.json")
    p4.add_argument(
        "--voice-id", required=True, nargs="+", metavar="VOICE_ID",
        help="One or more ElevenLabs voice IDs (rotated per talk)",
    )

    # ── Part 5 ──────────────────────────────────────────────────────────────
    p5 = sub.add_parser("part5", help="Incomplete Sentences (reading, no audio)")
    p5.add_argument("--content", type=_path, required=True, help="Path to part5_content.json")

    # ── Part 6 ──────────────────────────────────────────────────────────────
    p6 = sub.add_parser("part6", help="Text Completion (reading + optional images)")
    p6.add_argument("--content", type=_path, required=True, help="Path to part6_content.json")
    p6.add_argument("--images", type=_path, nargs="*", help="Optional passage images")

    # ── Part 7 ──────────────────────────────────────────────────────────────
    p7 = sub.add_parser("part7", help="Reading Comprehension (reading + optional images)")
    p7.add_argument("--content", type=_path, required=True, help="Path to part7_content.json")
    p7.add_argument("--images", type=_path, nargs="*", help="Optional passage images")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    output: Path = args.output
    output.mkdir(parents=True, exist_ok=True)

    print(f"Output directory: {output.resolve()}")
    print(f"Generating {args.part}…")

    manifest = ExamManifest()

    if args.part == "part1":
        from toeic.parts.part1 import run
        manifest.part1 = run(output, args.transcript, args.voice_id, args.images)

    elif args.part == "part2":
        from toeic.parts.part2 import run
        manifest.part2 = run(output, args.transcript, args.voice_id)  # list from nargs="+"

    elif args.part == "part3":
        from toeic.parts.part3 import run
        manifest.part3 = run(output, args.transcript, args.voice_id_m, args.voice_id_f)  # lists from nargs="+"

    elif args.part == "part4":
        from toeic.parts.part4 import run
        manifest.part4 = run(output, args.transcript, args.voice_id)  # list from nargs="+"

    elif args.part == "part5":
        from toeic.parts.part5 import run
        manifest.part5 = run(output, args.content)

    elif args.part == "part6":
        from toeic.parts.part6 import run
        manifest.part6 = run(output, args.content, args.images or [])

    elif args.part == "part7":
        from toeic.parts.part7 import run
        manifest.part7 = run(output, args.content, args.images or [])

    write_exam_manifest(manifest, output)
    print(f"\nDone. Top-level manifest → {(output / 'exam.json').resolve()}")


if __name__ == "__main__":
    main()
