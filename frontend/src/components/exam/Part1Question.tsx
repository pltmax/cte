"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const AUDIO_DURATION_MS = 8_000; // simulated audio length
const GRACE_PERIOD_S = 5; // countdown after audio before auto-advance
const LETTERS = ["A", "B", "C", "D"] as const;

// ─── Sound icon ───────────────────────────────────────────────────────────────

function SoundIcon({ isPlaying }: { isPlaying: boolean }) {
  const [tick, setTick] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      setTick(false);
      return;
    }
    const id = setInterval(() => setTick((t) => !t), 600);
    return () => clearInterval(id);
  }, [isPlaying]);

  const color = !isPlaying
    ? "#D1D5DB"
    : tick
    ? "#6600CC"
    : "#D1D5DB";

  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 24 24"
      fill="none"
      aria-label={isPlaying ? "Audio en cours" : "Audio terminé"}
    >
      {/* Speaker body */}
      <path
        d="M3 9v6h4l5 5V4L7 9H3z"
        fill={color}
        style={{ transition: "fill 0.3s ease" }}
      />
      {/* Inner wave */}
      <path
        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
        fill={color}
        style={{ transition: "fill 0.3s ease" }}
      />
      {/* Outer wave — only when playing */}
      <path
        d="M19 6.46C21.39 8.03 23 10.31 23 12.96s-1.61 4.93-4 6.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        style={{
          transition: "stroke 0.3s ease, opacity 0.3s ease",
          opacity: isPlaying ? 1 : 0,
        }}
      />
    </svg>
  );
}

// ─── Part1Question ────────────────────────────────────────────────────────────

interface Part1QuestionProps {
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  onAutoAdvance: () => void;
}

export default function Part1Question({
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelect,
  onAutoAdvance,
}: Part1QuestionProps) {
  const [audioPhase, setAudioPhase] = useState<"playing" | "grace" | "done">(
    "playing"
  );
  const [graceLeft, setGraceLeft] = useState(GRACE_PERIOD_S);

  // Stable ref for onAutoAdvance to avoid re-triggering effects
  const advanceRef = useCallback(onAutoAdvance, [onAutoAdvance]); // eslint-disable-line

  // Phase 1: simulated audio → transitions to grace when done
  useEffect(() => {
    setAudioPhase("playing");
    setGraceLeft(GRACE_PERIOD_S);
    const id = setTimeout(() => setAudioPhase("grace"), AUDIO_DURATION_MS);
    return () => clearTimeout(id);
  }, []); // runs once per mount (key resets between questions)

  // Phase 2: grace period countdown → auto-advance
  useEffect(() => {
    if (audioPhase !== "grace") return;
    const id = setInterval(() => {
      setGraceLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setAudioPhase("done");
          advanceRef();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [audioPhase, advanceRef]);

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
          Partie 1 — Photographies
        </span>
        <span className="text-xs text-gray-400 tabular-nums">
          {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6600CC] rounded-full transition-all duration-500"
          style={{
            width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
          }}
        />
      </div>

      {/* Image placeholder */}
      <div className="w-full aspect-video bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-2">
        <svg
          className="w-12 h-12 text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs text-gray-300">
          Photo {questionIndex + 1}
        </span>
      </div>

      {/* Sound indicator */}
      <div className="flex flex-col items-center gap-2">
        <SoundIcon isPlaying={audioPhase === "playing"} />
        <div className="h-5 flex items-center">
          {audioPhase === "playing" && (
            <p className="text-xs text-gray-400 animate-pulse">
              Écoute en cours…
            </p>
          )}
          {audioPhase === "grace" && (
            <p className="text-xs text-gray-500">
              Question suivante dans{" "}
              <span className="font-semibold tabular-nums">{graceLeft}</span>
              &thinsp;s
            </p>
          )}
        </div>
      </div>

      {/* Answer options — A B C D */}
      <div className="grid grid-cols-4 gap-3">
        {LETTERS.map((letter) => {
          const selected = selectedAnswer === letter;
          return (
            <button
              key={letter}
              onClick={() => onSelect(letter)}
              className={`flex flex-col items-center justify-center gap-1.5 py-5 rounded-xl border-2 transition-all duration-150 ${
                selected
                  ? "border-[#6600CC] bg-[#f3ebff]"
                  : "border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff]"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-150 ${
                  selected
                    ? "border-[#6600CC] bg-[#6600CC] text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {letter}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
