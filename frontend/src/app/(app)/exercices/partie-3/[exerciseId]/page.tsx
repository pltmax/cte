import { notFound } from "next/navigation";
import exercicesData from "@/data/exercices/part3_exercises.json";
import ExoPart3Shell from "@/components/exercices/ExoPart3Shell";

// Exercise 1 → conversations 0–4, Exercise 2 → conversations 5–9, Exercise 3 → conversations 10–14
const EXERCISE_RANGE: Record<string, [number, number]> = {
  "1": [0, 5],
  "2": [5, 10],
  "3": [10, 15],
};

export default async function ExerciceP3Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const range = EXERCISE_RANGE[exerciseId];
  if (!range) notFound();

  const conversations = exercicesData.conversations.slice(range[0], range[1]);

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart3Shell
            conversations={conversations}
            advice={exercicesData.advice}
          />
        </div>
      </div>
    </div>
  );
}
