"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Part2Intro from "@/components/exam/Part2Intro";
import Part2Batch from "@/components/exam/Part2Batch";
import type { ExamP2Question } from "@/types/exam-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type P2QuestionData = ExamP2Question;

// ─── Config ───────────────────────────────────────────────────────────────────
const BATCH_SIZE = 5;

// ─── Shell ────────────────────────────────────────────────────────────────────

interface Part2ShellProps {
  /** Called when user clicks "Commencer la partie 2" — use to resume timer */
  onStart?: () => void;
  /** Called when all questions are answered */
  onComplete?: (answers: Record<number, string>) => void;
  onAnswersChange?: (answers: Record<number, string>) => void;
  /** Controls copy in Part2Intro ("Le minuteur reprend…" vs default) */
  inExam?: boolean;
  questions: P2QuestionData[];
  /** When inExam, adds an exam-wide numbering offset (1-based display) */
  questionNumberOffset?: number;
  /** When inExam, display total questions across the whole exam (e.g. 200) */
  examTotalQuestions?: number;
}

export default function Part2Shell({
  onStart,
  onComplete,
  onAnswersChange,
  inExam = false,
  questions: questionsData,
  questionNumberOffset = 0,
  examTotalQuestions,
}: Part2ShellProps) {
  const PART2_TOTAL = questionsData.length;
  const [phase, setPhase] = useState<"intro" | "questions" | "done">("intro");
  // First global question index of the current batch (0-based)
  const [batchStart, setBatchStart] = useState(0);
  // All answers keyed by global 0-based question index
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const batchIndex = Math.floor(batchStart / BATCH_SIZE);
  const batchSize = Math.min(BATCH_SIZE, PART2_TOTAL - batchStart);

  const onAnswersChangeRef = useRef(onAnswersChange);
  useEffect(() => { onAnswersChangeRef.current = onAnswersChange; }, [onAnswersChange]);

  const handleStart = useCallback(() => {
    onStart?.();
    setPhase("questions");
  }, [onStart]);

  const handleSelect = useCallback(
    (localIndex: number, letter: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [batchStart + localIndex]: letter };
        onAnswersChangeRef.current?.(next);
        return next;
      });
    },
    [batchStart]
  );

  const handleBatchComplete = useCallback(() => {
    const nextStart = batchStart + batchSize;
    if (nextStart >= PART2_TOTAL) {
      setPhase("done");
      onComplete?.(answers);
    } else {
      setBatchStart(nextStart);
    }
  }, [batchStart, batchSize, onComplete, answers]);

  // Slice the question audio data for the current batch
  const batchQuestions = questionsData.slice(batchStart, batchStart + batchSize);
  const questionAudios = batchQuestions.map((q) => ({
    questionAudioUrl: q.question_audio_url,
    optionAudioUrls: q.option_audio_urls,
  }));

  return (
    <>
      {phase === "intro" && (
        <Part2Intro onStart={handleStart} inExam={inExam} />
      )}

      {phase === "questions" && (
        // key forces full remount on each new batch → resets all timers
        <Part2Batch
          key={batchIndex}
          batchIndex={batchIndex}
          batchSize={batchSize}
          startQuestionNumber={
            (inExam ? questionNumberOffset : 0) + (batchStart + 1)
          }
          totalQuestions={inExam ? (examTotalQuestions ?? 200) : PART2_TOTAL}
          answers={
            Object.fromEntries(
              Object.entries(answers)
                .filter(([k]) => {
                  const g = Number(k);
                  return g >= batchStart && g < batchStart + batchSize;
                })
                .map(([k, v]) => [Number(k) - batchStart, v])
            )
          }
          onSelect={handleSelect}
          onBatchComplete={handleBatchComplete}
          questionAudios={questionAudios}
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
              Partie 2 terminée
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {Object.keys(answers).length} réponse
              {Object.keys(answers).length > 1 ? "s" : ""} sur {PART2_TOTAL}{" "}
              question
              {PART2_TOTAL > 1 ? "s" : ""}
            </p>
          </div>
          {!inExam && (
            <p className="text-xs text-gray-400">
              Exercice terminé. Revenez quand vous le souhaitez.
            </p>
          )}
        </div>
      )}
    </>
  );
}
