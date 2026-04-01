import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExoPart2Shell from "@/components/exercices/ExoPart2Shell";

// ─── Static metadata ──────────────────────────────────────────────────────────

const EXERCISE_TYPE: Record<string, string> = {
  "1": "wh_questions",
  "2": "indirect_polite_questions",
  "3": "choice_or_questions",
  "4": "statements",
  "5": "tag_questions",
};

const TYPES = [
  { id: "wh_questions", label: "Questions en Wh-", description: "Who, What, Where, When, Why, How — identifie le mot interrogatif dès la première seconde." },
  { id: "indirect_polite_questions", label: "Questions polies indirectes", description: "Would you mind, Could you, Do you happen to know — rarement un simple Oui/Non." },
  { id: "choice_or_questions", label: "Questions alternatives", description: "A ou B — jamais Yes/No ; la réponse peut choisir, rejeter ou accepter les deux." },
  { id: "statements", label: "Énoncés", description: "Pas une question — écoute l'intention : problème, bonne nouvelle, opinion, écart." },
  { id: "tag_questions", label: "Questions-tags", description: "Ignore le tag (relance) final ; réponds selon la vérité de l'action principale." },
];

const ADVICE = {
  intro: "10 questions à choix multiples (A, B ou C). Une phrase ou question est lue ; tu dois choisir la meilleure réponse. Chaque audio ne passe qu'une fois.",
  strategy: "Identifie le mot interrogatif (Wh-, tag, alternative) dès la première seconde pour anticiper le type de réponse. Méfie-toi des répétitions de mots du stimulus qui n'apportent pas la bonne information.",
  traps: [
    { label: "Répétition de mot", example: "La bonne réponse reprend rarement un mot clé de la question" },
    { label: "Sound-alike", example: "meet / meat, write / right — confusions phonétiques fréquentes" },
    { label: "Réponse trop directe", example: "Un simple Yes/No est rarement la bonne réponse" },
    { label: "Hors sujet", example: "Réponse grammaticalement correcte mais ne répond pas à la question posée" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ExerciceP2Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const typeId = EXERCISE_TYPE[exerciseId];
  if (!typeId) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_listening_part2")
    .select("category, question, options, answer, explanation, question_audio_url, option_audio_urls")
    .eq("is_exam", false)
    .eq("category", typeId)
    .order("position");

  if (!data?.length) notFound();

  const type = TYPES.find((t) => t.id === typeId)!;

  return (
    <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart2Shell
            questions={data as Parameters<typeof ExoPart2Shell>[0]["questions"]}
            types={[type]}
            advice={ADVICE}
            exerciseKey={`partie-2:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
