#!/usr/bin/env python3
"""
Upload TOEIC exam audio and images to Google Cloud Storage,
then update the transcript JSONs in mockexamData/ with public GCS URLs.

Prerequisites:
    pip install google-cloud-storage
    gcloud auth application-default login   (or set GOOGLE_APPLICATION_CREDENTIALS)

Usage:
    python scripts/gcs/upload_to_gcs.py --bucket YOUR_BUCKET_NAME
    python scripts/gcs/upload_to_gcs.py --bucket YOUR_BUCKET_NAME --dry-run
"""

import argparse
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent.parent  # project root
EXAM_OUTPUT = BASE / "exam_output"
MOCKDATA = BASE / "mockexamData" / "TOEIC"
GCS_PREFIX = "toeic"

CONTENT_TYPES: dict[str, str] = {
    ".mp3": "audio/mpeg",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
}


# ─── Helpers ──────────────────────────────────────────────────────────────────


def public_url(bucket_name: str, gcs_path: str) -> str:
    return f"https://storage.googleapis.com/{bucket_name}/{gcs_path}"


def upload_file(
    bucket_obj: object,
    local_path: Path,
    gcs_path: str,
    dry_run: bool,
) -> None:
    suffix = local_path.suffix.lower()
    content_type = CONTENT_TYPES.get(suffix, "application/octet-stream")
    if dry_run:
        print(f"  [dry-run] {local_path.name} → gs://{bucket_obj.name}/{gcs_path}")  # type: ignore[attr-defined]
        return
    blob = bucket_obj.blob(gcs_path)  # type: ignore[attr-defined]
    blob.cache_control = "public, max-age=31536000"
    blob.upload_from_filename(str(local_path), content_type=content_type)
    # Bucket uses uniform access — public read is set at bucket level via IAM
    url = public_url(bucket_obj.name, gcs_path)  # type: ignore[attr-defined]
    print(f"  ✓ {local_path.name} → {url}")


def upload_dir(
    bucket_obj: object,
    local_dir: Path,
    gcs_dir: str,
    dry_run: bool,
) -> dict[str, str]:
    """Upload all matching files in a directory; return {filename → public_url}."""
    url_map: dict[str, str] = {}
    for f in sorted(local_dir.iterdir()):
        if not f.is_file() or f.suffix.lower() not in CONTENT_TYPES:
            continue
        gcs_path = f"{gcs_dir}/{f.name}"
        url_map[f.name] = public_url(bucket_obj.name, gcs_path)  # type: ignore[attr-defined]
        upload_file(bucket_obj, f, gcs_path, dry_run)
    return url_map


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: dict, dry_run: bool) -> None:
    if dry_run:
        print(f"  [dry-run] Would write {path.relative_to(BASE)}")
        return
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  ✓ Updated {path.relative_to(BASE)}")


# ─── Part processors ──────────────────────────────────────────────────────────


def process_part1(bucket_obj: object, dry_run: bool) -> None:
    print("\n── Part 1 ─────────────────────────────────────────────────────────")
    img_map = upload_dir(
        bucket_obj,
        EXAM_OUTPUT / "part1" / "images",
        f"{GCS_PREFIX}/part1/images",
        dry_run,
    )
    audio_map = upload_dir(
        bucket_obj,
        EXAM_OUTPUT / "part1" / "audio",
        f"{GCS_PREFIX}/part1/audio",
        dry_run,
    )

    transcript_path = MOCKDATA / "listening_part1" / "part1_transcript.json"
    exam_path = EXAM_OUTPUT / "part1" / "part1.json"

    transcript = load_json(transcript_path)
    exam_data = load_json(exam_path)

    exam_questions = exam_data.get("questions", [])
    for i, q in enumerate(transcript["questions"]):
        eq = exam_questions[i] if i < len(exam_questions) else {}

        # image_url: prefer image_file from exam_output, fall back to image field
        raw_img = eq.get("image_file", q.get("image", ""))
        img_name = Path(raw_img).name
        if img_name in img_map:
            q["image_url"] = img_map[img_name]

        # audio_urls: {A, B, C, D}
        audio_files: dict[str, str] = eq.get("audio_files", {})
        q["audio_urls"] = {
            letter: audio_map.get(Path(path).name, path)
            for letter, path in audio_files.items()
        }

    save_json(transcript_path, transcript, dry_run)


