"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const AUDIO_DURATION_MS = 15_000;
const GRACE_PERIOD_S = 10;
const LETTERS = ["A", "B", "C", "D"] as const;
const FLICKER_MS = 850;

// ─── Data types ───────────────────────────────────────────────────────────────

export interface TalkQuestion {
  text: string;
  options: string[]; // "(A) …", "(B) …", "(C) …", "(D) …"
  answer: string;
}

export interface TalkData {
  title: string;
  text: string;
  questions: TalkQuestion[];
  graphic_doctype?: string;
  graphic_title?: string;
  graphic?: Record<string, string>;
}

// ─── Doctype display labels ───────────────────────────────────────────────────

const DOCTYPE_LABELS: Record<string, string> = {
  directory: "Répertoire",
  schedule: "Programme",
  chart: "Graphique",
  timeline: "Chronologie",
  floor_plan: "Plan",
  table: "Tableau",
  weather_chart: "Météo",
};

// ─── Sound icon ───────────────────────────────────────────────────────────────

function SoundIcon({ isPlaying }: { isPlaying: boolean }) {
  const [tick, setTick] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      setTick(false);
      return;
    }
    const id = setInterval(() => setTick((t) => !t), FLICKER_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  const color = isPlaying ? (tick ? "#6600CC" : "#D1D5DB") : "#D1D5DB";

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label={isPlaying ? "Audio en cours" : "Audio terminé"}
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

// ─── Graphic container (rendered only when graphic_doctype exists) ─────────────

function GraphicContainer({
  doctype,
  title,
  graphic,
}: {
  doctype: string;
  title: string;
  graphic: Record<string, string>;
}) {
  const label = DOCTYPE_LABELS[doctype] ?? doctype;
  const entries = Object.entries(graphic);

  return (
    <div className="rounded-xl border border-[#e9d9ff] bg-[#faf6ff] overflow-hidden">
      {/* Container header */}
      <div className="px-5 py-3 flex items-center gap-3 border-b border-[#e9d9ff]">
        <div className="w-7 h-7 rounded-md bg-[#6600CC]/10 flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4 text-[#6600CC]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M3 14h18M10 3v18"
            />
          </svg>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
            {label}
          </span>
          <span className="text-xs text-gray-400">—</span>
          <span className="text-sm font-semibold text-gray-700">{title}</span>
        </div>
      </div>

      {/* Key-value rows */}
      <div className="divide-y divide-[#f0e6ff]">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-baseline gap-3 px-5 py-2.5">
            <span className="text-xs font-semibold text-[#6600CC] w-32 shrink-0">
              {key}
            </span>
            <span className="text-sm text-gray-700">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Part4TalkProps {
  talk: TalkData;
  talkIndex: number;
  totalTalks: number;
  startQuestionNumber: number;
  totalQuestions: number;
  answers: Record<number, string>; // keyed by local index 0, 1, 2
  onSelect: (localIndex: number, letter: string) => void;
  onTalkComplete: () => void;
}

// ─── Part4Talk ────────────────────────────────────────────────────────────────

export default function Part4Talk({
  talk,
  talkIndex,
  totalTalks,
  startQuestionNumber,
  totalQuestions,
  answers,
  onSelect,
  onTalkComplete,
}: Part4TalkProps) {
  const [audioPhase, setAudioPhase] = useState<"playing" | "grace" | "done">(
    "playing"
  );
  const [graceLeft, setGraceLeft] = useState(GRACE_PERIOD_S);

  const onTalkCompleteRef = useCallback(onTalkComplete, [onTalkComplete]); // eslint-disable-line

  const isPlaying = audioPhase === "playing";

  // Phase 1: audio
  useEffect(() => {
    setAudioPhase("playing");
    setGraceLeft(GRACE_PERIOD_S);
    const id = setTimeout(() => setAudioPhase("grace"), AUDIO_DURATION_MS);
    return () => clearTimeout(id);
  }, []); // once per mount; key resets between talks

  // Phase 2: grace countdown
  useEffect(() => {
    if (audioPhase !== "grace") return;
    const id = setInterval(() => {
      setGraceLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setAudioPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [audioPhase]);

  // Phase 3: fire parent callback once audioPhase settles to "done"
  useEffect(() => {
    if (audioPhase !== "done") return;
    onTalkCompleteRef();
  }, [audioPhase, onTalkCompleteRef]);

  const progressPct = ((talkIndex + 1) / totalTalks) * 100;

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
          Partie 4 — Monologues
        </span>
        <span className="text-xs text-gray-400 tabular-nums">
          Doc. {talkIndex + 1} / {totalTalks} &nbsp;·&nbsp; Q
          {startQuestionNumber}–{startQuestionNumber + 2} / {totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6600CC] rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Graphic container — only when talk has a graphic_doctype */}
      {talk.graphic_doctype && talk.graphic_title && talk.graphic && (
        <GraphicContainer
          doctype={talk.graphic_doctype}
          title={talk.graphic_title}
          graphic={talk.graphic}
        />
      )}

      {/* Audio status row */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
        <SoundIcon isPlaying={isPlaying} />
        <div className="flex-1">
          {audioPhase === "playing" && (
            <p className="text-sm text-gray-500 animate-pulse">
              Document en cours d&apos;écoute…
            </p>
          )}
          {audioPhase === "grace" && (
            <p className="text-sm text-gray-600">
              Répondez aux questions —{" "}
              <span className="font-semibold tabular-nums text-[#6600CC]">
                {graceLeft}
              </span>
              &thinsp;s restantes
            </p>
          )}
          {audioPhase === "done" && (
            <p className="text-sm text-gray-400">Document terminé</p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-4">
        {talk.questions.map((question, localIdx) => {
          const qNum = startQuestionNumber + localIdx;
          const selected = answers[localIdx] ?? null;

          return (
            <div
              key={localIdx}
              className="rounded-xl border border-gray-100 p-5 flex flex-col gap-3"
            >
              {/* Question text */}
              <p className="text-sm font-medium text-gray-800">
                <span className="text-[#6600CC] font-bold mr-2">{qNum}.</span>
                {question.text}
              </p>

              {/* Answer grid — 2 columns */}
              <div className="grid grid-cols-2 gap-2">
                {LETTERS.map((letter, i) => {
                  const isSelected = selected === letter;
                  // Strip "(A) " prefix from option text
                  const optText = question.options[i]?.replace(
                    /^\([A-D]\)\s*/,
                    ""
                  );
                  return (
                    <button
                      key={letter}
                      onClick={() => onSelect(localIdx, letter)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-left text-sm transition-all duration-150 ${
                        isSelected
                          ? "border-[#6600CC] bg-[#f3ebff] text-[#6600CC]"
                          : "border-gray-200 text-gray-600 hover:border-[#c4a0f0] hover:bg-[#faf6ff]"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-150 ${
                          isSelected
                            ? "border-[#6600CC] bg-[#6600CC] text-white"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="leading-snug">{optText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
