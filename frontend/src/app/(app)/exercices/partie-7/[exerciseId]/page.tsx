import { notFound } from "next/navigation";
import exercicesData from "@/data/exercices/part7_exercises.json";
import ExoPart7Shell from "@/components/exercices/ExoPart7Shell";

// Each exercise covers 5 passages: exercise 1 → [0,5), exercise 2 → [5,10), exercise 3 → [10,15)
const EXERCISE_RANGES: Record<string, [number, number]> = {
  "1": [0, 5],
  "2": [5, 10],
  "3": [10, 15],
};

export function generateStaticParams() {
  return Object.keys(EXERCISE_RANGES).map((exerciseId) => ({ exerciseId }));
}

export default async function ExerciceP7Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const range = EXERCISE_RANGES[exerciseId];
  if (!range) notFound();

  const passages = exercicesData.passages.slice(range[0], range[1]);

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart7Shell
            passages={passages}
            advice={exercicesData.advice}
            exerciseLabel={`Exercice ${exerciseId}`}
            exerciseKey={`partie-7:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
