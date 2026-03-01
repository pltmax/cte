"use client";

import { useState, useCallback, useEffect } from "react";
import Part6Intro from "@/components/exam/Part6Intro";
import Part6Passage, { type PassageData } from "@/components/exam/Part6Passage";
import rawData from "@mockdata/TOEIC/reading_part6/part6_content.json";

// ─── Data ─────────────────────────────────────────────────────────────────────

const allPassages: PassageData[] = (
  rawData as { passages: PassageData[] }
).passages;
const QUESTIONS_PER_PASSAGE = 4;

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "intro" | "questions" | "done";

// ─── Shell ────────────────────────────────────────────────────────────────────

interface Part6ShellProps {
  onStart?: () => void;
  onComplete?: (answers: Record<number, string>) => void;
  inExam?: boolean;
  /** Exam-specific passage subset; falls back to full JSON when absent */
  passages?: PassageData[];
  /** When inExam, adds an exam-wide numbering offset (1-based display) */
  questionNumberOffset?: number;
  /** When inExam, display total questions across the whole exam (e.g. 200) */
  examTotalQuestions?: number;
}

export default function Part6Shell({
  onStart,
  onComplete,
  inExam = false,
  passages: passagesProp,
  questionNumberOffset = 0,
  examTotalQuestions,
}: Part6ShellProps) {
  const passages = passagesProp ?? allPassages;
  const TOTAL_PASSAGES = passages.length;
  const PART6_TOTAL = TOTAL_PASSAGES * QUESTIONS_PER_PASSAGE;

  const [phase, setPhase] = useState<Phase>("intro");
  const [passageIndex, setPassageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // keyed by global 0-based index

  const passageStart = passageIndex * QUESTIONS_PER_PASSAGE;
  const isLast = passageIndex === TOTAL_PASSAGES - 1;

  // Scroll to top on passage change (same pattern as Part5Shell)
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
      setAnswers((prev) => ({ ...prev, [passageStart + localIndex]: letter }));
    },
    [passageStart]
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      setPhase("done");
      onComplete?.(answers);
    } else {
      setPassageIndex((i) => i + 1);
    }
  }, [isLast, onComplete, answers]);

  return (
    <>
      {phase === "intro" && (
        <Part6Intro onStart={handleStart} inExam={inExam} />
      )}

      {phase === "questions" && (
        <Part6Passage
          key={passageIndex}
          passage={passages[passageIndex]}
          passageIndex={passageIndex}
          totalPassages={TOTAL_PASSAGES}
          startQuestionNumber={
            (inExam ? questionNumberOffset : 0) + (passageStart + 1)
          }
          totalQuestions={inExam ? (examTotalQuestions ?? 200) : PART6_TOTAL}
          answers={Object.fromEntries(
            Object.entries(answers)
              .filter(([k]) => {
                const g = Number(k);
                return (
                  g >= passageStart &&
                  g < passageStart + QUESTIONS_PER_PASSAGE
                );
              })
              .map(([k, v]) => [Number(k) - passageStart, v])
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
              Partie 6 terminée
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {Object.keys(answers).length} réponse
              {Object.keys(answers).length > 1 ? "s" : ""} sur {PART6_TOTAL}{" "}
              question
              {PART6_TOTAL > 1 ? "s" : ""}
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
