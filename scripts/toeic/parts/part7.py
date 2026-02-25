"""Part 7 — Reading Comprehension generator (reading + optional images)."""
from __future__ import annotations

import json
from pathlib import Path

from toeic.models import Part7Input, Part7Manifest, Part7Passage
from toeic.output import copy_images, init_images_dir, init_output_dir, write_manifest


def run(
    output: Path,
    content: Path,
    images: list[Path] | None = None,
) -> Part7Manifest:
    data = Part7Input.model_validate(json.loads(content.read_text()))

    part_dir = init_output_dir(output, "part7")
    image_rel_paths: list[str] = []

    if images:
        images_dir = init_images_dir(part_dir)
        image_rel_paths = copy_images(images, images_dir)
        print(f"  [Part 7] Copied {len(image_rel_paths)} image(s)")

    manifest = Part7Manifest(passages=data.passages, image_files=image_rel_paths)
    write_manifest(manifest, part_dir / "part7.json")
    print(f"  [Part 7] Manifest written → {part_dir / 'part7.json'}")
    return manifest
