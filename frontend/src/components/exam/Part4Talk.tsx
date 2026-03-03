"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const AUDIO_DURATION_MS = 15_000; // simulated fallback
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
  /** GCS audio URL — populated by scripts/gcs/upload_to_gcs.py */
  audio_url?: string;
  graphic_doctype?: string | null;
  graphic_title?: string | null;
  graphic?: Record<string, string> | null;
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

// ─── Graphic container ────────────────────────────────────────────────────────

// ── Directory (Store Directory, Office Extension List) ────────────────────────
function DirectoryBody({ entries }: { entries: [string, string][] }) {
  return (
    <div className="divide-y divide-[#f0e6ff]">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center gap-3 px-5 py-2.5">
          <span className="text-xs font-bold text-[#6600CC] w-28 shrink-0 uppercase tracking-wide">
            {key}
          </span>
          <span className="text-sm text-gray-700">{value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Weather chart (Weather Forecast) ─────────────────────────────────────────
const WEATHER_COLORS: Record<string, string> = {
  sunny: "bg-amber-50 border-amber-200 text-amber-700",
  rainy: "bg-blue-50 border-blue-200 text-blue-700",
  windy: "bg-cyan-50 border-cyan-200 text-cyan-700",
  snowy: "bg-slate-50 border-slate-200 text-slate-700",
  cloudy: "bg-gray-50 border-gray-200 text-gray-600",
};

function weatherColor(value: string) {
  const lower = value.toLowerCase();
  for (const [k, cls] of Object.entries(WEATHER_COLORS)) {
    if (lower.includes(k)) return cls;
  }
  return "bg-purple-50 border-purple-200 text-purple-700";
}

function WeatherBody({ entries }: { entries: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 p-4">
      {entries.map(([day, conditions]) => (
        <div
          key={day}
          className={`rounded-lg border px-4 py-3 flex flex-col gap-1 ${weatherColor(conditions)}`}
        >
          <span className="text-xs font-bold uppercase tracking-widest opacity-70">
            {day}
          </span>
          <span className="text-sm font-medium">{conditions}</span>
        </div>
      ))}
    </div>
  );
}

// ── Schedule (Conference Schedule, Train Schedule) ────────────────────────────
function ScheduleBody({ entries }: { entries: [string, string][] }) {
  return (
    <div className="px-5 py-3 flex flex-col gap-0">
      {entries.map(([time, event], i) => (
        <div key={time} className="flex gap-4 items-stretch">
          {/* time column */}
          <div className="flex flex-col items-center w-24 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6600CC] mt-1 shrink-0" />
            {i < entries.length - 1 && (
              <div className="w-px flex-1 bg-[#e9d9ff] my-1" />
            )}
          </div>
          <div className="pb-4">
            <span className="text-xs font-bold text-[#6600CC] block leading-none mt-0.5">
              {time}
            </span>
            <span className="text-sm text-gray-700 mt-1 block">{event}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Bar chart (Sales, Precipitation, Temperatures, etc.) ─────────────────────
function extractNumber(value: string): number {
  const match = value.match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

function ChartBody({ entries }: { entries: [string, string][] }) {
  const nums = entries.map(([, v]) => extractNumber(v));
  const maxAbs = Math.max(...nums.map(Math.abs), 1);

  return (
    <div className="px-5 py-3 flex flex-col gap-2.5">
      {entries.map(([label, value], i) => {
        const num = nums[i];
        const pct = Math.abs(num / maxAbs) * 100;
        const isNeg = num < 0;
        return (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 w-24 shrink-0 text-right">
              {label}
            </span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isNeg ? "bg-red-400" : "bg-[#6600CC]"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span
              className={`text-xs font-bold w-16 shrink-0 ${
                isNeg ? "text-red-500" : "text-[#6600CC]"
              }`}
            >
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Timeline (Project Milestones) ─────────────────────────────────────────────
const TIMELINE_STATUS: Record<
  string,
  { dot: string; badge: string; text: string }
> = {
  completed: {
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700",
    text: "Completed",
  },
  "in progress": {
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700",
    text: "In Progress",
  },
  "not started": {
    dot: "bg-gray-300",
    badge: "bg-gray-100 text-gray-500",
    text: "Not Started",
  },
};

function TimelineBody({ entries }: { entries: [string, string][] }) {
  return (
    <div className="px-5 py-3 flex flex-col gap-0">
      {entries.map(([phase, status], i) => {
        const key = status.toLowerCase();
        const style =
          TIMELINE_STATUS[key] ?? {
            dot: "bg-gray-300",
            badge: "bg-gray-100 text-gray-500",
            text: status,
          };
        return (
          <div key={phase} className="flex gap-4 items-stretch">
            <div className="flex flex-col items-center w-4 shrink-0">
              <div
                className={`w-3 h-3 rounded-full mt-1 shrink-0 ${style.dot}`}
              />
              {i < entries.length - 1 && (
                <div className="w-px flex-1 bg-gray-200 my-1" />
              )}
            </div>
            <div className="pb-4 flex items-start justify-between flex-1 gap-3">
              <span className="text-sm font-medium text-gray-700">{phase}</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${style.badge}`}
              >
                {style.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Floor plan (Museum Floor Plan) ────────────────────────────────────────────
function FloorPlanBody({ entries }: { entries: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      {entries.map(([room, name]) => (
        <div
          key={room}
          className="rounded-lg border border-[#e9d9ff] bg-white px-4 py-3 flex flex-col gap-1"
        >
          <span className="text-xs font-bold text-[#6600CC] uppercase tracking-wide">
            {room}
          </span>
          <span className="text-sm text-gray-700">{name}</span>
        </div>
      ))}
    </div>
  );
}

// ── Table (Subscription Plans, pricing grids) ─────────────────────────────────
function TableBody({ entries }: { entries: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      {entries.map(([tier, details]) => (
        <div
          key={tier}
          className="rounded-lg border border-[#e9d9ff] bg-white px-4 py-3 flex flex-col gap-1"
        >
          <span className="text-xs font-bold text-[#6600CC] uppercase tracking-wide">
            {tier}
          </span>
          <span className="text-sm text-gray-700">{details}</span>
        </div>
      ))}
    </div>
  );
}

// ── Generic fallback ──────────────────────────────────────────────────────────
function DefaultBody({ entries }: { entries: [string, string][] }) {
  return (
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
  );
}

// ── Dispatcher ────────────────────────────────────────────────────────────────
function GraphicBody({
  doctype,
  entries,
}: {
  doctype: string;
  entries: [string, string][];
}) {
  switch (doctype) {
    case "directory":
      return <DirectoryBody entries={entries} />;
    case "weather_chart":
      return <WeatherBody entries={entries} />;
    case "schedule":
      return <ScheduleBody entries={entries} />;
    case "chart":
      return <ChartBody entries={entries} />;
    case "timeline":
      return <TimelineBody entries={entries} />;
    case "floor_plan":
      return <FloorPlanBody entries={entries} />;
    case "table":
      return <TableBody entries={entries} />;
    default:
      return <DefaultBody entries={entries} />;
  }
}

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
      <GraphicBody doctype={doctype} entries={entries} />
    </div>
  );
}

// ─── Part4Talk ────────────────────────────────────────────────────────────────

interface Part4TalkProps {
  talk: TalkData;
  talkIndex: number;
  totalTalks: number;
  startQuestionNumber: number;
  totalQuestions: number;
  answers: Record<number, string>;
  onSelect: (localIndex: number, letter: string) => void;
  onTalkComplete: () => void;
}

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
  const audioRef = useRef<HTMLAudioElement>(null);

  const hasAudio = !!talk.audio_url;
  const onTalkCompleteRef = useCallback(onTalkComplete, [onTalkComplete]); // eslint-disable-line
  const isPlaying = audioPhase === "playing";

  // Phase 1: start audio (real or simulated)
  useEffect(() => {
    setAudioPhase("playing");
    setGraceLeft(GRACE_PERIOD_S);
    if (hasAudio && audioRef.current) {
      const el = audioRef.current;
      el.src = talk.audio_url!;
      el.play().catch((err: unknown) => {
        // AbortError is expected when cleanup pauses the element (React Strict Mode
        // double-invocation, or component unmounting mid-play). Suppress it.
        if (err instanceof Error && err.name === "AbortError") return;
        console.error(err);
      });
      return () => {
        el.pause();
      };
    }
    const id = setTimeout(() => setAudioPhase("grace"), AUDIO_DURATION_MS);
    return () => clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — once per mount; key resets between talks

  const handleAudioEnded = useCallback(() => {
    setAudioPhase("grace");
  }, []);

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

  // Phase 3: fire parent callback
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

      {/* Graphic — only when talk has a graphic_doctype */}
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
              <p className="text-sm font-medium text-gray-800">
                <span className="text-[#6600CC] font-bold mr-2">{qNum}.</span>
                {question.text}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {LETTERS.map((letter, i) => {
                  const isSelected = selected === letter;
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

      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />
    </div>
  );
}
