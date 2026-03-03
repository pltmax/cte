"""ElevenLabs TTS wrapper — synthesizes text and writes MP3 files."""
from __future__ import annotations

import os
import re
import sys
import time
from pathlib import Path

SILENCE_MS = 500  # padding between dialogue turns

# ── Text normalisation for TTS ────────────────────────────────────────────────
# ElevenLabs reads "(A)" too quickly or skips the letter entirely.
# Replace "(A)" / "(B)" / "(C)" / "(D)" with "A. " so the model treats the
# letter as the end of a micro-sentence and inserts a natural pause.
_MCQ_PREFIX = re.compile(r"\(([A-D])\)\s*")

# Clock-time words used by _time_to_words().
_HOUR_WORDS = [
    "twelve", "one", "two", "three", "four", "five", "six",
    "seven", "eight", "nine", "ten", "eleven", "twelve",
]
_ONES = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight",
    "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
    "sixteen", "seventeen", "eighteen", "nineteen",
]
_TENS = ["", "", "twenty", "thirty", "forty", "fifty"]


def _minutes_to_words(m: int) -> str:
    if m < 20:
        return _ONES[m]
    tens, ones = divmod(m, 10)
    return _TENS[tens] + ("-" + _ONES[ones] if ones else "")


def _time_match_to_words(match: re.Match) -> str:  # type: ignore[type-arg]
    hour = int(match.group(1))
    minute = int(match.group(2))
    period = (match.group(3) or "").upper()

    hour_word = _HOUR_WORDS[hour % 12]
    if minute == 0:
        spoken = f"{hour_word} o'clock"
    elif minute < 10:
        spoken = f"{hour_word} oh {_ONES[minute]}"
    else:
        spoken = f"{hour_word} {_minutes_to_words(minute)}"

    return f"{spoken} {period}".strip()


# Matches times like 9:00, 9:00 AM, 3:30 PM, 12:15, etc.
_TIME_PATTERN = re.compile(r"\b(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?\b")


def normalize_for_tts(text: str) -> str:
    """Rewrite text so ElevenLabs pronounces TOEIC-style content correctly.

    Transformations applied (in order):
    1. MCQ option prefixes — ``(A)`` → ``A. ``  (period = natural pause)
    2. Clock times        — ``9:00 AM`` → ``nine o'clock AM``
                            ``3:30``    → ``three thirty``
    """
    text = _MCQ_PREFIX.sub(lambda m: f"{m.group(1)}. ", text)
    text = _TIME_PATTERN.sub(_time_match_to_words, text)
    return text


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

    Text is passed through :func:`normalize_for_tts` before synthesis so that
    MCQ option letters and clock times are always spoken naturally.
    Retries once on transient API failure before exiting.
    """
    client = _get_client()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    normalized = normalize_for_tts(text)

    for attempt in (1, 2):
        try:
            audio = client.text_to_speech.convert(
                text=normalized,
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
