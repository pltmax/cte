import { notFound } from "next/navigation";
import exercicesData from "@/data/exercices/part1_exercises.json";
import ExoPart1Shell from "@/components/exercices/ExoPart1Shell";

const EXERCISE_TYPE: Record<string, string> = {
  "1": "une_personne",
  "2": "plusieurs_personnes",
  "3": "scene_vide",
};

export default async function ExerciceTypePage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const typeId = EXERCISE_TYPE[exerciseId];
  if (!typeId) notFound();

  const questions = exercicesData.questions.filter((q) => q.type === typeId);
  const type = exercicesData.types.find((t) => t.id === typeId);
  if (!type) notFound();

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart1Shell
            questions={questions}
            types={[type]}
            advice={exercicesData.advice}
          />
        </div>
      </div>
    </div>
  );
}
