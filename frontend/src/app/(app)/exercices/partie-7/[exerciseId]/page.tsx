import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExoPart7Shell from "@/components/exercices/ExoPart7Shell";

// ─── Static metadata ──────────────────────────────────────────────────────────

// Exercise 1 → passages 1–5, Exercise 2 → 6–10, Exercise 3 → 11–15
const EXERCISE_RANGES: Record<string, [number, number]> = {
  "1": [1, 5],
  "2": [6, 10],
  "3": [11, 15],
};

const ADVICE = {
  intro: "5 textes variés suivis de questions de compréhension à choix multiples. Lis chaque texte attentivement avant de répondre.",
  strategy: "Lis d'abord la question, puis cherche la réponse dans le texte. Ne réponds jamais de mémoire. Pour les questions de déduction, reste proche de ce qui est dit, n'imagine pas d'informations absentes.",
  traps: [
    { label: "Paraphrase trompeuse", example: "L'option reprend des mots du texte mais déforme le sens. Lis toujours le contexte complet" },
    { label: "Trop vrai pour être bon", example: "Une option vraie en général mais non mentionnée dans CE texte. La bonne réponse doit être dans le document" },
    { label: "Détail hors contexte", example: "Un chiffre ou nom repris tel quel du texte mais associé à la mauvaise information" },
    { label: "Déduction excessive", example: "Aller trop loin dans la déduction. Elle doit rester logiquement ancrée dans le texte" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_reading_part7")
    .select("documents, questions")
    .eq("is_exam", false)
    .eq("doc_count", 1)
    .gte("position", range[0])
    .lte("position", range[1])
    .order("position");

  if (!data?.length) notFound();

  // Flatten documents[0] → {doctype, title, text} expected by ExoPart7Shell
  type DbRow = { documents: Array<{ doctype: string; title: string; text: string }>; questions: unknown[] };
  const passages = (data as DbRow[]).map((row) => ({
    doctype: row.documents[0].doctype,
    title: row.documents[0].title,
    text: row.documents[0].text,
    questions: row.questions,
  }));

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart7Shell
            passages={passages as Parameters<typeof ExoPart7Shell>[0]["passages"]}
            advice={ADVICE}
            exerciseLabel={`Exercice ${exerciseId}`}
            exerciseKey={`partie-7:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
