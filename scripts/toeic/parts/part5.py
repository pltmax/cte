"""Part 5 — Incomplete Sentences generator (reading only, no audio)."""
from __future__ import annotations

import json
from pathlib import Path

from toeic.models import Part5Input, Part5Manifest
from toeic.output import init_output_dir, write_manifest


def run(
    output: Path,
    content: Path,
) -> Part5Manifest:
    data = Part5Input.model_validate(json.loads(content.read_text()))

    part_dir = init_output_dir(output, "part5")
    manifest = Part5Manifest(questions=data.questions)
    write_manifest(manifest, part_dir / "part5.json")
    print(f"  [Part 5] Manifest written → {part_dir / 'part5.json'}")
    return manifest
