"use client";

export default function LaunchExamButton({
  hasCredits,
}: {
  hasCredits: boolean;
}) {
  return (
    <button
      disabled={!hasCredits}
      className={`px-12 py-4 text-base font-bold rounded-full transition-colors ${
        hasCredits
          ? "bg-[#6600CC] text-white hover:bg-[#5500aa] shadow-md cursor-pointer"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
    >
      {hasCredits ? "Lancer l'examen →" : "Crédits insuffisants"}
    </button>
  );
}
