"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const AUDIO_DURATION_MS = 9_000; // simulated question + 3 answers
const GRACE_PERIOD_S = 3;
const LETTERS = ["A", "B", "C"] as const;

// ─── Mini sound icon ──────────────────────────────────────────────────────────

function MiniSoundIcon({ state }: { state: "playing" | "done" | "upcoming" }) {
  const [tick, setTick] = useState(false);

  useEffect(() => {
    if (state !== "playing") {
      setTick(false);
      return;
    }
    const id = setInterval(() => setTick((t) => !t), 600);
    return () => clearInterval(id);
  }, [state]);

  const color =
    state === "playing"
      ? tick
        ? "#6600CC"
        : "#D1D5DB"
      : state === "done"
      ? "#9CA3AF"
      : "#E5E7EB";

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-label={state === "playing" ? "Audio en cours" : "Audio"}
      className="shrink-0"
    >
      <path
        d="M3 9v6h4l5 5V4L7 9H3z"
        fill={color}
        style={{ transition: "fill 0.3s ease" }}
      />
      <path
        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
        fill={color}
        style={{ transition: "fill 0.3s ease" }}
      />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionState = "playing" | "grace" | "done" | "upcoming";

interface Part2BatchProps {
  batchIndex: number;
  batchSize: number; // 1–3
  startQuestionNumber: number; // e.g. 7 → questions 7, 8, 9
  totalQuestions: number;
  answers: Record<number, string>; // keyed by local index (0, 1, 2)
  onSelect: (localIndex: number, letter: string) => void;
  onBatchComplete: () => void;
}

// ─── Part2Batch ───────────────────────────────────────────────────────────────

export default function Part2Batch({
  batchIndex,
  batchSize,
  startQuestionNumber,
  totalQuestions,
  answers,
  onSelect,
  onBatchComplete,
}: Part2BatchProps) {
  const [activeLocal, setActiveLocal] = useState(0);
  const [questionPhase, setQuestionPhase] = useState<
    "playing" | "grace" | "done"
  >("playing");
  const [graceLeft, setGraceLeft] = useState(GRACE_PERIOD_S);

  const isLastQuestion = activeLocal === batchSize - 1;

  // Stable ref for onBatchComplete
  const onBatchCompleteRef = useCallback(onBatchComplete, [onBatchComplete]); // eslint-disable-line

  // Phase 1: audio → grace
  useEffect(() => {
    setQuestionPhase("playing");
    setGraceLeft(GRACE_PERIOD_S);
    const id = setTimeout(() => setQuestionPhase("grace"), AUDIO_DURATION_MS);
    return () => clearTimeout(id);
  }, [activeLocal]);

  // Phase 2: grace countdown → done
  useEffect(() => {
    if (questionPhase !== "grace") return;
    const id = setInterval(() => {
      setGraceLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setQuestionPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [questionPhase]);

  // Phase 3: advance or complete batch
  useEffect(() => {
    if (questionPhase !== "done") return;
    if (isLastQuestion) {
      onBatchCompleteRef();
    } else {
      setActiveLocal((l) => l + 1);
    }
  }, [questionPhase, isLastQuestion, onBatchCompleteRef]);

  // Progress (across the full exam)
  const globalEnd = startQuestionNumber + batchSize - 1;
  const progressPct = (globalEnd / totalQuestions) * 100;

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
          Partie 2 — Questions-Réponses
        </span>
        <span className="text-xs text-gray-400 tabular-nums">
          {startQuestionNumber}–{globalEnd} / {totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6600CC] rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question rows */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: batchSize }).map((_, localIdx) => {
          const questionNumber = startQuestionNumber + localIdx;
          const isActive = localIdx === activeLocal;
          const isDone = localIdx < activeLocal;
          const isUpcoming = localIdx > activeLocal;

          const rowState: QuestionState = isActive
            ? questionPhase === "done"
              ? "done"
              : questionPhase
            : isDone
            ? "done"
            : "upcoming";

          const iconState =
            rowState === "playing"
              ? "playing"
              : rowState === "grace"
              ? "playing" // keep flickering during grace
              : rowState === "done"
              ? "done"
              : "upcoming";

          const selectedAnswer = answers[localIdx] ?? null;

          return (
            <div key={localIdx}>
              <div
                className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-300 ${
                  isActive && questionPhase !== "done"
                    ? "border-[#6600CC] bg-[#faf6ff]"
                    : isDone || (isActive && questionPhase === "done")
                    ? "border-gray-100 bg-gray-50"
                    : "border-gray-100 bg-white opacity-40"
                }`}
              >
                {/* Sound icon + label */}
                <div className="flex items-center gap-2 min-w-0">
                  <MiniSoundIcon state={iconState} />
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      isActive && questionPhase !== "done"
                        ? "text-[#6600CC]"
                        : isDone || (isActive && questionPhase === "done")
                        ? "text-gray-500"
                        : "text-gray-300"
                    }`}
                  >
                    Q{questionNumber}
                  </span>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* A / B / C buttons */}
                <div className="flex gap-2">
                  {LETTERS.map((letter) => {
                    const isSelected = selectedAnswer === letter;
                    const disabled = isUpcoming;
                    return (
                      <button
                        key={letter}
                        disabled={disabled}
                        onClick={() => !disabled && onSelect(localIdx, letter)}
                        className={`w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-150 ${
                          isSelected
                            ? "border-[#6600CC] bg-[#6600CC] text-white"
                            : disabled
                            ? "border-gray-100 text-gray-200 cursor-default"
                            : "border-gray-200 text-gray-400 hover:border-[#c4a0f0] hover:text-[#6600CC]"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grace countdown — only under the active row */}
              <div className="h-5 flex items-center pl-5">
                {isActive && questionPhase === "grace" && (
                  <p className="text-xs text-gray-500">
                    Question suivante dans{" "}
                    <span className="font-semibold tabular-nums">
                      {graceLeft}
                    </span>
                    &thinsp;s
                  </p>
                )}
                {isActive && questionPhase === "playing" && (
                  <p className="text-xs text-gray-400 animate-pulse">
                    Écoute en cours…
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
