"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const AUDIO_DURATION_MS = 9_000; // simulated fallback
const GRACE_PERIOD_S = 3;
const LETTERS = ["A", "B", "C"] as const;
const AUDIO_ICON_FLICKER_MS = 850;
// Audio sequence per question: question prompt → option A → B → C
const AUDIO_SEQUENCE = ["question", "A", "B", "C"] as const;
type SeqKey = (typeof AUDIO_SEQUENCE)[number];

// ─── Mini sound icon ──────────────────────────────────────────────────────────

function MiniSoundIcon({ state }: { state: "playing" | "done" | "upcoming" }) {
  const [tick, setTick] = useState(false);

  useEffect(() => {
    if (state !== "playing") {
      setTick(false);
      return;
    }
    const id = setInterval(() => setTick((t) => !t), AUDIO_ICON_FLICKER_MS);
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

interface QuestionAudio {
  questionAudioUrl?: string;
  optionAudioUrls?: { A: string; B: string; C: string };
}

interface Part2BatchProps {
  batchIndex: number;
  batchSize: number; // 1–5
  startQuestionNumber: number;
  totalQuestions: number;
  answers: Record<number, string>;
  onSelect: (localIndex: number, letter: string) => void;
  onBatchComplete: () => void;
  /** Audio URLs per question in the batch (populated after GCS upload) */
  questionAudios?: QuestionAudio[];
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
  questionAudios,
}: Part2BatchProps) {
  const [activeLocal, setActiveLocal] = useState(0);
  const [questionPhase, setQuestionPhase] = useState<
    "playing" | "grace" | "done"
  >("playing");
  const [graceLeft, setGraceLeft] = useState(GRACE_PERIOD_S);
  const [seqIdx, setSeqIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isLastQuestion = activeLocal === batchSize - 1;
  const onBatchCompleteRef = useCallback(onBatchComplete, [onBatchComplete]); // eslint-disable-line

  const currentAudio = questionAudios?.[activeLocal];
  const hasAudio =
    !!currentAudio?.questionAudioUrl || !!currentAudio?.optionAudioUrls;

  function getAudioUrl(qa: QuestionAudio, key: SeqKey): string | undefined {
    if (key === "question") return qa.questionAudioUrl;
    return qa.optionAudioUrls?.[key as "A" | "B" | "C"];
  }

  // Phase 1: audio (real or simulated) — resets when activeLocal changes
  useEffect(() => {
    setQuestionPhase("playing");
    setGraceLeft(GRACE_PERIOD_S);
    setSeqIdx(0);
    if (hasAudio) return; // real audio drives transition
    const id = setTimeout(() => setQuestionPhase("grace"), AUDIO_DURATION_MS);
    return () => clearTimeout(id);
  }, [activeLocal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Real audio: play the current sequence step
  useEffect(() => {
    if (!hasAudio || !audioRef.current || !currentAudio) return;
    const key = AUDIO_SEQUENCE[seqIdx];
    const url = getAudioUrl(currentAudio, key);
    if (!url) {
      // Skip missing URL — treat as if ended
      handleAudioEnded();
      return;
    }
    audioRef.current.src = url;
    audioRef.current.play().catch(console.error);
  }, [seqIdx, activeLocal]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAudioEnded = useCallback(() => {
    setSeqIdx((prev) => {
      const next = prev + 1;
      if (next < AUDIO_SEQUENCE.length) return next;
      setQuestionPhase("grace");
      return prev;
    });
  }, []);

  // Phase 2: grace countdown
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
              ? "playing"
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

              {/* Grace countdown / playing indicator under active row */}
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

      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />
    </div>
  );
}
