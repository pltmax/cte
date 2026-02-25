"""Pydantic v2 models for all 7 TOEIC parts and the top-level exam manifest."""
from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field


# ─── Part 1 — Photographs ────────────────────────────────────────────────────

class Part1Question(BaseModel):
    image: str | None = None  # source filename from transcript JSON
    statements: list[str] = Field(min_length=4, max_length=4)
    answer: Literal["A", "B", "C", "D"]
    # Populated by generator
    audio_files: dict[str, str] = Field(default_factory=dict)  # e.g. {"A": "audio/q01_A.mp3"}
    image_file: str | None = None  # relative path in output folder


class Part1Input(BaseModel):
    questions: list[Part1Question]


class Part1Manifest(BaseModel):
    questions: list[Part1Question]


# ─── Part 2 — Question-Response ──────────────────────────────────────────────

class Part2Question(BaseModel):
    category: str | None = None  # e.g. "yes_no", "why_how", "who_where_when", etc.
    question: str
    options: list[str] = Field(min_length=3, max_length=3)
    answer: Literal["A", "B", "C"]
    # Populated by generator
    question_audio: str | None = None
    option_audio_files: dict[str, str] = Field(default_factory=dict)


class Part2Input(BaseModel):
    questions: list[Part2Question]


class Part2Manifest(BaseModel):
    questions: list[Part2Question]


# ─── Part 3 — Conversations ───────────────────────────────────────────────────

class DialogueTurn(BaseModel):
    speaker: Literal["M", "F"]
    text: str


class Part3MCQuestion(BaseModel):
    text: str
    options: list[str] = Field(min_length=4, max_length=4)
    answer: Literal["A", "B", "C", "D"]


class Part3Conversation(BaseModel):
    dialogue: list[DialogueTurn]
    questions: list[Part3MCQuestion]
    # Populated by generator
    audio_file: str | None = None


class Part3Input(BaseModel):
    conversations: list[Part3Conversation]


class Part3Manifest(BaseModel):
    conversations: list[Part3Conversation]


# ─── Part 4 — Short Talks ─────────────────────────────────────────────────────

class Part4MCQuestion(BaseModel):
    text: str
    options: list[str] = Field(min_length=4, max_length=4)
    answer: Literal["A", "B", "C", "D"]


class Part4Talk(BaseModel):
    title: str | None = None
    text: str
    graphic_title: str | None = None  # e.g. "Store Directory", "Weather Forecast"
    graphic_doctype: str | None = None  # e.g. "directory", "schedule", "chart", "floor_plan", "table", "timeline"
    graphic: dict[str, str] | None = None  # key → value entries
    questions: list[Part4MCQuestion]
    # Populated by generator
    audio_file: str | None = None


class Part4Input(BaseModel):
    talks: list[Part4Talk]


class Part4Manifest(BaseModel):
    talks: list[Part4Talk]


# ─── Part 5 — Incomplete Sentences ───────────────────────────────────────────

class Part5Question(BaseModel):
    text: str
    options: list[str] = Field(min_length=4, max_length=4)
    answer: Literal["A", "B", "C", "D"]


class Part5Input(BaseModel):
    questions: list[Part5Question]


class Part5Manifest(BaseModel):
    questions: list[Part5Question]


# ─── Part 6 — Text Completion ─────────────────────────────────────────────────

class Part6Question(BaseModel):
    """One blank in the passage — no question text, just options and answer."""
    options: list[str] = Field(min_length=4, max_length=4)
    answer: Literal["A", "B", "C", "D"]


class Part6Passage(BaseModel):
    """A single passage with exactly 4 blanks (_______ each) and 4 questions."""
    doctype: str  # e.g. "memo", "email", "letter", "notice", "advertisement", "article", "press_release"
    text: str  # passage text with _______ markers
    questions: list[Part6Question] = Field(min_length=4, max_length=4)
    image_file: str | None = None  # relative path in output folder


class Part6Input(BaseModel):
    passages: list[Part6Passage]


class Part6Manifest(BaseModel):
    passages: list[Part6Passage]
    image_files: list[str] = Field(default_factory=list)


# ─── Part 7 — Reading Comprehension ──────────────────────────────────────────

class Part7Question(BaseModel):
    text: str
    options: list[str] = Field(min_length=4, max_length=4)
    answer: Literal["A", "B", "C", "D"]


class Part7Document(BaseModel):
    """One document within a passage (single-doc passages have exactly one)."""
    doctype: str  # e.g. "email", "advertisement", "memo", "notice", "invoice", "article", "review", etc.
    text: str


class Part7Passage(BaseModel):
    """A passage made of one or more documents."""
    documents: list[Part7Document]  # 1 document for single-doc, 2–3 for multi-doc
    questions: list[Part7Question]  # 2–6 questions
    image_file: str | None = None  # relative path in output folder


class Part7Input(BaseModel):
    passages: list[Part7Passage]


class Part7Manifest(BaseModel):
    passages: list[Part7Passage]
    image_files: list[str] = Field(default_factory=list)


# ─── Top-level Exam Manifest ─────────────────────────────────────────────────

class ExamManifest(BaseModel):
    part1: Part1Manifest | None = None
    part2: Part2Manifest | None = None
    part3: Part3Manifest | None = None
    part4: Part4Manifest | None = None
    part5: Part5Manifest | None = None
    part6: Part6Manifest | None = None
    part7: Part7Manifest | None = None
