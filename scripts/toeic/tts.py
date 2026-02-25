"""ElevenLabs TTS wrapper — synthesizes text and writes MP3 files."""
from __future__ import annotations

import os
import sys
import time
from pathlib import Path

SILENCE_MS = 500  # padding between dialogue turns


def _get_api_key() -> str:
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        print("ERROR: ELEVENLABS_API_KEY is not set. Export it or add it to .env", file=sys.stderr)
        sys.exit(1)
    return key


def _get_client():
    from elevenlabs.client import ElevenLabs  # type: ignore[import-untyped]
    return ElevenLabs(api_key=_get_api_key())


def synthesize(text: str, voice_id: str, output_path: Path) -> None:
    """Synthesize *text* with ElevenLabs and write an MP3 to *output_path*.

    Retries once on transient API failure before exiting.
    """
    client = _get_client()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    for attempt in (1, 2):
        try:
            audio = client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id="eleven_multilingual_v2",
                output_format="mp3_44100_128",
            )
            with open(output_path, "wb") as f:
                for chunk in audio:
                    f.write(chunk)
            return
        except Exception as exc:  # noqa: BLE001
            if attempt == 1:
                print(f"  [TTS] attempt 1 failed ({exc}), retrying…", file=sys.stderr)
                time.sleep(2)
            else:
                print(f"ERROR: ElevenLabs TTS failed: {exc}", file=sys.stderr)
                sys.exit(1)


def synthesize_dialogue(
    turns: list[tuple[str, str]],  # [(text, voice_id), …]
    output_path: Path,
    silence_ms: int = SILENCE_MS,
) -> None:
    """Synthesize each dialogue turn separately, concatenate with silence, save to *output_path*.

    Requires pydub (which in turn requires ffmpeg or libav).
    """
    try:
        from pydub import AudioSegment  # type: ignore[import-untyped]
    except ImportError:
        print("ERROR: pydub is required for Part 3 audio. Install it with: pip install pydub", file=sys.stderr)
        sys.exit(1)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    silence = AudioSegment.silent(duration=silence_ms)
    combined: AudioSegment | None = None

    for idx, (text, voice_id) in enumerate(turns):
        tmp_path = output_path.with_name(f"_tmp_turn_{idx}.mp3")
        synthesize(text, voice_id, tmp_path)
        segment = AudioSegment.from_mp3(str(tmp_path))
        combined = segment if combined is None else combined + silence + segment
        tmp_path.unlink(missing_ok=True)

    if combined is not None:
        combined.export(str(output_path), format="mp3")
