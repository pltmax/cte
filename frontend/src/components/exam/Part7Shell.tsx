"use client";

import { useState, useCallback, useEffect } from "react";
import Part7Intro from "@/components/exam/Part7Intro";
import Part7Passage, { type P7Passage } from "@/components/exam/Part7Passage";
import rawData from "@mockdata/TOEIC/reading_part7/part7_content.json";

// ─── Data ─────────────────────────────────────────────────────────────────────

const passages: P7Passage[] = (rawData as { passages: P7Passage[] }).passages;
const TOTAL_PASSAGES = passages.length;

// Precompute 1-based start question number for each passage
const QUESTION_STARTS: number[] = [];
let _cum = 1;
for (const p of passages) {
  QUESTION_STARTS.push(_cum);
  _cum += p.questions.length;
}
const PART7_TOTAL = _cum - 1;

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "intro" | "questions" | "done";

// ─── Shell ────────────────────────────────────────────────────────────────────

interface Part7ShellProps {
  onStart?: () => void;
  onComplete?: () => void;
  inExam?: boolean;
}

export default function Part7Shell({
  onStart,
  onComplete,
  inExam = false,
}: Part7ShellProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [passageIndex, setPassageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // keyed by global 0-based index

  const isLast = passageIndex === TOTAL_PASSAGES - 1;

  const scrollToTop = useCallback(() => {
    const main = document.querySelector("main");
    if (main) (main as HTMLElement).scrollTo({ top: 0, behavior: "auto" });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (phase !== "questions") return;
    requestAnimationFrame(scrollToTop);
  }, [phase, passageIndex, scrollToTop]);

  const handleStart = useCallback(() => {
    onStart?.();
    setPhase("questions");
  }, [onStart]);

  const handleSelect = useCallback(
    (localIndex: number, letter: string) => {
      const globalIndex = QUESTION_STARTS[passageIndex] - 1 + localIndex;
      setAnswers((prev) => ({ ...prev, [globalIndex]: letter }));
    },
    [passageIndex]
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      setPhase("done");
      onComplete?.();
    } else {
      setPassageIndex((i) => i + 1);
    }
  }, [isLast, onComplete]);

  // Derive local answers for the current passage
  const passageStart = QUESTION_STARTS[passageIndex] - 1;
  const passageQCount = passages[passageIndex].questions.length;
  const localAnswers = Object.fromEntries(
    Object.entries(answers)
      .filter(([k]) => {
        const g = Number(k);
        return g >= passageStart && g < passageStart + passageQCount;
      })
      .map(([k, v]) => [Number(k) - passageStart, v])
  );

  return (
    <>
      {phase === "intro" && (
        <Part7Intro onStart={handleStart} inExam={inExam} />
      )}

      {phase === "questions" && (
        <Part7Passage
          key={passageIndex}
          passage={passages[passageIndex]}
          passageIndex={passageIndex}
          totalPassages={TOTAL_PASSAGES}
          startQuestionNumber={QUESTION_STARTS[passageIndex]}
          totalQuestions={PART7_TOTAL}
          answers={localAnswers}
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
              Partie 7 terminée
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {Object.keys(answers).length} réponse
              {Object.keys(answers).length > 1 ? "s" : ""} sur {PART7_TOTAL}{" "}
              question
              {PART7_TOTAL > 1 ? "s" : ""}
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
