"""
Transform part5_exercises.json flat strings into structured objects expected by ExoPart5Shell:
  - advice: string  →  {intro, strategy, traps: [{label, example}]}
  - questions[n].explanation: string  →  {correct, distractors: {A?, B?, C?, D?}}
  - questions[n].traps: "(A) text. (B) text."  →  parsed into distractors dict
The old 'strategy' and 'traps' fields stay on each question (TypeScript ignores extra keys).
"""
import json
import re
from pathlib import Path

BASE = Path(__file__).parent.parent.parent / "mockexamData" / "TOEIC"

# ─── Structured advice (covers all 6 categories) ──────────────────────────────

ADVICE = {
    "intro": (
        "Dans la Partie 5, tu verras 30 phrases incomplètes, chacune suivie de quatre choix de mots "
        "ou d'expressions (A, B, C, D). Tu dois choisir le terme qui complète le mieux la phrase. "
        "La Partie 5 est entièrement écrite — aucune compréhension orale n'est requise."
    ),
    "strategy": (
        "Identifie la fonction grammaticale du blanc avant de regarder les options : demande-toi si "
        "le blanc doit être rempli par un nom, un verbe, un adjectif ou un adverbe, et élimine "
        "immédiatement tout choix qui n'appartient pas à cette catégorie. Pour les questions de "
        "vocabulaire, cherche la collocation naturelle plutôt que le synonyme le plus proche. Pour "
        "les prépositions et les conjonctions, mémorise les blocs figés — ils ne se déduisent pas. "
        "Gère ton temps : 30 secondes par question en moyenne — si tu bloques, devine et avance."
    ),
    "traps": [
        {
            "label": "Confusion de catégorie grammaticale",
            "example": "Choisir 'decision' là où 'decide' est attendu (ou inversement)"
        },
        {
            "label": "Synonymes partiels",
            "example": "Hésiter entre 'comply with' et 'conform to' sans vérifier la préposition imposée"
        },
        {
            "label": "Futur dans une subordonnée temporelle",
            "example": "Écrire 'will start' après 'when' ou 'by the time' au lieu du présent simple"
        },
        {
            "label": "Mauvais type de pronom",
            "example": "Utiliser 'who' pour une chose, 'which' après une virgule avec 'that', ou 'them' au lieu de 'themselves'"
        },
    ],
}


# ─── Parse traps string into per-letter dict ──────────────────────────────────

def parse_distractors(traps_str: str, answer: str) -> dict:
    """Extract per-letter explanations from a traps string like '(A) text. (B) text.'"""
    # Split on the option markers, keeping the markers
    pattern = r'\(([A-D])\)\s*(.+?)(?=\s*\([A-D]\)|$)'
    matches = re.findall(pattern, traps_str, re.DOTALL)
    result = {}
    for key, text in matches:
        if key != answer:
            result[key] = text.strip().rstrip('.')
    return result


def transform_questions(questions: list) -> list:
    transformed = []
    for q in questions:
        distractors = parse_distractors(q.get("traps", ""), q["answer"])
        new_q = {
            "category": q["category"],
            "sentence": q["sentence"],
            "options": q["options"],
            "answer": q["answer"],
            "explanation": {
                "correct": q.get("explanation", ""),
                "distractors": distractors,
            },
        }
        transformed.append(new_q)
    return transformed


def main():
    src = BASE / "exo_part5" / "part5_exercises.json"
    data = json.loads(src.read_text(encoding="utf-8"))

    data["advice"] = ADVICE
    data["questions"] = transform_questions(data["questions"])

    files = [
        src,
        BASE / "exercices" / "part5_exercises.json",
        Path(__file__).parent.parent.parent / "frontend" / "src" / "data" / "exercices" / "part5_exercises.json",
    ]

    for path in files:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Written {path}")

    # Sanity check
    q0 = data["questions"][0]
    print("\nSanity check — question 0:")
    print("  sentence:", q0["sentence"][:60])
    print("  answer:", q0["answer"])
    print("  explanation.correct:", q0["explanation"]["correct"][:60])
    print("  explanation.distractors keys:", list(q0["explanation"]["distractors"].keys()))


if __name__ == "__main__":
    main()
