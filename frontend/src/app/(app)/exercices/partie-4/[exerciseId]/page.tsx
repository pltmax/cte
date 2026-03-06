import { notFound } from "next/navigation";
import exercicesData from "@/data/exercices/part4_exercises.json";
import ExoPart4Shell from "@/components/exercices/ExoPart4Shell";

const EXERCISE_RANGE: Record<string, [number, number]> = {
  "1": [0, 5],
  "2": [5, 10],
  "3": [10, 15],
};

export default async function ExerciceP4Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const range = EXERCISE_RANGE[exerciseId];
  if (!range) notFound();

  const talks = exercicesData.talks.slice(range[0], range[1]);

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart4Shell
            talks={talks as Parameters<typeof ExoPart4Shell>[0]["talks"]}
            advice={exercicesData.advice}
            exerciseLabel={`Exercice ${exerciseId}`}
            exerciseKey={`partie-4:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
