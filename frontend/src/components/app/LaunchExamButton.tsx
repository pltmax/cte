"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LaunchExamButton({
  hasCredits,
  isAdmin = false,
}: {
  hasCredits: boolean;
  isAdmin?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Admins can always launch regardless of credits
  const canLaunch = hasCredits || isAdmin;

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
    <div className="flex flex-col gap-1.5">
      <button
        disabled={!canLaunch || loading}
        onClick={handleLaunch}
        className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
          canLaunch && !loading
            ? "bg-[#6600CC] text-white hover:bg-[#5500aa] cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {loading
          ? "Démarrage…"
          : canLaunch
          ? "Démarrer l'examen"
          : "Crédits insuffisants"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
