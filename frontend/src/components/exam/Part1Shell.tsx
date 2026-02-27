"use client";

import { useState, useCallback } from "react";
import Part1Intro from "@/components/exam/Part1Intro";
import Part1Question from "@/components/exam/Part1Question";
import rawP1 from "@mockdata/TOEIC/listening_part1/part1_transcript.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface P1QuestionData {
  image: string;
  statements: string[];
  answer: string;
  // Populated by scripts/gcs/upload_to_gcs.py after GCS upload
  image_url?: string;
  audio_urls?: { A: string; B: string; C: string; D: string };
}

// ─── Config ───────────────────────────────────────────────────────────────────

const p1Data = rawP1 as { questions: P1QuestionData[] };
const PART1_TOTAL = 6; // TOEIC Part 1 uses 6 questions

// ─── Shell ────────────────────────────────────────────────────────────────────

interface Part1ShellProps {
  /** Called when user clicks "Commencer la partie 1" — use to start timer */
  onStart?: () => void;
  /** Called when all 6 questions are done */
  onComplete?: () => void;
  /** Controls copy in Part1Intro */
  inExam?: boolean;
}

export default function Part1Shell({
  onStart,
  onComplete,
  inExam = false,
}: Part1ShellProps) {
  const [phase, setPhase] = useState<"intro" | "questions" | "done">("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleStart = useCallback(() => {
    onStart?.();
    setPhase("questions");
    setQuestionIndex(0);
  }, [onStart]);

  const handleSelect = useCallback(
    (answer: string) => {
      setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    },
    [questionIndex]
  );

  const handleAdvance = useCallback(() => {
    setQuestionIndex((i) => {
      const next = i + 1;
      if (next >= PART1_TOTAL) {
        setPhase("done");
        onComplete?.();
        return i;
      }
      return next;
    });
  }, [onComplete]);

  const currentQuestion = p1Data.questions[questionIndex];

  return (
    <>
      {phase === "intro" && (
        <Part1Intro onStart={handleStart} inExam={inExam} />
      )}

      {phase === "questions" && (
        // key forces a full remount on each new question → resets all timers
        <Part1Question
          key={questionIndex}
          questionIndex={questionIndex}
          totalQuestions={PART1_TOTAL}
          selectedAnswer={answers[questionIndex] ?? null}
          onSelect={handleSelect}
          onAutoAdvance={handleAdvance}
          imageUrl={currentQuestion?.image_url}
          audioUrls={currentQuestion?.audio_urls}
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
              Partie 1 terminée
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {Object.keys(answers).length} réponse
              {Object.keys(answers).length > 1 ? "s" : ""} sur {PART1_TOTAL}{" "}
              question
              {PART1_TOTAL > 1 ? "s" : ""}
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
