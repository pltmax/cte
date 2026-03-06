"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ExamHeader from "@/components/exam/ExamHeader";
import Part1Shell from "@/components/exam/Part1Shell";
import Part2Shell from "@/components/exam/Part2Shell";
import Part3Shell from "@/components/exam/Part3Shell";
import Part4Shell from "@/components/exam/Part4Shell";
import Part5Shell from "@/components/exam/Part5Shell";
import Part6Shell from "@/components/exam/Part6Shell";
import Part7Shell from "@/components/exam/Part7Shell";
import { createClient } from "@/lib/supabase/client";
import { scoreExam, type AllExamAnswers, type PartAnswers } from "@/lib/toeic-scoring";
import { loadPriorityStore, updateAfterExam, savePriorityStore } from "@/lib/exam/priority";
import type { ExamData } from "@/types/exam-data";
import type { ExamSelectionMeta } from "@/types/exam-pools";

// ─── Config ───────────────────────────────────────────────────────────────────

const LISTENING_SECONDS = 45 * 60; // 45 minutes
const READING_SECONDS = 75 * 60; // 75 minutes
const EXAM_TOTAL_QUESTIONS = 200;

// 1-based global numbering offsets per part (add to each part's local 1-based numbering)
const QUESTION_OFFSETS = {
  p1: 0,   // 1–6
  p2: 6,   // 7–31
  p3: 31,  // 32–70
  p4: 70,  // 71–100
  p5: 100, // 101–130
  p6: 130, // 131–146
  p7: 146, // 147–200
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "p7" | "done";

const LISTENING_PHASES: Phase[] = ["p1", "p2", "p3", "p4"];

// ─── Shell ────────────────────────────────────────────────────────────────────

interface ExamShellProps {
  /** The exam UUID — used to mark the exam as completed in the DB. */
  examId?: string;
  /** Pre-built exam dataset (from exam JSON). When absent, each Shell uses its full JSON. */
  examData?: ExamData;
  /** When true, shows admin-only skip controls (not visible to regular users). */
  isAdmin?: boolean;
}

export default function ExamShell({ examId = "", examData, isAdmin = false }: ExamShellProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("p1");
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(LISTENING_SECONDS);

  // localStorage-hydrated exam data (overrides DB-fetched examData when present)
  const [localExamData, setLocalExamData] = useState<ExamData | null>(null);

  // Accumulate per-part answers without triggering re-renders (ref, not state).
  const allAnswersRef = useRef<AllExamAnswers>({
    p1: {}, p2: {}, p3: {}, p4: {}, p5: {}, p6: {}, p7: {},
  });

  // ── Hydrate from localStorage on mount ────────────────────────────────────
  useEffect(() => {
    if (!examId) return;
    const raw = localStorage.getItem(`cts_exam_data_${examId}`);
    if (raw) {
      try {
        setLocalExamData(JSON.parse(raw) as ExamData);
      } catch {
        // corrupted — fall back to DB data
      }
    }
  }, [examId]);

  // localStorage wins for new (dynamically built) exams; DB data is the fallback.
  const effectiveExamData = localExamData ?? examData;

  const timerLabel = LISTENING_PHASES.includes(phase) ? "Écoute" : "Lecture";

  // ── Global countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive || secondsLeft <= 0) return;
    const id = setInterval(
      () => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(id);
  }, [timerActive, secondsLeft]);

  // ── Part 1 ────────────────────────────────────────────────────────────────
  const handlePart1Start = useCallback(() => setTimerActive(true), []);
  const handlePart1Complete = useCallback((answers: PartAnswers = {}) => {
    allAnswersRef.current.p1 = answers;
    setTimerActive(false);
    setPhase("p2");
  }, []);

  // ── Part 2 ────────────────────────────────────────────────────────────────
  const handlePart2Start = useCallback(() => setTimerActive(true), []);
  const handlePart2Complete = useCallback((answers: PartAnswers = {}) => {
    allAnswersRef.current.p2 = answers;
    setTimerActive(false);
    setPhase("p3");
  }, []);

  // ── Part 3 ────────────────────────────────────────────────────────────────
  const handlePart3Start = useCallback(() => setTimerActive(true), []);
  const handlePart3Complete = useCallback((answers: PartAnswers = {}) => {
    allAnswersRef.current.p3 = answers;
    setTimerActive(false);
    setPhase("p4");
  }, []);

  // ── Part 4 ────────────────────────────────────────────────────────────────
  const handlePart4Start = useCallback(() => setTimerActive(true), []);
  const handlePart4Complete = useCallback((answers: PartAnswers = {}) => {
    allAnswersRef.current.p4 = answers;
    // Transition to reading section: reset timer to 75 minutes
    setTimerActive(false);
    setSecondsLeft(READING_SECONDS);
    setPhase("p5");
  }, []);

  // ── Part 5 ────────────────────────────────────────────────────────────────
  const handlePart5Start = useCallback(() => setTimerActive(true), []);
  const handlePart5Complete = useCallback((answers: PartAnswers = {}) => {
    allAnswersRef.current.p5 = answers;
    setTimerActive(false);
    setPhase("p6");
  }, []);

  // ── Part 6 ────────────────────────────────────────────────────────────────
  const handlePart6Start = useCallback(() => setTimerActive(true), []);
  const handlePart6Complete = useCallback((answers: PartAnswers = {}) => {
    allAnswersRef.current.p6 = answers;
    setTimerActive(false);
    setPhase("p7");
  }, []);

  // ── Part 7 ────────────────────────────────────────────────────────────────
  const handlePart7Start = useCallback(() => setTimerActive(true), []);
  const handlePart7Complete = useCallback(async (answers: PartAnswers = {}) => {
    allAnswersRef.current.p7 = answers;
    setTimerActive(false);
    setPhase("done");

    if (examId) {
      const supabase = createClient();
      const all = allAnswersRef.current;

      // ── Update priority store when this was a dynamically-built exam ──────
      if (localExamData) {
        const rawMeta = localStorage.getItem(`cts_exam_meta_${examId}`);
        if (rawMeta) {
          try {
            const meta = JSON.parse(rawMeta) as ExamSelectionMeta;
            const results = computeUnitResults(all, localExamData, meta);
            const store = loadPriorityStore();
            const updatedStore = updateAfterExam(store, results);
            savePriorityStore(updatedStore);
          } catch {
            // non-fatal — priority store update best-effort
          }
        }
        localStorage.removeItem(`cts_exam_data_${examId}`);
        localStorage.removeItem(`cts_exam_meta_${examId}`);
      }

      if (effectiveExamData) {
        // Score the exam and persist answers + scores.
        const { listeningScore, readingScore, totalScore } = scoreExam(all, effectiveExamData);
        await supabase.rpc("complete_exam", {
          exam_id: examId,
          p_listening_score: listeningScore,
          p_reading_score: readingScore,
          p_score: totalScore,
          p_answers: all as unknown as Record<string, unknown>,
        });
      } else {
        // No correct-answer data available; store without scoring.
        await supabase.rpc("complete_exam", { exam_id: examId });
      }

      router.push(`/mockexams/${examId}/bilan`);
    }
  }, [examId, localExamData, effectiveExamData, router]);

  // ── Admin: skip current part ──────────────────────────────────────────────
  const handleSkipPart = useCallback(() => {
    if (phase === "p1") handlePart1Complete();
    else if (phase === "p2") handlePart2Complete();
    else if (phase === "p3") handlePart3Complete();
    else if (phase === "p4") handlePart4Complete();
    else if (phase === "p5") handlePart5Complete();
    else if (phase === "p6") handlePart6Complete();
    else if (phase === "p7") handlePart7Complete();
  }, [phase, handlePart1Complete, handlePart2Complete, handlePart3Complete, handlePart4Complete, handlePart5Complete, handlePart6Complete, handlePart7Complete]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col font-sans">
      <ExamHeader
        secondsLeft={secondsLeft}
        timerActive={timerActive}
        timerLabel={timerLabel}
      />

      <main className="flex-1 flex items-center justify-center px-6 py-5">
        <div className="w-full max-w-4xl">
          {/* Admin-only: skip the current part entirely */}
          {isAdmin && phase !== "done" && (
            <div className="flex justify-end mb-2">
              <button
                onClick={handleSkipPart}
                className="text-xs text-gray-400 hover:text-[#6600CC] border border-gray-200 hover:border-[#6600CC] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              >
                ⏭ Passer la partie
              </button>
            </div>
          )}
          <div
            className="bg-white rounded-2xl border border-gray-100"
            style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
          >
            {phase === "p1" && (
              <Part1Shell
                onStart={handlePart1Start}
                onComplete={handlePart1Complete}
                inExam
                questions={effectiveExamData?.part1}
                isAdmin={isAdmin}
                questionNumberOffset={QUESTION_OFFSETS.p1}
                examTotalQuestions={EXAM_TOTAL_QUESTIONS}
              />
            )}
            {phase === "p2" && (
              <Part2Shell
                onStart={handlePart2Start}
                onComplete={handlePart2Complete}
                inExam
                questions={effectiveExamData?.part2}
                questionNumberOffset={QUESTION_OFFSETS.p2}
                examTotalQuestions={EXAM_TOTAL_QUESTIONS}
              />
            )}
            {phase === "p3" && (
              <Part3Shell
                onStart={handlePart3Start}
                onComplete={handlePart3Complete}
                inExam
                conversations={effectiveExamData?.part3}
                questionNumberOffset={QUESTION_OFFSETS.p3}
                examTotalQuestions={EXAM_TOTAL_QUESTIONS}
              />
            )}
            {phase === "p4" && (
              <Part4Shell
                onStart={handlePart4Start}
                onComplete={handlePart4Complete}
                inExam
                talks={effectiveExamData?.part4}
                questionNumberOffset={QUESTION_OFFSETS.p4}
                examTotalQuestions={EXAM_TOTAL_QUESTIONS}
              />
            )}
            {phase === "p5" && (
              <Part5Shell
                onStart={handlePart5Start}
                onComplete={handlePart5Complete}
                inExam
                questions={effectiveExamData?.part5}
                questionNumberOffset={QUESTION_OFFSETS.p5}
                examTotalQuestions={EXAM_TOTAL_QUESTIONS}
              />
            )}

            {phase === "p6" && (
              <Part6Shell
                onStart={handlePart6Start}
                onComplete={handlePart6Complete}
                inExam
                passages={effectiveExamData?.part6}
                questionNumberOffset={QUESTION_OFFSETS.p6}
                examTotalQuestions={EXAM_TOTAL_QUESTIONS}
              />
            )}

            {phase === "p7" && (
              <Part7Shell
                onStart={handlePart7Start}
                onComplete={handlePart7Complete}
                inExam
                passages={effectiveExamData?.part7}
                questionNumberOffset={QUESTION_OFFSETS.p7}
                examTotalQuestions={EXAM_TOTAL_QUESTIONS}
              />
            )}

            {phase === "done" && (
              <div className="px-10 py-14 flex flex-col items-center text-center gap-5">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Examen terminé
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Parties 1 à 7 complétées
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Les parties suivantes seront disponibles prochainement.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Per-unit correctness computation ─────────────────────────────────────────

function computeUnitResults(
  all: AllExamAnswers,
  data: ExamData,
  meta: ExamSelectionMeta
): Record<string, "correct" | "partial" | "incorrect"> {
  const results: Record<string, "correct" | "partial" | "incorrect"> = {};

  // Individual parts (P1, P2, P5) — one pool item = one question
  const individualParts = [
    { ids: meta.p1Ids, answers: all.p1, items: data.part1 ?? [] },
    { ids: meta.p2Ids, answers: all.p2, items: data.part2 ?? [] },
    { ids: meta.p5Ids, answers: all.p5, items: data.part5 ?? [] },
  ] as const;

  for (const { ids, answers, items } of individualParts) {
    ids.forEach((id, i) => {
      const correct = (items[i] as { answer: string } | undefined)?.answer;
      const given = answers[i]?.toUpperCase();
      results[id] = given && correct && given === correct.toUpperCase()
        ? "correct"
        : "incorrect";
    });
  }

  // P3 — 3 questions per conversation
  meta.p3Ids.forEach((id, i) => {
    const conv = (data.part3 ?? [])[i];
    if (!conv) return;
    const base = i * 3;
    const correctCount = conv.questions.filter(
      (q, qi) => all.p3[base + qi]?.toUpperCase() === q.answer.toUpperCase()
    ).length;
    results[id] = correctCount === conv.questions.length
      ? "correct"
      : correctCount === 0
      ? "incorrect"
      : "partial";
  });

  // P4 — 3 questions per talk
  meta.p4Ids.forEach((id, i) => {
    const talk = (data.part4 ?? [])[i];
    if (!talk) return;
    const base = i * 3;
    const correctCount = talk.questions.filter(
      (q, qi) => all.p4[base + qi]?.toUpperCase() === q.answer.toUpperCase()
    ).length;
    results[id] = correctCount === talk.questions.length
      ? "correct"
      : correctCount === 0
      ? "incorrect"
      : "partial";
  });

  // P6 — 4 questions per passage
  meta.p6Ids.forEach((id, i) => {
    const passage = (data.part6 ?? [])[i];
    if (!passage) return;
    const base = i * 4;
    const correctCount = passage.questions.filter(
      (q, qi) => all.p6[base + qi]?.toUpperCase() === q.answer.toUpperCase()
    ).length;
    results[id] = correctCount === passage.questions.length
      ? "correct"
      : correctCount === 0
      ? "incorrect"
      : "partial";
  });

  // P7 — variable question count per passage
  let p7Offset = 0;
  meta.p7Ids.forEach((id, i) => {
    const passage = (data.part7 ?? [])[i];
    const qCount = meta.p7QuestionCounts[i] ?? 0;
    if (!passage) { p7Offset += qCount; return; }
    const correctCount = passage.questions.filter(
      (q, qi) => all.p7[p7Offset + qi]?.toUpperCase() === q.answer.toUpperCase()
    ).length;
    results[id] = correctCount === passage.questions.length
      ? "correct"
      : correctCount === 0
      ? "incorrect"
      : "partial";
    p7Offset += qCount;
  });

  return results;
}
