"""Part 1 — Photographs generator."""
from __future__ import annotations

import json
from pathlib import Path

from toeic.models import Part1Input, Part1Manifest
from toeic.output import (
    copy_images,
    init_audio_dir,
    init_images_dir,
    init_output_dir,
    rel_audio,
    write_manifest,
)
from toeic.tts import synthesize

OPTION_LABELS = ["A", "B", "C", "D"]


def _resolve_images(
    questions: list,
    cli_images: list[Path] | None,
    transcript_dir: Path,
) -> list[Path]:
    """Return image paths: prefer CLI --images, fall back to 'image' field in JSON."""
    if cli_images:
        if len(cli_images) != len(questions):
            raise ValueError(
                f"Part 1: --images supplied {len(cli_images)} file(s) "
                f"but transcript has {len(questions)} question(s)."
            )
        return cli_images

    paths: list[Path] = []
    for q in questions:
        if not q.image:
            raise ValueError(
                "Part 1: no --images flag and transcript question is missing "
                f"the 'image' field. Add --images or set 'image' in the JSON."
            )
        p = transcript_dir / q.image
        if not p.exists():
            raise FileNotFoundError(f"Part 1: image not found: {p}")
        paths.append(p)
    return paths


def run(
    output: Path,
    transcript: Path,
    voice_ids: list[str],
    images: list[Path] | None = None,
) -> Part1Manifest:
    data = Part1Input.model_validate(json.loads(transcript.read_text()))

    resolved_images = _resolve_images(
        data.questions, images, transcript.parent
    )

    part_dir = init_output_dir(output, "part1")
    audio_dir = init_audio_dir(part_dir)
    images_dir = init_images_dir(part_dir)

    image_rel_paths = copy_images(resolved_images, images_dir)

    for q_idx, question in enumerate(data.questions):
        q_num = f"q{q_idx + 1:02d}"
        question.image_file = image_rel_paths[q_idx]
        voice_id = voice_ids[q_idx % len(voice_ids)]

        for label, statement in zip(OPTION_LABELS, question.statements):
            filename = f"{q_num}_{label}.mp3"
            dest = audio_dir / filename
            print(f"  [Part 1] Synthesising {filename}…")
            synthesize(statement, voice_id, dest)
            question.audio_files[label] = rel_audio(filename)

    manifest = Part1Manifest(questions=data.questions)
    write_manifest(manifest, part_dir / "part1.json")
    print(f"  [Part 1] Manifest written → {part_dir / 'part1.json'}")
    return manifest
