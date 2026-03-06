"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

type AudioMap = Record<"A" | "B" | "C" | "D", HTMLAudioElement>;

// ─── Constants ────────────────────────────────────────────────────────────────

const LETTERS = ["A", "B", "C", "D"] as const;
const AUDIO_ICON_FLICKER_MS = 1_000;
const WAIT_BEFORE_AUDIO_S = 3;
const GRACE_PERIOD_S = 5;

// ─── Sound icon ───────────────────────────────────────────────────────────────

function SoundIcon({ isPlaying }: { isPlaying: boolean }) {
  const [tick, setTick] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      setTick(false);
      return;
    }
    const id = setInterval(() => setTick((t) => !t), AUDIO_ICON_FLICKER_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  const color = !isPlaying ? "#D1D5DB" : tick ? "#6600CC" : "#D1D5DB";

  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 24 24"
      fill="none"
      aria-label={isPlaying ? "Audio en cours" : "Audio terminé"}
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
//
// Self-contained 3-phase audio machine.  Part1Shell mounts a fresh instance
// for each question (via key={questionIndex}), so all internal state resets
// automatically between questions.

interface Part1QuestionProps {
  questionIndex: number;
  totalQuestions: number;
  displayQuestionNumber?: number;
  displayTotalQuestions?: number;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  imageUrl?: string;
  audioUrls?: { A: string; B: string; C: string; D: string };
  preloadedAudios?: AudioMap;
  onGraceStart: () => void;
  onAutoAdvance: () => void;
}

export default function Part1Question({
  questionIndex,
  totalQuestions,
  displayQuestionNumber,
  displayTotalQuestions,
  selectedAnswer,
  onSelect,
  imageUrl,
  audioUrls,
  preloadedAudios,
  onGraceStart,
  onAutoAdvance,
}: Part1QuestionProps) {
  // ─── Internal 3-phase state ──────────────────────────────────────────────
  //
  //  "waiting" → image shown, 3-s countdown before audio starts
  //  "playing" → audio chain A→B→C→D is running, SoundIcon flickers
  //  "grace"   → audio finished, 5-s countdown before auto-advance

  const [phase, setPhase] = useState<"waiting" | "playing" | "grace">("waiting");
  const [countdown, setCountdown] = useState(WAIT_BEFORE_AUDIO_S);
  const [seqIdx, setSeqIdx] = useState(0);

  // Stable refs so async callbacks always call the latest prop version.
  const onGraceStartRef = useRef(onGraceStart);
  const onAutoAdvanceRef = useRef(onAutoAdvance);
  useEffect(() => { onGraceStartRef.current = onGraceStart; }, [onGraceStart]);
  useEffect(() => { onAutoAdvanceRef.current = onAutoAdvance; }, [onAutoAdvance]);

  // ─── Phase: waiting ──────────────────────────────────────────────────────
  // 3 → 2 → 1 → 0, then switch to "playing".

  useEffect(() => {
    if (phase !== "waiting") return;

    let remaining = WAIT_BEFORE_AUDIO_S;
    const id = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(id);
        setCountdown(0);
        setPhase("playing");
      } else {
        setCountdown(remaining);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [phase]);

  // ─── Phase: playing ──────────────────────────────────────────────────────
  // Resolve audio elements, play A→B→C→D via onended chain, then enter grace.

  useEffect(() => {
    if (phase !== "playing") return;

    // Resolve audio elements from preloaded cache or create fresh ones.
    let audioEls: HTMLAudioElement[] | null = null;
    let owned = false; // true → we created them, must clean up src on exit

    if (preloadedAudios) {
      audioEls = LETTERS.map((l) => preloadedAudios[l]);
    } else if (audioUrls) {
      owned = true;
      audioEls = LETTERS.map((l) => {
        const el = new Audio(audioUrls[l]);
        el.preload = "auto";
        return el;
      });
    }

    // No audio available: skip straight to grace.
    if (!audioEls) {
      setCountdown(GRACE_PERIOD_S);
      setPhase("grace");
      onGraceStartRef.current();
      return;
    }

    let cancelled = false;
    const els = audioEls;

    function enterGrace() {
      if (cancelled) return;
      setCountdown(GRACE_PERIOD_S);
      setPhase("grace");
      onGraceStartRef.current();
    }

    function playFrom(idx: number) {
      if (cancelled || idx >= LETTERS.length) {
        if (!cancelled) enterGrace();
        return;
      }

      const el = els[idx];
      setSeqIdx(idx);
      el.onended = () => playFrom(idx + 1);

      const doPlay = () => {
        if (!cancelled) el.play().catch(console.error);
      };

      if (el.readyState >= 3) {
        doPlay();
      } else {
        el.addEventListener("canplay", doPlay, { once: true });
      }
    }

    playFrom(0);

    return () => {
      cancelled = true;
      for (const el of els) {
        el.onended = null;
        el.pause();
      }
      if (owned) {
        for (const el of els) el.src = "";
      }
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Phase: grace ─────────────────────────────────────────────────────────
  // 5 → 4 → 3 → 2 → 1 → 0, then call onAutoAdvance.

  useEffect(() => {
    if (phase !== "grace") return;

    let remaining = GRACE_PERIOD_S;
    const id = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(id);
        setCountdown(0);
        onAutoAdvanceRef.current();
      } else {
        setCountdown(remaining);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [phase]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const hasAudio = !!(preloadedAudios || audioUrls);

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
          Partie 1 — Photographies
        </span>
        <span className="text-xs text-gray-400 tabular-nums">
          {displayQuestionNumber ?? questionIndex + 1} /{" "}
          {displayTotalQuestions ?? totalQuestions}
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

      {/* Image — real or placeholder */}
      {imageUrl ? (
        <div className="w-full flex justify-center mb-5">
            <div className="relative w-80 h-80 aspect-video rounded-xl overflow-hidden border border-gray-200">
            <Image
                src={imageUrl}
                alt={`Photo ${questionIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
            />
            </div>
        </div>
      ) : (
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
      )}

      {/* Sound indicator */}
      <div className="flex flex-col items-center gap-2">
        <SoundIcon isPlaying={phase === "playing"} />

        {hasAudio && phase === "playing" && (
          <p className="text-xs text-gray-400">
            Énoncé {seqIdx + 1} / {LETTERS.length}
          </p>
        )}

        <div className="h-5 flex items-center">
          {phase === "waiting" && (
            <p className="text-xs text-gray-400">
              Audio dans{" "}
              <span className="font-semibold tabular-nums">{countdown}</span>
              &thinsp;s…
            </p>
          )}
          {phase === "playing" && (
            <p className="text-xs text-gray-400 animate-pulse">
              Écoute en cours…
            </p>
          )}
          {phase === "grace" && (
            <p className="text-xs text-gray-500">
              Question suivante dans{" "}
              <span className="font-semibold tabular-nums">{countdown}</span>
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
