"""Part 3 — Conversations generator (multi-voice, concatenated MP3)."""
from __future__ import annotations

import json
from pathlib import Path

from toeic.models import Part3Input, Part3Manifest
from toeic.output import init_audio_dir, init_output_dir, rel_audio, write_manifest
from toeic.tts import synthesize_dialogue


def run(
    output: Path,
    transcript: Path,
    voice_ids_m: list[str],
    voice_ids_f: list[str],
) -> Part3Manifest:
    data = Part3Input.model_validate(json.loads(transcript.read_text()))

    part_dir = init_output_dir(output, "part3")
    audio_dir = init_audio_dir(part_dir)

    for conv_idx, conversation in enumerate(data.conversations):
        voice_m = voice_ids_m[conv_idx % len(voice_ids_m)]
        voice_f = voice_ids_f[conv_idx % len(voice_ids_f)]
        filename = f"conv{conv_idx + 1:02d}.mp3"
        dest = audio_dir / filename
        turns = [
            (turn.text, voice_m if turn.speaker == "M" else voice_f)
            for turn in conversation.dialogue
        ]
        print(f"  [Part 3] Synthesising {filename} ({len(turns)} turns)…")
        synthesize_dialogue(turns, dest)
        conversation.audio_file = rel_audio(filename)

    manifest = Part3Manifest(conversations=data.conversations)
    write_manifest(manifest, part_dir / "part3.json")
    print(f"  [Part 3] Manifest written → {part_dir / 'part3.json'}")
    return manifest
