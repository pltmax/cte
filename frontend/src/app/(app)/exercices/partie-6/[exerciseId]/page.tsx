import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExoPart6Shell from "@/components/exercices/ExoPart6Shell";

// ─── Static metadata ──────────────────────────────────────────────────────────

// Exercise 1 → passages 1–5, Exercise 2 → 6–10, Exercise 3 → 11–15
const EXERCISE_RANGES: Record<string, [number, number]> = {
  "1": [1, 5],
  "2": [6, 10],
  "3": [11, 15],
};

const ADVICE = {
  intro: "4 textes à trous, chacun suivi de 4 questions à choix multiples (A, B, C ou D). Chaque blanc nécessite un mot, une expression ou une phrase entière.",
  strategy: "Lis d'abord l'intégralité du texte pour saisir le contexte, puis traite chaque blanc dans l'ordre. Pour les blancs de phrase entière, vérifie la cohérence logique avec le paragraphe précédent et suivant.",
  traps: [
    { label: "Cohérence ignorée", example: "Choisir un mot grammaticalement correct mais incohérent avec le sujet du texte" },
    { label: "Confusion de registre", example: "Utiliser un terme trop informel dans un contexte professionnel ou vice versa" },
    { label: "Mauvaise préposition", example: "Écrire 'interested to' au lieu de 'interested in'" },
    { label: "Phrase hors contexte", example: "Insérer une phrase qui répond à la question mais rompt le fil du texte" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ExerciceP6Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const range = EXERCISE_RANGES[exerciseId];
  if (!range) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_reading_part6")
    .select("doctype, title, text, questions")
    .eq("is_exam", false)
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
          <ExoPart6Shell
            passages={data as Parameters<typeof ExoPart6Shell>[0]["passages"]}
            advice={ADVICE}
            exerciseLabel={`Exercice ${exerciseId}`}
            exerciseKey={`partie-6:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
