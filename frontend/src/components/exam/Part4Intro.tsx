"use client";

export default function Part4Intro({
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
          Partie 4
        </span>
        <h2 className="text-2xl font-bold text-foreground mt-1">
          Monologues
        </h2>
      </div>

      {/* Directions */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Directions
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Vous entendrez des courts monologues prononcés par une seule
          personne. Vous devrez répondre à{" "}
          <span className="font-semibold">3 questions</span> par document.
          Choisissez la meilleure réponse parmi les options{" "}
          <span className="font-semibold">(A)</span>,{" "}
          <span className="font-semibold">(B)</span>,{" "}
          <span className="font-semibold">(C)</span> et{" "}
          <span className="font-semibold">(D)</span> imprimées dans votre
          livret.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Le type de document est indiqué à l&apos;écran. Le monologue ne
          sera énoncé{" "}
          <span className="font-semibold">qu&apos;une seule fois</span>. Les
          questions et les réponses sont visibles. Un nouveau document
          s&apos;affiche automatiquement après le délai de réponse.
        </p>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            "30 questions",
            "10 documents",
            "3 questions par document",
            "4 réponses (A, B, C, D)",
            "Type de document affiché",
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
          Commencer la partie 4 →
        </button>
        <p className="text-xs text-gray-400">
          {inExam
            ? "Le minuteur reprend au clic sur ce bouton."
            : "L'audio démarre automatiquement à chaque document."}
        </p>
      </div>
    </div>
  );
}
