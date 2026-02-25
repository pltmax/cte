"""Part 2 — Question-Response generator."""
from __future__ import annotations

import json
from pathlib import Path

from toeic.models import Part2Input, Part2Manifest
from toeic.output import init_audio_dir, init_output_dir, rel_audio, write_manifest
from toeic.tts import synthesize

OPTION_LABELS = ["A", "B", "C"]


def run(
    output: Path,
    transcript: Path,
    voice_ids: list[str],
) -> Part2Manifest:
    data = Part2Input.model_validate(json.loads(transcript.read_text()))

    part_dir = init_output_dir(output, "part2")
    audio_dir = init_audio_dir(part_dir)

    for q_idx, question in enumerate(data.questions):
        q_num = f"q{q_idx + 1:02d}"
        voice_id = voice_ids[q_idx % len(voice_ids)]

        q_filename = f"{q_num}_question.mp3"
        print(f"  [Part 2] Synthesising {q_filename}…")
        synthesize(question.question, voice_id, audio_dir / q_filename)
        question.question_audio = rel_audio(q_filename)

        for label, option_text in zip(OPTION_LABELS, question.options):
            o_filename = f"{q_num}_{label}.mp3"
            print(f"  [Part 2] Synthesising {o_filename}…")
            synthesize(option_text, voice_id, audio_dir / o_filename)
            question.option_audio_files[label] = rel_audio(o_filename)

    manifest = Part2Manifest(questions=data.questions)
    write_manifest(manifest, part_dir / "part2.json")
    print(f"  [Part 2] Manifest written → {part_dir / 'part2.json'}")
    return manifest
