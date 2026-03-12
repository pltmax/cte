import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExoPart1Shell from "@/components/exercices/ExoPart1Shell";

// ─── Static metadata ──────────────────────────────────────────────────────────

const EXERCISE_TYPE: Record<string, string> = {
  "1": "une_personne",
  "2": "plusieurs_personnes",
  "3": "scene_vide",
};

const TYPES = [
  { id: "une_personne", label: "Une personne", description: "La photo montre une seule personne." },
  { id: "plusieurs_personnes", label: "Plusieurs personnes", description: "La photo montre un groupe de personnes." },
  { id: "scene_vide", label: "Scène sans personne", description: "La photo ne montre aucune personne." },
];

const ADVICE = {
  intro: "6 photos, 4 énoncés (A–D) pour chacune. L'audio ne passe qu'une seule fois et rien n'est écrit à l'écran.",
  strategy: "Observe la photo avant l'audio : identifie le(s) sujet(s), l'action ou l'état, et les objets au premier plan.",
  traps: [
    { label: "Mauvaise action", example: "writing au lieu de reading" },
    { label: "Mauvais objet", example: "a document au lieu de a book" },
    { label: "Personne inventée", example: "une personne absente de la photo" },
    { label: "Mauvais lieu", example: "at the counter au lieu de at the table" },
    { label: "Inversion d'état", example: "piled in a sink au lieu de stacked on a shelf" },
    { label: "Décalage temporel", example: "setting up chairs alors que la réunion est déjà commencée" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ExerciceP1Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const typeId = EXERCISE_TYPE[exerciseId];
  if (!typeId) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_listening_part1")
    .select("image, statements, answer, image_url, audio_urls, explanation, category")
    .eq("is_exam", false)
    .eq("category", typeId)
    .order("position");

  if (!data?.length) notFound();

  // ExoPart1Shell.ExoP1Question expects "type"; DB stores it as "category"
  const questions = data.map((q) => ({ ...q, type: q.category }));

  const type = TYPES.find((t) => t.id === typeId)!;

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart1Shell
            questions={questions as Parameters<typeof ExoPart1Shell>[0]["questions"]}
            types={[type]}
            advice={ADVICE}
            exerciseKey={`partie-1:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
