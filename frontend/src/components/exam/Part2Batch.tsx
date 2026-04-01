"use client";

import { useState, useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const AUDIO_DURATION_MS = 9_000; // simulated fallback when no audio URLs
const GRACE_PERIOD_S = 5;
const LETTERS = ["A", "B", "C"] as const;
const AUDIO_ICON_FLICKER_MS = 850;
// Audio sequence per question: question prompt → option A → B → C
const AUDIO_SEQUENCE = ["question", "A", "B", "C"] as const;
type SeqKey = (typeof AUDIO_SEQUENCE)[number];
// Pause inserted between question enunciation and first option
const QA_PAUSE_MS = 1_000;
const INTER_OPTION_PAUSE_MS = 800;

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
  /** Audio URLs per question in the batch */
  questionAudios?: QuestionAudio[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAudioUrl(qa: QuestionAudio, key: SeqKey): string | undefined {
  if (key === "question") return qa.questionAudioUrl;
  return qa.optionAudioUrls?.[key as "A" | "B" | "C"];
}

// ─── Part2Batch ───────────────────────────────────────────────────────────────

export default function Part2Batch({
  batchIndex: _batchIndex,
  batchSize,
  startQuestionNumber,
  totalQuestions,
  answers,
  onSelect,
  onBatchComplete,
  questionAudios,
}: Part2BatchProps) {
  const [activeLocal, setActiveLocal] = useState(0);
  const [questionPhase, setQuestionPhase] = useState<"playing" | "grace" | "done">("playing");
  const [graceLeft, setGraceLeft] = useState(GRACE_PERIOD_S);
  const [seqIdx, setSeqIdx] = useState(0);

  // Stable refs — always point to latest values without being in effect dep arrays.
  const onBatchCompleteRef = useRef(onBatchComplete);
  useEffect(() => { onBatchCompleteRef.current = onBatchComplete; }, [onBatchComplete]);

  // Captured each render; read inside the "done" effect via ref to avoid
  // that effect re-firing just because isLastQuestion changed.
  const isLastQuestionRef = useRef(false);
  isLastQuestionRef.current = activeLocal === batchSize - 1;

  // ─── Audio + playing phase — runs when activeLocal changes ───────────────
  //
  // Creates fresh Audio elements for each question (no shared element, no
  // src-switching race → no AbortError). The playFrom chain inserts a 1-second
  // pause after the question audio before the first option starts.

  useEffect(() => {
    setQuestionPhase("playing");
    setGraceLeft(GRACE_PERIOD_S);
    setSeqIdx(0);

    const qa = questionAudios?.[activeLocal];
    const hasAudio = !!qa?.questionAudioUrl || !!qa?.optionAudioUrls;

    // No audio: simulate with a fixed timer then enter grace.
    if (!hasAudio) {
      const id = setTimeout(() => {
        setGraceLeft(GRACE_PERIOD_S);
        setQuestionPhase("grace");
      }, AUDIO_DURATION_MS);
      return () => clearTimeout(id);
    }

    // Build Audio elements up front so preload="auto" starts buffering immediately.
    let cancelled = false;
    const els: Partial<Record<SeqKey, HTMLAudioElement>> = {};
    for (const key of AUDIO_SEQUENCE) {
      const url = qa ? getAudioUrl(qa, key) : undefined;
      if (url) {
        const el = new Audio(url);
        el.preload = "auto";
        els[key] = el;
      }
    }

    const pendingTimers: ReturnType<typeof setTimeout>[] = [];

    function enterGrace() {
      if (cancelled) return;
      setGraceLeft(GRACE_PERIOD_S);
      setQuestionPhase("grace");
    }

    function playFrom(idx: number) {
      if (cancelled || idx >= AUDIO_SEQUENCE.length) {
        if (!cancelled) enterGrace();
        return;
      }

      const key = AUDIO_SEQUENCE[idx];
      const el = els[key];

      // Pause after question (1s) and between options A→B, B→C (800ms).
      const delayMs = idx === 1 ? QA_PAUSE_MS : idx >= 2 ? INTER_OPTION_PAUSE_MS : 0;

      const doStart = () => {
        if (cancelled) return;
        setSeqIdx(idx);

        if (!el) {
          // Missing URL for this step — skip it.
          playFrom(idx + 1);
          return;
        }

        el.onended = () => playFrom(idx + 1);
        const doPlay = () => {
          if (!cancelled) el.play().catch(console.error);
        };
        if (el.readyState >= 3) {
          doPlay();
        } else {
          el.addEventListener("canplay", doPlay, { once: true });
        }
      };

      if (delayMs > 0) {
        const tid = setTimeout(doStart, delayMs);
        pendingTimers.push(tid);
      } else {
        doStart();
      }
    }

    playFrom(0);

    return () => {
      cancelled = true;
      for (const tid of pendingTimers) clearTimeout(tid);
      for (const el of Object.values(els)) {
        if (el) {
          el.onended = null;
          el.pause();
          el.src = "";
        }
      }
    };
  }, [activeLocal]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Grace countdown ─────────────────────────────────────────────────────

  useEffect(() => {
    if (questionPhase !== "grace") return;
    let remaining = GRACE_PERIOD_S;
    const id = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(id);
        setGraceLeft(0);
        setQuestionPhase("done");
      } else {
        setGraceLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [questionPhase]);

  // ─── Advance or complete ──────────────────────────────────────────────────
  //
  // IMPORTANT: isLastQuestion is intentionally NOT in the dep array.
  // Using a ref instead prevents this effect from firing prematurely when
  // activeLocal advances from batchSize-2 → batchSize-1 while questionPhase
  // is still "done" (stale from the previous question), which would skip
  // the last question entirely.

  useEffect(() => {
    if (questionPhase !== "done") return;
    if (isLastQuestionRef.current) {
      onBatchCompleteRef.current();
    } else {
      setActiveLocal((l) => l + 1);
    }
  }, [questionPhase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Render ───────────────────────────────────────────────────────────────

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
            rowState === "playing" || rowState === "grace" ? "playing"
            : rowState === "done" ? "done"
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
                    <span className="font-semibold tabular-nums">{graceLeft}</span>
                    &thinsp;s
                  </p>
                )}
                {isActive && questionPhase === "playing" && (
                  <p className="text-xs text-gray-400 animate-pulse">
                    {seqIdx === 0 ? "Question…" : `Énoncé ${seqIdx} / 3`}
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
