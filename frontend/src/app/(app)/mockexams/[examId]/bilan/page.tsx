import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { MockExam } from "@/types/mock-exam";
import type { ExamData } from "@/types/exam-data";

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

// ─── Review helpers ────────────────────────────────────────────────────────────

interface ReviewRow {
  qNum: number;
  given: string;
  correct: string;
  isCorrect: boolean;
}

interface PartReview {
  n: number;
  label: string;
  rows: ReviewRow[];
  answered: number;
  total: number;
  correct: number;
}

function buildReviewRows(
  answers: Record<string, Record<string, string>>,
  examData: ExamData
): PartReview[] {
  const parts: PartReview[] = [];

  // Part 1 — offset 0, 6 questions
  {
    const p1Ans = answers.p1 ?? {};
    const questions = examData.part1 ?? [];
    const rows: ReviewRow[] = [];
    for (let i = 0; i < questions.length; i++) {
      const given = p1Ans[String(i)];
      if (!given) continue;
      const correct = questions[i].answer.toUpperCase();
      rows.push({ qNum: i + 1, given: given.toUpperCase(), correct, isCorrect: given.toUpperCase() === correct });
    }
    parts.push({ n: 1, label: "Partie 1 — Photographies", rows, answered: rows.length, total: questions.length, correct: rows.filter(r => r.isCorrect).length });
  }

  // Part 2 — offset 6, 25 questions
  {
    const p2Ans = answers.p2 ?? {};
    const questions = examData.part2 ?? [];
    const rows: ReviewRow[] = [];
    for (let i = 0; i < questions.length; i++) {
      const given = p2Ans[String(i)];
      if (!given) continue;
      const correct = questions[i].answer.toUpperCase();
      rows.push({ qNum: 6 + i + 1, given: given.toUpperCase(), correct, isCorrect: given.toUpperCase() === correct });
    }
    parts.push({ n: 2, label: "Partie 2 — Questions-Réponses", rows, answered: rows.length, total: questions.length, correct: rows.filter(r => r.isCorrect).length });
  }

  // Part 3 — offset 31, 3 questions per conversation
  {
    const p3Ans = answers.p3 ?? {};
    const convs = examData.part3 ?? [];
    const rows: ReviewRow[] = [];
    let qIdx = 0;
    for (let i = 0; i < convs.length; i++) {
      for (let qi = 0; qi < convs[i].questions.length; qi++) {
        const given = p3Ans[String(qIdx)];
        if (given) {
          const correct = convs[i].questions[qi].answer.toUpperCase();
          rows.push({ qNum: 31 + qIdx + 1, given: given.toUpperCase(), correct, isCorrect: given.toUpperCase() === correct });
        }
        qIdx++;
      }
    }
    parts.push({ n: 3, label: "Partie 3 — Conversations", rows, answered: rows.length, total: qIdx, correct: rows.filter(r => r.isCorrect).length });
  }

  // Part 4 — offset 70, 3 questions per talk
  {
    const p4Ans = answers.p4 ?? {};
    const talks = examData.part4 ?? [];
    const rows: ReviewRow[] = [];
    let qIdx = 0;
    for (let i = 0; i < talks.length; i++) {
      for (let qi = 0; qi < talks[i].questions.length; qi++) {
        const given = p4Ans[String(qIdx)];
        if (given) {
          const correct = talks[i].questions[qi].answer.toUpperCase();
          rows.push({ qNum: 70 + qIdx + 1, given: given.toUpperCase(), correct, isCorrect: given.toUpperCase() === correct });
        }
        qIdx++;
      }
    }
    parts.push({ n: 4, label: "Partie 4 — Monologues", rows, answered: rows.length, total: qIdx, correct: rows.filter(r => r.isCorrect).length });
  }

  // Part 5 — offset 100, 30 questions
  {
    const p5Ans = answers.p5 ?? {};
    const questions = examData.part5 ?? [];
    const rows: ReviewRow[] = [];
    for (let i = 0; i < questions.length; i++) {
      const given = p5Ans[String(i)];
      if (!given) continue;
      const correct = questions[i].answer.toUpperCase();
      rows.push({ qNum: 100 + i + 1, given: given.toUpperCase(), correct, isCorrect: given.toUpperCase() === correct });
    }
    parts.push({ n: 5, label: "Partie 5 — Phrases Incomplètes", rows, answered: rows.length, total: questions.length, correct: rows.filter(r => r.isCorrect).length });
  }

  // Part 6 — offset 130, 4 questions per passage
  {
    const p6Ans = answers.p6 ?? {};
    const passages = examData.part6 ?? [];
    const rows: ReviewRow[] = [];
    let qIdx = 0;
    for (let i = 0; i < passages.length; i++) {
      for (let qi = 0; qi < passages[i].questions.length; qi++) {
        const given = p6Ans[String(qIdx)];
        if (given) {
          const correct = passages[i].questions[qi].answer.toUpperCase();
          rows.push({ qNum: 130 + qIdx + 1, given: given.toUpperCase(), correct, isCorrect: given.toUpperCase() === correct });
        }
        qIdx++;
      }
    }
    parts.push({ n: 6, label: "Partie 6 — Textes Incomplets", rows, answered: rows.length, total: qIdx, correct: rows.filter(r => r.isCorrect).length });
  }

  // Part 7 — offset 146, variable questions per passage
  {
    const p7Ans = answers.p7 ?? {};
    const passages = examData.part7 ?? [];
    const rows: ReviewRow[] = [];
    let qIdx = 0;
    for (let i = 0; i < passages.length; i++) {
      for (let qi = 0; qi < passages[i].questions.length; qi++) {
        const given = p7Ans[String(qIdx)];
        if (given) {
          const correct = passages[i].questions[qi].answer.toUpperCase();
          rows.push({ qNum: 146 + qIdx + 1, given: given.toUpperCase(), correct, isCorrect: given.toUpperCase() === correct });
        }
        qIdx++;
      }
    }
    parts.push({ n: 7, label: "Partie 7 — Compréhension Écrite", rows, answered: rows.length, total: qIdx, correct: rows.filter(r => r.isCorrect).length });
  }

  return parts;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  const e = exam as MockExam & { exam_data?: ExamData };
  const isCompleted = e.status === "completed";
  const isAbandoned = e.status === "abandoned";
  const hasAnswers = (isCompleted || isAbandoned) && e.answers && e.exam_data;

  const partReviews: PartReview[] = hasAnswers
    ? buildReviewRows(
        e.answers as Record<string, Record<string, string>>,
        e.exam_data as ExamData
      )
    : [];

  return (
    <div className="px-4 md:px-6 py-8 md:py-10 max-w-3xl mx-auto space-y-6">
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
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bilan de l&apos;examen
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Passé le {formatDate(e.created_at)}
          </p>
        </div>
        {!isCompleted && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-400 rounded-full">
            Examen non terminé
          </span>
        )}
      </div>

      {/* Score summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 md:px-8 py-8 md:py-10 flex flex-col items-center text-center gap-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Score total
        </p>
        <p className="text-6xl font-bold text-[#6600CC]">
          {e.score ?? "—"}
          <span className="text-2xl font-normal text-gray-300"> / 990</span>
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 text-sm text-gray-500">
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
        {isAbandoned && (
          <p className="text-xs text-gray-400 mt-1">Score basé sur les questions répondues</p>
        )}
      </div>

      {/* in_progress: no data saved */}
      {!isCompleted && !isAbandoned && (
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
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm text-gray-400">
            Cet examen a été interrompu sans sauvegarde.
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Utilise le bouton &quot;Abandonner&quot; dans l&apos;examen pour sauvegarder tes réponses.
          </p>
        </div>
      )}

      {/* Advice placeholder (completed or abandoned) */}
      {(isCompleted || isAbandoned) && (
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
      )}

      {/* Question review */}
      {hasAnswers && partReviews.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 md:px-8 py-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Revue des réponses</h2>
          {partReviews.map((part) => (
            <details key={part.n} className="mb-3 border border-gray-100 rounded-xl overflow-hidden">
              <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 select-none">
                {part.label} — {part.answered}/{part.total} réponses · {part.correct} correctes
              </summary>
              {part.rows.length === 0 ? (
                <p className="px-5 py-4 text-xs text-gray-300">Aucune réponse pour cette partie.</p>
              ) : (
                <div className="overflow-x-auto">
                <table className="w-full min-w-[280px] text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Q#</th>
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Réponse</th>
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Correcte</th>
                      <th className="px-5 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-center">Résultat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {part.rows.map((r) => (
                      <tr key={r.qNum} className={r.isCorrect ? "" : "bg-red-50/30"}>
                        <td className="px-5 py-2 text-gray-500 tabular-nums">Q{r.qNum}</td>
                        <td className={`px-5 py-2 font-semibold tabular-nums ${r.isCorrect ? "text-green-600" : "text-red-500"}`}>
                          {r.given}
                        </td>
                        <td className="px-5 py-2 text-gray-400 tabular-nums">{r.correct}</td>
                        <td className="px-5 py-2 text-center">{r.isCorrect ? "✓" : "✗"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </details>
          ))}
        </section>
      )}
    </div>
  );
}
