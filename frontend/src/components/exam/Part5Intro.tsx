"use client";

export default function Part5Intro({
  onStart,
  inExam = false,
}: {
  onStart: () => void;
  inExam?: boolean;
}) {
  return (
    <div className="px-10 py-12 flex flex-col gap-8">
      {/* Label + title */}
      <div>
        <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
          Partie 5
        </span>
        <h2 className="text-2xl font-bold text-foreground mt-1">
          Phrases incomplètes
        </h2>
      </div>

      {/* Directions */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Directions
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Une phrase incomplète est suivie de quatre mots ou groupes de mots
          marqués{" "}
          <span className="font-semibold">(A)</span>,{" "}
          <span className="font-semibold">(B)</span>,{" "}
          <span className="font-semibold">(C)</span> et{" "}
          <span className="font-semibold">(D)</span>. Choisissez le mot ou
          groupe de mots qui complète le mieux la phrase.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Les questions sont{" "}
          <span className="font-semibold">entièrement à l&apos;écrit</span>.
          Prenez le temps de lire chaque phrase attentivement. Vous avancez
          d&apos;un groupe de 10 questions à la fois en cliquant sur le bouton
          de navigation.
        </p>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            "Questions écrites",
            "4 réponses (A, B, C, D)",
            "Aucun audio",
            "10 questions par page",
            "Navigation manuelle",
          ].map((label) => (
            <span
              key={label}
              className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-500"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onStart}
          className="self-start px-8 py-3.5 bg-[#6600CC] text-white text-sm font-bold rounded-full hover:bg-[#5500aa] transition-colors shadow-md"
        >
          Commencer la partie 5 →
        </button>
        <p className="text-xs text-gray-400">
          {inExam
            ? "Le minuteur Lecture reprend au clic sur ce bouton."
            : "Avancez à votre rythme, aucun chronomètre par question."}
        </p>
      </div>
    </div>
  );
}
