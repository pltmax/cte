import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { MockExam } from "@/types/mock-exam";

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export default async function BilanPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: exam } = await supabase
    .from("mock_exams")
    .select("*")
    .eq("id", examId)
    .eq("user_id", user.id)
    .single();

  if (!exam) redirect("/mockexams");

  const e = exam as MockExam;

  return (
    <div className="p-8 max-w-3xl space-y-6">
      {/* Back */}
      <Link
        href="/mockexams"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-foreground transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Retour aux examens blancs
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bilan de l&apos;examen
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Passé le {formatDate(e.created_at)}
        </p>
      </div>

      {/* Score summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10 flex flex-col items-center text-center gap-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Score total
        </p>
        <p className="text-6xl font-bold text-[#6600CC]">
          {e.score ?? "—"}
          <span className="text-2xl font-normal text-gray-300"> / 990</span>
        </p>
        <div className="flex gap-6 mt-4 text-sm text-gray-500">
          <span>
            Écoute :{" "}
            <span className="font-semibold text-foreground">
              {e.listening_score ?? "—"} / 495
            </span>
          </span>
          <span>
            Lecture :{" "}
            <span className="font-semibold text-foreground">
              {e.reading_score ?? "—"} / 495
            </span>
          </span>
        </div>
      </div>

      {/* Advice placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10 flex flex-col items-center text-center gap-3">
        <svg
          className="w-10 h-10 text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <p className="text-sm font-medium text-gray-400">
          Conseils personnalisés à venir
        </p>
        <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
          L&apos;analyse détaillée par partie et les recommandations
          d&apos;exercices seront disponibles prochainement.
        </p>
      </div>
    </div>
  );
}
