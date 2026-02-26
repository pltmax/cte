"use client";

export default function Part1Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="px-10 py-12 flex flex-col gap-8">
      {/* Label + title */}
      <div>
        <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
          Partie 1
        </span>
        <h2 className="text-2xl font-bold text-foreground mt-1">
          Photographies
        </h2>
      </div>

      {/* Directions */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Directions
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Pour chaque question de cette partie, vous verrez une photographie et
          entendrez quatre courtes déclarations. Les déclarations{" "}
          <span className="font-semibold">(A)</span>,{" "}
          <span className="font-semibold">(B)</span>,{" "}
          <span className="font-semibold">(C)</span> et{" "}
          <span className="font-semibold">(D)</span> ne sont{" "}
          <span className="font-semibold">pas imprimées</span> dans votre
          livret de test et ne seront énoncées{" "}
          <span className="font-semibold">qu&apos;une seule fois</span>.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Choisissez la déclaration qui correspond le mieux à la photographie
          et marquez votre réponse. L&apos;examen passera automatiquement à la
          question suivante une fois l&apos;audio terminé.
        </p>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: "6 photographies" },
            { label: "Audio automatique" },
            { label: "Passage chronométré" },
            { label: "1 seule écoute par question" },
          ].map(({ label }) => (
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
          Commencer la partie 1 →
        </button>
        <p className="text-xs text-gray-400">
          Le minuteur démarre au clic sur ce bouton.
        </p>
      </div>
    </div>
  );
}
