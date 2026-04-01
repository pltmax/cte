import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExoPart3Shell from "@/components/exercices/ExoPart3Shell";

// ─── Static metadata ──────────────────────────────────────────────────────────

// Exercise 1 → conversations 1–5, Exercise 2 → 6–10, Exercise 3 → 11–15 (1-based positions)
const EXERCISE_RANGE: Record<string, [number, number]> = {
  "1": [1, 5],
  "2": [6, 10],
  "3": [11, 15],
};

const ADVICE = {
  intro: "5 conversations entre 2 ou 3 personnes suivies de 3 questions (A, B, C ou D). L'audio ne passe qu'une fois.",
  strategy: "Lis d'abord les questions avant l'audio pour savoir quoi écouter. Concentre-toi sur le problème exposé au début et la solution ou décision finale.",
  traps: [
    { label: "Réponse partielle", example: "Une option vraie mais qui ne répond qu'à une partie de la question" },
    { label: "Inférence excessive", example: "Déduire une information que la conversation ne mentionne pas" },
    { label: "Confusion de locuteur", example: "Attribuer un propos à la mauvaise personne" },
    { label: "Son similaire", example: "Confondre meeting / meeting room, oder / order" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ExerciceP3Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const range = EXERCISE_RANGE[exerciseId];
  if (!range) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_listening_part3")
    .select("dialogue, questions, audio_url, conv_type")
    .eq("is_exam", false)
    .gte("position", range[0])
    .lte("position", range[1])
    .order("position");

  if (!data?.length) notFound();

  // Map conv_type → type (ExoPart3Shell.Conversation.type)
  const conversations = data.map((row) => ({ ...row, type: row.conv_type }));

  return (
    <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart3Shell
            conversations={conversations as Parameters<typeof ExoPart3Shell>[0]["conversations"]}
            advice={ADVICE}
            exerciseLabel={`Exercice ${exerciseId}`}
            exerciseKey={`partie-3:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
