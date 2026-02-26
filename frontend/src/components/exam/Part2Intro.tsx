"use client";

export default function Part2Intro({
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
          Partie 2
        </span>
        <h2 className="text-2xl font-bold text-foreground mt-1">
          Questions-Réponses
        </h2>
      </div>

      {/* Directions */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Directions
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Vous entendrez une question ou une déclaration et trois réponses
          possibles,{" "}
          <span className="font-semibold">(A)</span>,{" "}
          <span className="font-semibold">(B)</span> et{" "}
          <span className="font-semibold">(C)</span>. Ces réponses ne sont{" "}
          <span className="font-semibold">pas imprimées</span> dans votre
          livret de test et ne seront énoncées{" "}
          <span className="font-semibold">qu&apos;une seule fois</span>.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Choisissez la meilleure réponse à la question ou à la déclaration.
          Les questions s&apos;enchaînent automatiquement — trois sont
          affichées simultanément à l&apos;écran.
        </p>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            "25 questions",
            "3 réponses (A, B, C)",
            "Audio uniquement",
            "Pas de texte visible",
            "3 questions par écran",
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
          Commencer la partie 2 →
        </button>
        <p className="text-xs text-gray-400">
          {inExam
            ? "Le minuteur reprend au clic sur ce bouton."
            : "L'audio démarre automatiquement à chaque question."}
        </p>
      </div>
    </div>
  );
}
