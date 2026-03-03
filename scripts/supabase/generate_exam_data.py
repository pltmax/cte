#!/usr/bin/env python3
"""
Generate 4 TOEIC mock exam JSON files with unique, non-overlapping questions.

Output: mockexamData/exams/exam_{1,2,3,4}.json

TOEIC structure per exam:
  Part 1 — 6 questions   (24 available → exact fit)
  Part 2 — 25 questions  (125 available → 25 leftover, dropped)
  Part 3 — 13 convs      (52 available → exact fit)
  Part 4 — 10 talks      (40 available → exact fit)
  Part 5 — 30 questions  (120 available → exact fit)
  Part 6 — 4 passages    (16 available → exact fit)
  Part 7 — ~14 passages  (57 available → greedy split by question count)
"""

import json
import random
import pathlib

SEED = 42  # reproducible shuffle
REPO_ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = REPO_ROOT / "mockexamData" / "TOEIC"
OUT = REPO_ROOT / "mockexamData" / "exams"
OUT.mkdir(exist_ok=True)


def load(part_path: str, key: str) -> list:
    with open(REPO_ROOT / "mockexamData" / "TOEIC" / part_path) as f:
        return json.load(f)[key]


def split_even(items: list, n: int, size: int) -> list[list]:
    """Shuffle then slice into n groups of exactly `size` items."""
    pool = items[:]
    random.shuffle(pool)
    return [pool[i * size : (i + 1) * size] for i in range(n)]


def split_part7(passages: list, n: int) -> list[list]:
    """
    Greedy round-robin assignment so each exam gets roughly equal question count.
    Shuffle first so question content is random across exams.
    """
    pool = passages[:]
    random.shuffle(pool)
    groups: list[list] = [[] for _ in range(n)]
    totals = [0] * n
    for p in pool:
        idx = totals.index(min(totals))
        groups[idx].append(p)
        totals[idx] += len(p["questions"])
    return groups


def main() -> None:
    random.seed(SEED)

    p1 = load("listening_part1/part1_transcript.json", "questions")   # 24
    p2 = load("listening_part2/part2_transcript.json", "questions")   # 125
    p3 = load("listening_part3/part3_transcript.json", "conversations")  # 52
    p4 = load("listening_part4/part4_transcript.json", "talks")       # 40
    p5 = load("reading_part5/part5_content.json",      "questions")   # 120
    p6 = load("reading_part6/part6_content.json",      "passages")    # 16
    p7 = load("reading_part7/part7_content.json",      "passages")    # 57

    exams_p1 = split_even(p1, 4, 6)
    exams_p2 = split_even(p2[:100], 4, 25)   # use 100 of 125
    exams_p3 = split_even(p3, 4, 13)
    exams_p4 = split_even(p4, 4, 10)
    exams_p5 = split_even(p5, 4, 30)
    exams_p6 = split_even(p6, 4, 4)
    exams_p7 = split_part7(p7, 4)

    for i in range(4):
        exam = {
            "exam_number": i + 1,
            "part1": exams_p1[i],
            "part2": exams_p2[i],
            "part3": exams_p3[i],
            "part4": exams_p4[i],
            "part5": exams_p5[i],
            "part6": exams_p6[i],
            "part7": exams_p7[i],
        }
        out_path = OUT / f"exam_{i + 1}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(exam, f, indent=2, ensure_ascii=False)

        p7_q = sum(len(p["questions"]) for p in exams_p7[i])
        print(
            f"exam_{i + 1}.json → "
            f"p1={len(exam['part1'])} "
            f"p2={len(exam['part2'])} "
            f"p3={len(exam['part3'])} "
            f"p4={len(exam['part4'])} "
            f"p5={len(exam['part5'])} "
            f"p6={len(exam['part6'])} "
            f"p7_passages={len(exam['part7'])} (p7_q={p7_q})"
        )


if __name__ == "__main__":
    main()
