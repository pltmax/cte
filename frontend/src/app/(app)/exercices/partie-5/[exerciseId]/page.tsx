import { notFound } from "next/navigation";
import exercicesData from "@/data/exercices/part5_exercises.json";
import ExoPart5Shell from "@/components/exercices/ExoPart5Shell";

// ─── Category map ──────────────────────────────────────────────────────────────

const EXERCISE_MAP: Record<string, string> = {
  "1": "word_form",
  "2": "vocabulary",
  "3": "verb_tense",
  "4": "preposition",
  "5": "conjunction",
  "6": "pronoun",
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function ExerciceP5Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const categoryId = EXERCISE_MAP[exerciseId];
  if (!categoryId) notFound();

  const questions = exercicesData.questions.filter(
    (q) => q.category === categoryId
  );

  const typeInfo = exercicesData.types.find((t) => t.id === categoryId);
  if (!typeInfo) notFound();

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart5Shell
            questions={questions}
            categoryLabel={typeInfo.label}
            categoryDescription={typeInfo.description}
            advice={exercicesData.advice}
            exerciseKey={`partie-5:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
