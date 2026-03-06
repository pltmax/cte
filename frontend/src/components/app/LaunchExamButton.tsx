"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loadPriorityStore } from "@/lib/exam/priority";
import { buildExamSelection } from "@/lib/exam/selector";

// ── Pool imports (static JSON, bundled at build time) ─────────────────────────
import p1Pool from "@/data/exam_pools/p1_pool.json";
import p2Pool from "@/data/exam_pools/p2_pool.json";
import p3Pool from "@/data/exam_pools/p3_pool.json";
import p4Pool from "@/data/exam_pools/p4_pool.json";
import p5Pool from "@/data/exam_pools/p5_pool.json";
import p6Pool from "@/data/exam_pools/p6_pool.json";
import p7Pool from "@/data/exam_pools/p7_pool.json";

import type { AllPools } from "@/lib/exam/selector";

const pools = {
  p1: p1Pool,
  p2: p2Pool,
  p3: p3Pool,
  p4: p4Pool,
  p5: p5Pool,
  p6: p6Pool,
  p7: p7Pool,
} as unknown as AllPools;

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

    // Build a dynamic exam from the weighted pools
    const store = loadPriorityStore();
    const { examData, meta } = buildExamSelection(pools, store);

    localStorage.setItem(`cts_exam_data_${examId}`, JSON.stringify(examData));
    localStorage.setItem(`cts_exam_meta_${examId}`, JSON.stringify(meta));

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
