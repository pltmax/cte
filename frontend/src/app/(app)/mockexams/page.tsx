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
  if (score >= 900) return { label: "C1 / C2", className: "text-emerald-600" };
  if (score >= 730) return { label: "B2", className: "text-blue-500" };
  if (score >= 550) return { label: "B1 / B2", className: "text-amber-500" };
  return { label: "A2 / B1", className: "text-gray-400" };
}

function StatusBadge({ status }: { status: string }) {
  if (status === "abandoned") {
    return (
      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-500 rounded-full">
        Abandonnée
      </span>
    );
  }
  if (status !== "completed") {
    return (
      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-400 rounded-full">
        Non terminé
      </span>
    );
  }
  return null;
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
      .select("credit_number, role")
      .eq("id", user.id)
      .single(),
    supabase
      .from("mock_exams")
      .select("id, created_at, score, listening_score, reading_score, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const credits: number = profile?.credit_number ?? 0;
  const isAdmin: boolean = profile?.role === "admin";
  const pastExams: MockExam[] = (exams ?? []) as MockExam[];

  return (
    <div className="px-4 md:px-6 py-8 md:py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Examens blancs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Simule les conditions du TOEIC et mesure ta progression.
        </p>
      </div>

      {/* ── Lancer l'examen ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Exam identity */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
            TOEIC Listening &amp; Reading
          </p>
          <h2 className="text-xl font-bold text-foreground">
            Examen blanc complet
          </h2>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
            <span>2 heures</span>
            <span className="text-gray-200">·</span>
            <span>7 parties</span>
            <span className="text-gray-200">·</span>
            <span>200 questions</span>
            <span className="text-gray-200">·</span>
            <span>Écoute 45 min + Lecture 75 min</span>
            <span className="text-gray-200">·</span>
            <span>Score max 990</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 flex flex-col gap-3">
          {/* Action row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <LaunchExamButton hasCredits={credits > 0} isAdmin={isAdmin} />
            <div className="text-sm">
              {credits === 0 && !isAdmin ? (
                <span className="text-amber-600 text-xs">
                  Aucun crédit disponible —{" "}
                  <Link
                    href="/credits"
                    className="underline hover:text-amber-800 transition-colors"
                  >
                    en acheter
                  </Link>
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  {credits} crédit{credits !== 1 ? "s" : ""} disponible
                  {credits !== 1 ? "s" : ""}
                  {credits <= 1 && !isAdmin && (
                    <>
                      {" "}—{" "}
                      <Link
                        href="/credits"
                        className="hover:text-gray-600 transition-colors"
                      >
                        en acheter
                      </Link>
                    </>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Compact warning */}
          <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
            Une fois démarré, l&apos;examen peut être abandonné à tout moment
            via le bouton &quot;Abandonner&quot; pour sauvegarder tes réponses.
          </p>
        </div>
      </div>

      {/* ── Historique ───────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Historique
        </h2>

        {pastExams.length === 0 ? (
          <div className="py-10 bg-white rounded-xl border border-gray-200 text-center">
            <p className="text-sm text-gray-400">
              Aucun examen passé pour l&apos;instant.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    Score global
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    Écoute
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    Lecture
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    Niveau
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pastExams.map((exam) => {
                  const isCompleted = exam.status === "completed";
                  const isAbandoned = exam.status === "abandoned";
                  const isInProgress = !isCompleted && !isAbandoned;
                  const level =
                    exam.score !== null && isCompleted
                      ? scoreLevel(exam.score)
                      : null;
                  return (
                    <tr
                      key={exam.id}
                      className={`hover:bg-gray-50 transition-colors ${isInProgress ? "opacity-60" : ""}`}
                    >
                      <td className={`px-6 py-3.5 text-sm ${isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                        {formatDate(exam.created_at)}
                        <StatusBadge status={exam.status} />
                      </td>
                      <td className="px-6 py-3.5">
                        {exam.score !== null && !isInProgress ? (
                          <span className={`text-sm font-semibold tabular-nums ${isCompleted ? "text-foreground" : "text-gray-400"}`}>
                            {exam.score}
                            <span className="font-normal text-gray-400">
                              {" "}/ 990
                            </span>
                          </span>
                        ) : (
                          <span className="text-sm text-gray-300">—</span>
                        )}
                      </td>
                      <td className={`px-6 py-3.5 text-sm tabular-nums ${isCompleted ? "text-gray-500" : "text-gray-400"}`}>
                        {exam.listening_score !== null && !isInProgress
                          ? `${exam.listening_score} / 495`
                          : "—"}
                      </td>
                      <td className={`px-6 py-3.5 text-sm tabular-nums ${isCompleted ? "text-gray-500" : "text-gray-400"}`}>
                        {exam.reading_score !== null && !isInProgress
                          ? `${exam.reading_score} / 495`
                          : "—"}
                      </td>
                      <td className="px-6 py-3.5">
                        {level && (
                          <span
                            className={`text-xs font-semibold ${level.className}`}
                          >
                            {level.label}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {isCompleted && (
                          <Link
                            href={`/mockexams/${exam.id}/bilan`}
                            className="text-xs text-gray-400 hover:text-foreground transition-colors"
                          >
                            Voir le bilan →
                          </Link>
                        )}
                        {isAbandoned && (
                          <Link
                            href={`/mockexams/${exam.id}/bilan`}
                            className="text-xs text-gray-400 hover:text-foreground transition-colors"
                          >
                            Voir le bilan partiel →
                          </Link>
                        )}
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
