"use client";

import { useState, useEffect, useCallback } from "react";
import ExamHeader from "@/components/exam/ExamHeader";
import Part1Intro from "@/components/exam/Part1Intro";
import Part1Question from "@/components/exam/Part1Question";

// ─── Config ───────────────────────────────────────────────────────────────────

const LISTENING_SECONDS = 45 * 60; // 45 minutes
const PART1_TOTAL = 6;

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "intro" | "question" | "done";

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function ExamShell() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(LISTENING_SECONDS);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // ── Global countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive || secondsLeft <= 0) return;
    const id = setInterval(
      () => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(id);
  }, [timerActive, secondsLeft]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    setTimerActive(true);
    setPhase("question");
    setQuestionIndex(0);
  }, []);

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
        setTimerActive(false);
        return i;
      }
      return next;
    });
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col font-sans">
      <ExamHeader secondsLeft={secondsLeft} timerActive={timerActive} />

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <div
            className="bg-white rounded-2xl border border-gray-100"
            style={{
              boxShadow:
                "0px 2px 8px 0px rgba(0,0,0,0.08)",
            }}
          >
            {phase === "intro" && <Part1Intro onStart={handleStart} />}

            {phase === "question" && (
              // key forces a full remount on each new question —
              // this resets all internal timers and state cleanly
              <Part1Question
                key={questionIndex}
                questionIndex={questionIndex}
                totalQuestions={PART1_TOTAL}
                selectedAnswer={answers[questionIndex] ?? null}
                onSelect={handleSelect}
                onAutoAdvance={handleAdvance}
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
                    {Object.keys(answers).length > 1 ? "s" : ""} sur{" "}
                    {PART1_TOTAL} question
                    {PART1_TOTAL > 1 ? "s" : ""}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  La partie 2 sera disponible prochainement.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
