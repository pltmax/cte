"use client";

import { useState, useCallback } from "react";
import Part5Intro from "@/components/exam/Part5Intro";
import Part5Batch, { type P5Question } from "@/components/exam/Part5Batch";
import rawData from "@mockdata/TOEIC/reading_part5/part5_content.json";

// ─── Data ─────────────────────────────────────────────────────────────────────

const questions: P5Question[] = (
  rawData as { questions: P5Question[] }
).questions;
const PART5_TOTAL = questions.length;
const BATCH_SIZE = 10;
const TOTAL_BATCHES = Math.ceil(PART5_TOTAL / BATCH_SIZE);

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "intro" | "questions" | "done";

// ─── Shell ────────────────────────────────────────────────────────────────────

interface Part5ShellProps {
  onStart?: () => void;
  onComplete?: () => void;
  inExam?: boolean;
}

export default function Part5Shell({
  onStart,
  onComplete,
  inExam = false,
}: Part5ShellProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [batchIndex, setBatchIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // keyed by global 0-based index

  const batchStart = batchIndex * BATCH_SIZE;
  const batchQuestions = questions.slice(batchStart, batchStart + BATCH_SIZE);
  const isLast = batchIndex === TOTAL_BATCHES - 1;

  const handleStart = useCallback(() => {
    onStart?.();
    setPhase("questions");
  }, [onStart]);

  const handleSelect = useCallback(
    (localIndex: number, letter: string) => {
      setAnswers((prev) => ({ ...prev, [batchStart + localIndex]: letter }));
    },
    [batchStart]
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      setPhase("done");
      onComplete?.();
    } else {
      setBatchIndex((i) => i + 1);
    }
  }, [isLast, onComplete]);

  return (
    <>
      {phase === "intro" && (
        <Part5Intro onStart={handleStart} inExam={inExam} />
      )}

      {phase === "questions" && (
        <Part5Batch
          key={batchIndex}
          questions={batchQuestions}
          batchIndex={batchIndex}
          totalBatches={TOTAL_BATCHES}
          startQuestionNumber={batchStart + 1}
          totalQuestions={PART5_TOTAL}
          answers={Object.fromEntries(
            Object.entries(answers)
              .filter(([k]) => {
                const g = Number(k);
                return g >= batchStart && g < batchStart + BATCH_SIZE;
              })
              .map(([k, v]) => [Number(k) - batchStart, v])
          )}
          onSelect={handleSelect}
          onNext={handleNext}
          isLast={isLast}
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
              Partie 5 terminée
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {Object.keys(answers).length} réponse
              {Object.keys(answers).length > 1 ? "s" : ""} sur {PART5_TOTAL}{" "}
              question
              {PART5_TOTAL > 1 ? "s" : ""}
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
