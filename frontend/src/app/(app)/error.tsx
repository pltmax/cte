"use client";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-lg font-semibold text-gray-800 mb-2">
        Une erreur s&apos;est produite.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Rafraîchis la page ou réessaie dans quelques instants.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-xl bg-[#6600CC] text-white text-sm font-medium hover:bg-[#5500aa] transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}
