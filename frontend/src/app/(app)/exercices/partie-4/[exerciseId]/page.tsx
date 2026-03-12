import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExoPart4Shell from "@/components/exercices/ExoPart4Shell";

// ─── Static metadata ──────────────────────────────────────────────────────────

// Exercise 1 → talks 1–5, Exercise 2 → 6–10, Exercise 3 → 11–15
const EXERCISE_RANGE: Record<string, [number, number]> = {
  "1": [1, 5],
  "2": [6, 10],
  "3": [11, 15],
};

const ADVICE = {
  intro: "10 monologues (discours, annonces, messages) suivis chacun de 3 questions (A, B, C ou D). L'audio ne passe qu'une fois.",
  strategy: "Lis les 3 questions avant l'audio pour identifier les informations-clés à retenir. Le but du message (sujet, décision, action à faire) est généralement annoncé au tout début.",
  traps: [
    { label: "Chiffres et dates", example: "Plusieurs nombres mentionnés — retiens uniquement celui lié à la question" },
    { label: "Inférence excessive", example: "Ne va pas au-delà de ce qui est dit explicitement" },
    { label: "Confusion de lieu ou de personne", example: "Qui parle ? À qui s'adresse-t-il ?" },
    { label: "Paraphrase trompeuse", example: "L'option reprend un mot du monologue mais déforme l'information" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ExerciceP4Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const range = EXERCISE_RANGE[exerciseId];
  if (!range) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_listening_part4")
    .select("title, text, questions, audio_url, graphic_title, graphic_doctype, graphic")
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
          <ExoPart4Shell
            talks={data as Parameters<typeof ExoPart4Shell>[0]["talks"]}
            advice={ADVICE}
            exerciseLabel={`Exercice ${exerciseId}`}
            exerciseKey={`partie-4:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
