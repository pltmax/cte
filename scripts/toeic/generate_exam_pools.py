"""
Generate per-part pool JSON files from the 4 mock exam datasets.

Each item in a pool gets a unique id in the format: p{part}_e{exam}_q{zero_padded_index}
Pool files are written to frontend/src/data/exam_pools/part{1-7}_pool.json
"""

import json
import pathlib

ROOT = pathlib.Path(__file__).parent.parent.parent  # Project_1/
EXAMS_DIR = ROOT / "mockexamData" / "exams"
OUT_DIR = ROOT / "frontend" / "src" / "data" / "exam_pools"
OUT_DIR.mkdir(parents=True, exist_ok=True)

EXAM_COUNT = 4


def load_exam(n: int) -> dict:
    path = EXAMS_DIR / f"exam_{n}.json"
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def pad(i: int, width: int = 3) -> str:
    return str(i).zfill(width)


def main() -> None:
    pools: dict[str, list[dict]] = {f"p{p}": [] for p in range(1, 8)}

    for exam_n in range(1, EXAM_COUNT + 1):
        data = load_exam(exam_n)

        # ── Part 1 — individual questions ─────────────────────────────────────
        for idx, item in enumerate(data.get("part1", [])):
            pools["p1"].append({
                "id": f"p1_e{exam_n}_q{pad(idx)}",
                "source_exam": exam_n,
                **item,
            })

        # ── Part 2 — individual questions ─────────────────────────────────────
        for idx, item in enumerate(data.get("part2", [])):
            pools["p2"].append({
                "id": f"p2_e{exam_n}_q{pad(idx)}",
                "source_exam": exam_n,
                **item,
            })

        # ── Part 3 — conversation groups (3 Qs each) ─────────────────────────
        for idx, item in enumerate(data.get("part3", [])):
            pools["p3"].append({
                "id": f"p3_e{exam_n}_q{pad(idx)}",
                "source_exam": exam_n,
                **item,
            })

        # ── Part 4 — talk groups (3 Qs each) ─────────────────────────────────
        for idx, item in enumerate(data.get("part4", [])):
            pools["p4"].append({
                "id": f"p4_e{exam_n}_q{pad(idx)}",
                "source_exam": exam_n,
                **item,
            })

        # ── Part 5 — individual questions ─────────────────────────────────────
        for idx, item in enumerate(data.get("part5", [])):
            pools["p5"].append({
                "id": f"p5_e{exam_n}_q{pad(idx)}",
                "source_exam": exam_n,
                **item,
            })

        # ── Part 6 — passage groups (4 Qs each) ──────────────────────────────
        for idx, item in enumerate(data.get("part6", [])):
            pools["p6"].append({
                "id": f"p6_e{exam_n}_q{pad(idx)}",
                "source_exam": exam_n,
                **item,
            })

        # ── Part 7 — passage groups (variable Qs) ────────────────────────────
        for idx, item in enumerate(data.get("part7", [])):
            pools["p7"].append({
                "id": f"p7_e{exam_n}_q{pad(idx)}",
                "source_exam": exam_n,
                **item,
            })

    for part_key, items in pools.items():
        out_path = OUT_DIR / f"{part_key}_pool.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False, indent=2)
        print(f"  {out_path.relative_to(ROOT)}  ({len(items)} items)")

    # Summary
    print("\nPool summary:")
    for pk, items in pools.items():
        print(f"  {pk}: {len(items)} pool items")


if __name__ == "__main__":
    main()
