import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExoPart5Shell from "@/components/exercices/ExoPart5Shell";

// ─── Static metadata ──────────────────────────────────────────────────────────

const EXERCISE_MAP: Record<string, string> = {
  "1": "word_form",
  "2": "vocabulary",
  "3": "verb_tense",
  "4": "preposition",
  "5": "conjunction",
  "6": "pronoun",
};

const TYPES = [
  { id: "word_form", label: "Forme du mot", description: "Choisissez la catégorie grammaticale (nom, verbe, adjectif ou adverbe) qui correspond à la position du blanc dans la phrase." },
  { id: "vocabulary", label: "Vocabulaire", description: "Choisissez le mot dont le sens et la collocation s'accordent le mieux au contexte professionnel de la phrase." },
  { id: "verb_tense", label: "Temps verbaux", description: "Choisissez le temps ou l'aspect verbal qui correspond aux indices temporels et au contexte de la phrase." },
  { id: "preposition", label: "Prépositions", description: "Choisissez la préposition ou la locution prépositionnelle qui forme la collocation correcte avec les mots autour du blanc." },
  { id: "conjunction", label: "Conjonctions", description: "Choisissez le mot de liaison (conjonction de subordination ou adverbe de liaison) qui exprime la relation logique correcte entre les deux propositions." },
  { id: "pronoun", label: "Pronoms", description: "Choisissez le pronom dont le type (relatif, réfléchi, personnel, possessif) et la forme correspondent à l'antécédent et à la fonction grammaticale." },
];

const ADVICE = {
  intro: "15 phrases incomplètes, chacune suivie de quatre choix de mots ou d'expressions (A, B, C, D). Tu dois choisir le terme qui complète le mieux la phrase.",
  strategy: "Détermine si le blanc attend un nom, verbe, adjectif ou adverbe, et élimine les options incompatibles. Mémorise les prépositions et conjonctions fréquentes. Avance vite : 30 secondes/question, devine si tu bloques.",
  traps: [
    { label: "Confusion de catégorie grammaticale", example: "Choisir 'decision' là où 'decide' est attendu (ou inversement)" },
    { label: "Synonymes partiels", example: "Hésiter entre 'comply with' et 'conform to' sans vérifier la préposition imposée" },
    { label: "Futur dans une subordonnée temporelle", example: "Écrire 'will start' après 'when' ou 'by the time' au lieu du présent simple" },
    { label: "Mauvais type de pronom", example: "Utiliser 'who' pour une chose, 'which' après une virgule avec 'that', ou 'them' au lieu de 'themselves'" },
    { label: "Confusion entre adverbe et adjectif", example: "Choisir 'quick' au lieu de 'quickly' pour modifier un verbe, ou inversement" },
    { label: "Association de mots incorrecte", example: "Sélectionner 'make a picture' au lieu de 'take a picture'" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ExerciceP5Page({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const categoryId = EXERCISE_MAP[exerciseId];
  if (!categoryId) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_reading_part5")
    .select("text, options, answer, category, explanation")
    .eq("is_exam", false)
    .eq("category", categoryId)
    .order("position");

  if (!data?.length) notFound();

  // ExoPart5Shell expects P5Question.sentence; DB stores the sentence in "text"
  const questions = data.map((q) => ({ ...q, sentence: q.text }));

  const typeInfo = TYPES.find((t) => t.id === categoryId)!;

  return (
    <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <ExoPart5Shell
            questions={questions as Parameters<typeof ExoPart5Shell>[0]["questions"]}
            categoryLabel={typeInfo.label}
            categoryDescription={typeInfo.description}
            advice={ADVICE}
            exerciseKey={`partie-5:${exerciseId}`}
          />
        </div>
      </div>
    </div>
  );
}
