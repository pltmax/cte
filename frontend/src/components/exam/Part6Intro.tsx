"use client";

export default function Part6Intro({
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
          Partie 6
        </span>
        <h2 className="text-2xl font-bold text-foreground mt-1">
          Textes à trous
        </h2>
      </div>

      {/* Directions */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Directions
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Lisez le texte ci-dessous. Un mot, un groupe de mots ou une phrase
          manque à quatre endroits du texte, indiqués par les repères{" "}
          <span className="font-semibold text-[#6600CC]">[1]</span>,{" "}
          <span className="font-semibold text-[#6600CC]">[2]</span>,{" "}
          <span className="font-semibold text-[#6600CC]">[3]</span> et{" "}
          <span className="font-semibold text-[#6600CC]">[4]</span>. Choisissez
          parmi les options{" "}
          <span className="font-semibold">(A)</span>,{" "}
          <span className="font-semibold">(B)</span>,{" "}
          <span className="font-semibold">(C)</span> et{" "}
          <span className="font-semibold">(D)</span> le mot ou groupe de mots
          qui convient le mieux à chaque emplacement.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Le type de document est indiqué en haut du texte. Un{" "}
          <span className="font-semibold">passage par écran</span>, avec toutes
          les questions associées visibles simultanément.
        </p>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            "Textes complets",
            "4 blancs par texte",
            "4 réponses (A, B, C, D)",
            "Aucun audio",
            "1 texte par écran",
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
          Commencer la partie 6 →
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