def process_part2(bucket_obj: object, dry_run: bool) -> None:
    print("\n── Part 2 ─────────────────────────────────────────────────────────")
    audio_map = upload_dir(
        bucket_obj,
        EXAM_OUTPUT / "part2" / "audio",
        f"{GCS_PREFIX}/part2/audio",
        dry_run,
    )

    transcript_path = MOCKDATA / "listening_part2" / "part2_transcript.json"
    exam_path = EXAM_OUTPUT / "part2" / "part2.json"

    transcript = load_json(transcript_path)
    exam_data = load_json(exam_path)

    exam_questions = exam_data.get("questions", [])
    for i, q in enumerate(transcript["questions"]):
        eq = exam_questions[i] if i < len(exam_questions) else {}

        q_audio = eq.get("question_audio", "")
        q["question_audio_url"] = audio_map.get(Path(q_audio).name, q_audio)

        opt_files: dict[str, str] = eq.get("option_audio_files", {})
        q["option_audio_urls"] = {
            letter: audio_map.get(Path(path).name, path)
            for letter, path in opt_files.items()
        }

    save_json(transcript_path, transcript, dry_run)


def process_part3(bucket_obj: object, dry_run: bool) -> None:
    print("\n── Part 3 ─────────────────────────────────────────────────────────")
    audio_map = upload_dir(
        bucket_obj,
        EXAM_OUTPUT / "part3" / "audio",
        f"{GCS_PREFIX}/part3/audio",
        dry_run,
    )

    transcript_path = MOCKDATA / "listening_part3" / "part3_transcript.json"
    exam_path = EXAM_OUTPUT / "part3" / "part3.json"

    transcript = load_json(transcript_path)
    exam_data = load_json(exam_path)

    exam_convs = exam_data.get("conversations", [])
    for i, conv in enumerate(transcript["conversations"]):
        ec = exam_convs[i] if i < len(exam_convs) else {}
        af = ec.get("audio_file", "")
        conv["audio_url"] = audio_map.get(Path(af).name, af)

    save_json(transcript_path, transcript, dry_run)


def process_part4(bucket_obj: object, dry_run: bool) -> None:
    print("\n── Part 4 ─────────────────────────────────────────────────────────")
    audio_map = upload_dir(
        bucket_obj,
        EXAM_OUTPUT / "part4" / "audio",
        f"{GCS_PREFIX}/part4/audio",
        dry_run,
    )

    transcript_path = MOCKDATA / "listening_part4" / "part4_transcript.json"
    exam_path = EXAM_OUTPUT / "part4" / "part4.json"

    transcript = load_json(transcript_path)
    exam_data = load_json(exam_path)

    exam_talks = exam_data.get("talks", [])
    for i, talk in enumerate(transcript["talks"]):
        et = exam_talks[i] if i < len(exam_talks) else {}
        af = et.get("audio_file", "")
        talk["audio_url"] = audio_map.get(Path(af).name, af)

    save_json(transcript_path, transcript, dry_run)


# ─── Entry point ──────────────────────────────────────────────────────────────


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Upload TOEIC assets to GCS and update transcript JSONs."
    )
    parser.add_argument("--bucket", required=True, help="GCS bucket name")
    parser.add_argument(
        "--project",
        default=None,
        help="GCP project ID (optional if set via gcloud config set project)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would happen without uploading or modifying files",
    )
    args = parser.parse_args()

    if args.dry_run:
        print("=== DRY RUN — no files will be uploaded or modified ===")

        class _FakeBucket:
            name = args.bucket

        bucket_obj: object = _FakeBucket()
    else:
        try:
            from google.cloud import storage  # type: ignore[import]
        except ImportError:
            print("Error: google-cloud-storage not installed.")
            print("Run: pip install google-cloud-storage")
            raise SystemExit(1)
        client = storage.Client(project=args.project)
        bucket_obj = client.bucket(args.bucket)
        print(f"Connected to bucket: gs://{args.bucket}\n")

    process_part1(bucket_obj, args.dry_run)
    process_part2(bucket_obj, args.dry_run)
    process_part3(bucket_obj, args.dry_run)
    process_part4(bucket_obj, args.dry_run)

    print("\n✓ All done!")


if __name__ == "__main__":
    main()
