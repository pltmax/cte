"""Part 6 — Text Completion generator (reading + optional images)."""
from __future__ import annotations

import json
from pathlib import Path

from toeic.models import Part6Input, Part6Manifest, Part6Passage
from toeic.output import copy_images, init_images_dir, init_output_dir, write_manifest


def run(
    output: Path,
    content: Path,
    images: list[Path] | None = None,
) -> Part6Manifest:
    data = Part6Input.model_validate(json.loads(content.read_text()))

    part_dir = init_output_dir(output, "part6")
    image_rel_paths: list[str] = []

    if images:
        images_dir = init_images_dir(part_dir)
        image_rel_paths = copy_images(images, images_dir)
        print(f"  [Part 6] Copied {len(image_rel_paths)} image(s)")

    manifest = Part6Manifest(passages=data.passages, image_files=image_rel_paths)
    write_manifest(manifest, part_dir / "part6.json")
    print(f"  [Part 6] Manifest written → {part_dir / 'part6.json'}")
    return manifest
