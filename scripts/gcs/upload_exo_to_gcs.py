#!/usr/bin/env python3
"""Upload TOEIC exercise audio/images to GCS and write URL-linked JSONs.

Files land under  gs://<bucket>/exercices/partN/audio/  and  .../part1/images/
— completely separate from the mock-exam prefix  toeic/  used by upload_to_gcs.py.

Final JSONs (with full GCS URLs) are written to:
    mockexamData/TOEIC/exercices/partN_exercises.json

Sources:
    exercices_outputs/part1/audio/   → Part 1 statement MP3s
    exercices_outputs/part2/audio/   → Part 2 question + option MP3s
    exercices_outputs/part3/audio/   → Part 3 conversation MP3s
    exercices_outputs/part4/audio/   → Part 4 talk MP3s
    mockexamData/TOEIC/exo_part1/    → Part 1 JPEG images

Prerequisites:
    pip install google-cloud-storage
    gcloud auth application-default login   (or set GOOGLE_APPLICATION_CREDENTIALS)

Usage:
    # upload everything and write JSONs
    python scripts/gcs/upload_exo_to_gcs.py --bucket choppetonexam_toeic

    # preview without uploading or writing
    python scripts/gcs/upload_exo_to_gcs.py --bucket choppetonexam_toeic --dry-run

    # specific parts only
    python scripts/gcs/upload_exo_to_gcs.py --bucket choppetonexam_toeic --parts 1 2
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE = Path(__file__).resolve().parent.parent.parent  # project root
EXO_OUTPUTS = BASE / "exercices_outputs"
EXO_DATA = BASE / "mockexamData" / "TOEIC"
OUT_DIR = EXO_DATA / "exercices"

# GCS prefix used for all exercise assets — distinct from mock-exam prefix "toeic/"
GCS_PREFIX = "exercices"

CONTENT_TYPES: dict[str, str] = {
    ".mp3": "audio/mpeg",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
}


# ── GCS helpers ───────────────────────────────────────────────────────────────

def _public_url(bucket_name: str, gcs_path: str) -> str:
    return f"https://storage.googleapis.com/{bucket_name}/{gcs_path}"


def _upload_file(
    bucket_obj: object,
    local_path: Path,
    gcs_path: str,
    dry_run: bool,
) -> None:
    content_type = CONTENT_TYPES.get(local_path.suffix.lower(), "application/octet-stream")
    if dry_run:
        print(f"  [dry-run] {local_path.name:40s} → gs://{bucket_obj.name}/{gcs_path}")  # type: ignore[attr-defined]
        return
    blob = bucket_obj.blob(gcs_path)  # type: ignore[attr-defined]
    blob.cache_control = "public, max-age=31536000"
    blob.upload_from_filename(str(local_path), content_type=content_type)
    print(f"  ✓ {local_path.name}")


def _upload_dir(
    bucket_obj: object,
    local_dir: Path,
    gcs_dir: str,
    dry_run: bool,
) -> dict[str, str]:
    """Upload all media files in local_dir; return {filename → public_url}."""
    url_map: dict[str, str] = {}
    if not local_dir.exists():
        print(f"  [skip] {local_dir.relative_to(BASE)} — directory not found")
        return url_map
    for f in sorted(local_dir.iterdir()):
        if not f.is_file() or f.suffix.lower() not in CONTENT_TYPES:
            continue
        gcs_path = f"{gcs_dir}/{f.name}"
        url_map[f.name] = _public_url(bucket_obj.name, gcs_path)  # type: ignore[attr-defined]
        _upload_file(bucket_obj, f, gcs_path, dry_run)
    return url_map


def _write_json(data: dict, path: Path, dry_run: bool) -> None:
    if dry_run:
        print(f"  [dry-run] would write {path.relative_to(BASE)}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  ✓ JSON → {path.relative_to(BASE)}")


# ── Part processors ───────────────────────────────────────────────────────────

def process_part1(bucket_obj: object, dry_run: bool) -> None:
    """Upload Part 1 audio + images; write exercices/part1_exercises.json."""
    print("\n── Part 1 — Photographs ────────────────────────────────────────────")

    audio_map = _upload_dir(
        bucket_obj,
        EXO_OUTPUTS / "part1" / "audio",
        f"{GCS_PREFIX}/part1/audio",
        dry_run,
    )
    img_map = _upload_dir(
        bucket_obj,
        EXO_DATA / "exo_part1",
        f"{GCS_PREFIX}/part1/images",
        dry_run,
    )

    data = json.loads((EXO_OUTPUTS / "part1" / "part1_exercises.json").read_text(encoding="utf-8"))
    for i, q in enumerate(data.get("questions", [])):
        # image_url — derive from the "image" field (e.g. "manReading.jpeg")
        img_name = Path(q.get("image", "")).name
        if img_name and img_name in img_map:
            q["image_url"] = img_map[img_name]

        # audio_urls — replace relative paths ("audio/q01_A.mp3") with full URLs
        urls = q.get("audio_urls")
        if isinstance(urls, dict):
            q["audio_urls"] = {
                k: audio_map.get(Path(v).name, v) if isinstance(v, str) and not v.startswith("http") else v
                for k, v in urls.items()
            }

    _write_json(data, OUT_DIR / "part1_exercises.json", dry_run)


def process_part2(bucket_obj: object, dry_run: bool) -> None:
    """Upload Part 2 audio; write exercices/part2_exercises.json."""
    print("\n── Part 2 — Q&A ────────────────────────────────────────────────────")

    audio_map = _upload_dir(
        bucket_obj,
        EXO_OUTPUTS / "part2" / "audio",
        f"{GCS_PREFIX}/part2/audio",
        dry_run,
    )

    data = json.loads((EXO_OUTPUTS / "part2" / "part2_exercises.json").read_text(encoding="utf-8"))
    for i, q in enumerate(data.get("questions", [])):
        q_url = q.get("question_audio_url")
        if isinstance(q_url, str) and not q_url.startswith("http"):
            q["question_audio_url"] = audio_map.get(Path(q_url).name, q_url)

        opt_urls = q.get("option_audio_urls")
        if isinstance(opt_urls, dict):
            q["option_audio_urls"] = {
                k: audio_map.get(Path(v).name, v) if isinstance(v, str) and not v.startswith("http") else v
                for k, v in opt_urls.items()
            }

    _write_json(data, OUT_DIR / "part2_exercises.json", dry_run)


def process_part3(bucket_obj: object, dry_run: bool) -> None:
    """Upload Part 3 audio; write exercices/part3_exercises.json."""
    print("\n── Part 3 — Conversations ──────────────────────────────────────────")

    audio_map = _upload_dir(
        bucket_obj,
        EXO_OUTPUTS / "part3" / "audio",
        f"{GCS_PREFIX}/part3/audio",
        dry_run,
    )

    data = json.loads((EXO_OUTPUTS / "part3" / "part3_exercises.json").read_text(encoding="utf-8"))
    for i, conv in enumerate(data.get("conversations", [])):
        audio_url = conv.get("audio_url")
        if audio_url is None:
            # Derive expected filename from index (1-based, zero-padded to 2 digits)
            expected_name = f"conv{i + 1:02d}.mp3"
            if expected_name in audio_map:
                conv["audio_url"] = audio_map[expected_name]
        elif isinstance(audio_url, str) and not audio_url.startswith("http"):
            conv["audio_url"] = audio_map.get(Path(audio_url).name, audio_url)

    _write_json(data, OUT_DIR / "part3_exercises.json", dry_run)


def process_part4(bucket_obj: object, dry_run: bool) -> None:
    """Upload Part 4 audio; write exercices/part4_exercises.json."""
    print("\n── Part 4 — Monologues ─────────────────────────────────────────────")

    audio_map = _upload_dir(
        bucket_obj,
        EXO_OUTPUTS / "part4" / "audio",
        f"{GCS_PREFIX}/part4/audio",
        dry_run,
    )

    data = json.loads((EXO_OUTPUTS / "part4" / "part4_exercises.json").read_text(encoding="utf-8"))
    for i, talk in enumerate(data.get("talks", [])):
        audio_url = talk.get("audio_url")
        if audio_url is None:
            expected_name = f"talk{i + 1:02d}.mp3"
            if expected_name in audio_map:
                talk["audio_url"] = audio_map[expected_name]
        elif isinstance(audio_url, str) and not audio_url.startswith("http"):
            talk["audio_url"] = audio_map.get(Path(audio_url).name, audio_url)

    _write_json(data, OUT_DIR / "part4_exercises.json", dry_run)


# ── Entry point ────────────────────────────────────────────────────────────────

PROCESSORS = {
    "1": process_part1,
    "2": process_part2,
    "3": process_part3,
    "4": process_part4,
}


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Upload TOEIC exercise assets to GCS and write URL-linked JSONs.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--bucket", required=True, help="GCS bucket name")
    parser.add_argument("--project", default=None, help="GCP project ID (optional)")
    parser.add_argument(
        "--parts",
        nargs="+",
        choices=["1", "2", "3", "4"],
        default=["1", "2", "3", "4"],
        help="Which parts to process (default: all)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would happen without uploading or writing files",
    )
    args = parser.parse_args()

    if args.dry_run:
        print("=== DRY RUN — no files will be uploaded or modified ===\n")

        class _FakeBucket:
            name = args.bucket

        bucket_obj: object = _FakeBucket()
    else:
        try:
            from google.cloud import storage  # type: ignore[import]
        except ImportError:
            print("Error: google-cloud-storage not installed. Run: pip install google-cloud-storage")
            raise SystemExit(1)
        client = storage.Client(project=args.project)
        bucket_obj = client.bucket(args.bucket)
        print(f"Connected to bucket: gs://{args.bucket}")

    print(f"GCS prefix : {GCS_PREFIX}/")
    print(f"Output dir : {OUT_DIR.relative_to(BASE)}\n")

    for part_num in sorted(args.parts):
        PROCESSORS[part_num](bucket_obj, args.dry_run)

    print(
        f"\n✓ Done.\n"
        f"  JSONs with full GCS URLs → {OUT_DIR.relative_to(BASE)}/\n"
        f"  GCS path pattern         → gs://{args.bucket}/{GCS_PREFIX}/partN/audio/*.mp3"
    )


if __name__ == "__main__":
    main()
