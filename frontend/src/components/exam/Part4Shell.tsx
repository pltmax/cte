"use client";

import { useState, useCallback } from "react";
import Part4Intro from "@/components/exam/Part4Intro";
import Part4Talk, { type TalkData } from "@/components/exam/Part4Talk";
import rawData from "@mockdata/TOEIC/listening_part4/part4_transcript.json";

// ─── Data ─────────────────────────────────────────────────────────────────────

const talks: TalkData[] = (rawData as { talks: TalkData[] }).talks;
const TOTAL_TALKS = talks.length;
const QUESTIONS_PER_TALK = 3;
const PART4_TOTAL = TOTAL_TALKS * QUESTIONS_PER_TALK;

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "intro" | "questions" | "done";

// ─── Shell ────────────────────────────────────────────────────────────────────

interface Part4ShellProps {
  onStart?: () => void;
  onComplete?: () => void;
  inExam?: boolean;
}

export default function Part4Shell({
  onStart,
  onComplete,
  inExam = false,
}: Part4ShellProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [talkIndex, setTalkIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // keyed by global 0-based index

  const talkStart = talkIndex * QUESTIONS_PER_TALK;

  const handleStart = useCallback(() => {
    onStart?.();
    setPhase("questions");
  }, [onStart]);

  const handleSelect = useCallback(
    (localIndex: number, letter: string) => {
      setAnswers((prev) => ({ ...prev, [talkStart + localIndex]: letter }));
    },
    [talkStart]
  );

  const handleTalkComplete = useCallback(() => {
    const next = talkIndex + 1;
    if (next >= TOTAL_TALKS) {
      setPhase("done");
      onComplete?.();
    } else {
      setTalkIndex(next);
    }
  }, [talkIndex, onComplete]);

  return (
    <>
      {phase === "intro" && (
        <Part4Intro onStart={handleStart} inExam={inExam} />
      )}

      {phase === "questions" && (
        // key forces full remount on each new talk → resets all timers
        <Part4Talk
          key={talkIndex}
          talk={talks[talkIndex]}
          talkIndex={talkIndex}
          totalTalks={TOTAL_TALKS}
          startQuestionNumber={talkStart + 1}
          totalQuestions={PART4_TOTAL}
          answers={Object.fromEntries(
            Object.entries(answers)
              .filter(([k]) => {
                const g = Number(k);
                return g >= talkStart && g < talkStart + QUESTIONS_PER_TALK;
              })
              .map(([k, v]) => [Number(k) - talkStart, v])
          )}
          onSelect={handleSelect}
          onTalkComplete={handleTalkComplete}
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
              Partie 4 terminée
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {Object.keys(answers).length} réponse
              {Object.keys(answers).length > 1 ? "s" : ""} sur {PART4_TOTAL}{" "}
              question
              {PART4_TOTAL > 1 ? "s" : ""}
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
