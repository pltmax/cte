"use client";

import { useState, useEffect, useCallback } from "react";
import ExamHeader from "@/components/exam/ExamHeader";
import Part1Shell from "@/components/exam/Part1Shell";
import Part2Shell from "@/components/exam/Part2Shell";
import Part3Shell from "@/components/exam/Part3Shell";
import Part4Shell from "@/components/exam/Part4Shell";
import Part5Shell from "@/components/exam/Part5Shell";

// ─── Config ───────────────────────────────────────────────────────────────────

const LISTENING_SECONDS = 45 * 60; // 45 minutes
const READING_SECONDS = 75 * 60; // 75 minutes

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "p1" | "p2" | "p3" | "p4" | "p5" | "done";

const LISTENING_PHASES: Phase[] = ["p1", "p2", "p3", "p4"];

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function ExamShell() {
  const [phase, setPhase] = useState<Phase>("p1");
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(LISTENING_SECONDS);

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
  const handlePart1Complete = useCallback(() => {
    setTimerActive(false);
    setPhase("p2");
  }, []);

  // ── Part 2 ────────────────────────────────────────────────────────────────
  const handlePart2Start = useCallback(() => setTimerActive(true), []);
  const handlePart2Complete = useCallback(() => {
    setTimerActive(false);
    setPhase("p3");
  }, []);

  // ── Part 3 ────────────────────────────────────────────────────────────────
  const handlePart3Start = useCallback(() => setTimerActive(true), []);
  const handlePart3Complete = useCallback(() => {
    setTimerActive(false);
    setPhase("p4");
  }, []);

  // ── Part 4 ────────────────────────────────────────────────────────────────
  const handlePart4Start = useCallback(() => setTimerActive(true), []);
  const handlePart4Complete = useCallback(() => {
    // Transition to reading section: reset timer to 75 minutes
    setTimerActive(false);
    setSecondsLeft(READING_SECONDS);
    setPhase("p5");
  }, []);

  // ── Part 5 ────────────────────────────────────────────────────────────────
  const handlePart5Start = useCallback(() => setTimerActive(true), []);
  const handlePart5Complete = useCallback(() => {
    setTimerActive(false);
    setPhase("done");
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col font-sans">
      <ExamHeader
        secondsLeft={secondsLeft}
        timerActive={timerActive}
        timerLabel={timerLabel}
      />

      <main className="flex-1 flex items-center justify-center px-6 py-15">
        <div className="w-full max-w-4xl">
          <div
            className="bg-white rounded-2xl border border-gray-100"
            style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
          >
            {phase === "p1" && (
              <Part1Shell
                onStart={handlePart1Start}
                onComplete={handlePart1Complete}
                inExam
              />
            )}
            {phase === "p2" && (
              <Part2Shell
                onStart={handlePart2Start}
                onComplete={handlePart2Complete}
                inExam
              />
            )}
            {phase === "p3" && (
              <Part3Shell
                onStart={handlePart3Start}
                onComplete={handlePart3Complete}
                inExam
              />
            )}
            {phase === "p4" && (
              <Part4Shell
                onStart={handlePart4Start}
                onComplete={handlePart4Complete}
                inExam
              />
            )}
            {phase === "p5" && (
              <Part5Shell
                onStart={handlePart5Start}
                onComplete={handlePart5Complete}
                inExam
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
                    Parties 1 à 5 complétées
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
