"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LaunchExamButton({
  hasCredits,
}: {
  hasCredits: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLaunch = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: examId, error: rpcError } = await supabase.rpc("launch_exam");

    if (rpcError) {
      setLoading(false);
      setError(
        rpcError.message.includes("insufficient_credits")
          ? "Tu n'as plus de crédits disponibles."
          : "Une erreur s'est produite. Réessaie."
      );
      return;
    }

    router.push(`/mockexams/${examId}`);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        disabled={!hasCredits || loading}
        onClick={handleLaunch}
        className={`px-12 py-4 text-base font-bold rounded-full transition-colors ${
          hasCredits && !loading
            ? "bg-[#6600CC] text-white hover:bg-[#5500aa] shadow-md cursor-pointer"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {loading
          ? "Démarrage…"
          : hasCredits
          ? "Lancer l'examen →"
          : "Crédits insuffisants"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
