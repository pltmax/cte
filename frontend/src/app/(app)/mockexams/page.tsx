import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LaunchExamButton from "@/components/app/LaunchExamButton";
import type { MockExam } from "@/types/mock-exam";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

function scoreLevel(score: number): { label: string; className: string } {
  if (score >= 900) return { label: "Expert", className: "bg-green-100 text-green-700" };
  if (score >= 730) return { label: "Avancé", className: "bg-blue-100 text-blue-700" };
  if (score >= 550) return { label: "Intermédiaire", className: "bg-yellow-100 text-yellow-700" };
  return { label: "Faible", className: "bg-red-100 text-red-600" };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MockExamsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: exams }] = await Promise.all([
    supabase
      .from("profiles")
      .select("credit_number")
      .eq("id", user.id)
      .single(),
    supabase
      .from("mock_exams")
      .select("id, created_at, score, listening_score, reading_score, status")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false }),
  ]);

  const credits: number = profile?.credit_number ?? 0;
  const pastExams: MockExam[] = (exams ?? []) as MockExam[];

  return (
    <div className="p-8 max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Examens blancs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Entraîne-toi dans les conditions réelles du TOEIC.
        </p>
      </div>

      {/* ── Crédits ─────────────────────────────────────────────────────────── */}
      {credits === 0 ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <div>
            <p className="font-semibold text-amber-800">
              Tu n&apos;as plus de crédits
            </p>
            <p className="text-sm text-amber-600 mt-0.5">
              Chaque examen blanc utilise 1 crédit. Achètes-en pour continuer à
              t&apos;entraîner.
            </p>
          </div>
          <Link
            href="/credits"
            className="shrink-0 px-5 py-2.5 text-sm font-semibold text-white bg-amber-500 rounded-full hover:bg-amber-600 transition-colors"
          >
            Acheter des crédits →
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-5 py-3 bg-[#f3ebff] rounded-xl w-fit">
          <svg
            className="w-4 h-4 text-[#6600CC]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-[#6600CC]">
            {credits} crédit{credits > 1 ? "s" : ""} disponible
            {credits > 1 ? "s" : ""}
          </span>
          <Link
            href="/credits"
            className="text-xs text-[#6600CC]/60 underline hover:text-[#6600CC] ml-1 transition-colors"
          >
            Acheter des crédits
          </Link>
        </div>
      )}

      {/* ── Lancer l'examen ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-8 py-10 flex flex-col items-center text-center gap-7">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              TOEIC — Examen blanc complet
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Simule les conditions exactes du jour&nbsp;J
            </p>
          </div>

          <LaunchExamButton hasCredits={credits > 0} />

          {/* Characteristics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            {[
              { label: "Durée", value: "2h00" },
              { label: "Parties", value: "7 parties" },
              { label: "Questions", value: "200" },
              { label: "Score max", value: "990 pts" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 py-4 bg-gray-50 rounded-xl"
              >
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  {label}
                </span>
                <span className="text-base font-bold text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-100 rounded-xl text-left w-full">
            <svg
              className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-amber-700 leading-relaxed">
              <span className="font-semibold">Important : </span>
              une fois l&apos;examen démarré, il ne peut pas être mis en pause
              ni abandonné. Assure-toi d&apos;avoir 2 heures devant toi, une
              bonne connexion internet et un environnement calme.
            </p>
          </div>
        </div>
      </div>

      {/* ── Historique ───────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Historique des examens
        </h2>

        {pastExams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 bg-white rounded-2xl border border-gray-100 text-center">
            <svg
              className="w-10 h-10 text-gray-200 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-sm text-gray-400 font-medium">
              Aucun examen passé pour l&apos;instant.
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Lance ton premier examen pour commencer à te préparer&nbsp;!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Score
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Niveau
                  </th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pastExams.map((exam) => {
                  const level =
                    exam.score !== null ? scoreLevel(exam.score) : null;
                  return (
                    <tr
                      key={exam.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-foreground">
                        {formatDate(exam.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        {exam.score !== null ? (
                          <span className="text-sm font-semibold text-foreground">
                            {exam.score}{" "}
                            <span className="font-normal text-gray-400">
                              / 990
                            </span>
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {level && (
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${level.className}`}
                          >
                            {level.label}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/mockexams/${exam.id}/bilan`}
                          className="text-sm font-medium text-[#6600CC] hover:underline whitespace-nowrap"
                        >
                          Voir le bilan →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
