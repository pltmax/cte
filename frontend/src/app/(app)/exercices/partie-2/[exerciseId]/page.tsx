import { notFound } from "next/navigation";
import exercicesData from "@/data/exercices/part2_exercises.json";
import ExoPart2Shell from "@/components/exercices/ExoPart2Shell";

const EXERCISE_TYPE: Record<string, string> = {
  "1": "wh_questions",
  "2": "indirect_polite_questions",
  "3": "choice_or_questions",
  "4": "statements",
  "5": "tag_questions",
};

export default async function ExerciceP2Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const typeId = EXERCISE_TYPE[exerciseId];
  if (!typeId) notFound();

  const questions = exercicesData.questions.filter((q) => q.category === typeId);
  const type = exercicesData.types.find((t) => t.id === typeId);
  if (!type) notFound();

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart2Shell
            questions={questions}
            types={[type]}
            advice={exercicesData.advice}
            exerciseKey={`partie-2:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
