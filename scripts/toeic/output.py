"""Output folder builder and JSON manifest writer."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

from pydantic import BaseModel


def init_output_dir(output: Path, part: str) -> Path:
    """Create and return the part subfolder inside *output*."""
    part_dir = output / part
    part_dir.mkdir(parents=True, exist_ok=True)
    return part_dir


def init_audio_dir(part_dir: Path) -> Path:
    audio_dir = part_dir / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)
    return audio_dir


def init_images_dir(part_dir: Path) -> Path:
    images_dir = part_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    return images_dir


def copy_images(src_paths: list[Path], dest_dir: Path) -> list[str]:
    """Copy image files to *dest_dir* and return relative paths (relative to dest_dir's parent)."""
    dest_dir.mkdir(parents=True, exist_ok=True)
    rel_paths: list[str] = []
    for src in src_paths:
        dest = dest_dir / src.name
        shutil.copy2(src, dest)
        # Relative to the part dir (one level up from images/)
        rel_paths.append(f"images/{src.name}")
    return rel_paths


def write_manifest(data: BaseModel, path: Path) -> None:
    """Serialise *data* as indented JSON and write to *path*."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(data.model_dump_json(indent=2), encoding="utf-8")


def write_exam_manifest(data: BaseModel, output: Path) -> None:
    write_manifest(data, output / "exam.json")


def rel_audio(filename: str) -> str:
    """Return a relative audio path string for use inside manifests."""
    return f"audio/{filename}"
