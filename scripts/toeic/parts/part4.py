"""Part 4 — Short Talks generator."""
from __future__ import annotations

import json
from pathlib import Path

from toeic.models import Part4Input, Part4Manifest
from toeic.output import init_audio_dir, init_output_dir, rel_audio, write_manifest
from toeic.tts import synthesize


def run(
    output: Path,
    transcript: Path,
    voice_ids: list[str],
) -> Part4Manifest:
    data = Part4Input.model_validate(json.loads(transcript.read_text()))

    part_dir = init_output_dir(output, "part4")
    audio_dir = init_audio_dir(part_dir)

    for talk_idx, talk in enumerate(data.talks):
        voice_id = voice_ids[talk_idx % len(voice_ids)]
        filename = f"talk{talk_idx + 1:02d}.mp3"
        print(f"  [Part 4] Synthesising {filename}…")
        synthesize(talk.text, voice_id, audio_dir / filename)
        talk.audio_file = rel_audio(filename)

    manifest = Part4Manifest(talks=data.talks)
    write_manifest(manifest, part_dir / "part4.json")
    print(f"  [Part 4] Manifest written → {part_dir / 'part4.json'}")
    return manifest
