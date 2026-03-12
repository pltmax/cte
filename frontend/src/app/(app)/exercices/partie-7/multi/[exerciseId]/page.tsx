import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExoPart7MultiShell from "@/components/exercices/ExoPart7MultiShell";

// ─── Static metadata ──────────────────────────────────────────────────────────

// Exercise 1 → passage sets 1–5, Exercise 2 → 6–10, Exercise 3 → 11–15
const EXERCISE_RANGES: Record<string, [number, number]> = {
  "1": [1, 5],
  "2": [6, 10],
  "3": [11, 15],
};

const ADVICE = {
  intro: "5 des ensembles de 2 à 3 documents liés. Les questions testent votre capacité à comprendre chaque document et à croiser les informations entre elles.",
  strategy: "Lisez d'abord les questions, repérez les mots-clés, puis cherchez les réponses dans les documents. Pour les questions qui croisent deux documents, vérifiez les deux avant de répondre.",
  traps: [
    { label: "Source incorrecte", example: "L'information est vraie dans le document B mais la question porte sur le document A." },
    { label: "Paraphrase trompeuse", example: "\"complimentary\" dans le texte correspond à \"free\" dans l'option." },
    { label: "Réponse partielle", example: "Choisir une réponse vraie dans un seul document quand la question exige de croiser les deux." },
    { label: "Chiffres et dates", example: "Plusieurs dates ou montants mentionnés. Choisis celui qui répond précisément à la question." },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(EXERCISE_RANGES).map((exerciseId) => ({ exerciseId }));
}

export default async function ExerciceP7MultiPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const range = EXERCISE_RANGES[exerciseId];
  if (!range) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_reading_part7")
    .select("documents, questions")
    .eq("is_exam", false)
    .gt("doc_count", 1)
    .gte("position", range[0])
    .lte("position", range[1])
    .order("position");

  if (!data?.length) notFound();

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart7MultiShell
            passages={data as Parameters<typeof ExoPart7MultiShell>[0]["passages"]}
            advice={ADVICE}
            exerciseLabel={`Exercice ${exerciseId} — Multi-textes`}
            exerciseKey={`partie-7:multi:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
