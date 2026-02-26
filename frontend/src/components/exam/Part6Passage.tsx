"use client";

import { Fragment } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const LETTERS = ["A", "B", "C", "D"] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface P6Question {
  options: string[]; // "(A) …", "(B) …", "(C) …", "(D) …"
  answer: string;
}

export interface PassageData {
  doctype: string;
  text: string;
  questions: P6Question[];
}

interface Part6PassageProps {
  passage: PassageData;
  passageIndex: number;
  totalPassages: number;
  startQuestionNumber: number;
  totalQuestions: number;
  answers: Record<number, string>; // keyed by local index 0–3
  onSelect: (localIndex: number, letter: string) => void;
  onNext: () => void;
  isLast: boolean;
}

// ─── Doctype config ───────────────────────────────────────────────────────────

const DOCTYPE_CONFIG: Record<string, { label: string; description: string }> =
  {
    memo: { label: "Mémo", description: "Mémorandum interne" },
    email: { label: "Courriel", description: "Message électronique" },
    letter: { label: "Lettre", description: "Correspondance formelle" },
    notice: { label: "Avis", description: "Avis officiel" },
    advertisement: { label: "Publicité", description: "Annonce publicitaire" },
    press_release: {
      label: "Communiqué",
      description: "Communiqué de presse",
    },
    article: { label: "Article", description: "Article professionnel" },
  };

// ─── Text parser ──────────────────────────────────────────────────────────────

type ParsedText = {
  headers: Array<{ key: string; value: string }>; // memo / email only
  titleLines: string[]; // first heading block for other doctypes
  body: string;
};

function parseText(doctype: string, raw: string): ParsedText {
  const lines = raw.split("\n");

  if (doctype === "memo" || doctype === "email") {
    const headers: Array<{ key: string; value: string }> = [];
    let bodyStart = 0;

    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^([^:\n]+):\s*(.+)/);
      if (m) {
        headers.push({ key: m[1].trim(), value: m[2].trim() });
        bodyStart = i + 1;
      } else if (lines[i].trim() === "" && headers.length > 0) {
        bodyStart = i + 1;
        break;
      } else if (headers.length > 0) {
        bodyStart = i;
        break;
      }
    }

    return { headers, titleLines: [], body: lines.slice(bodyStart).join("\n") };
  }

  // For other doctypes: the first non-empty lines before the first blank line = title
  const titleLines: string[] = [];
  let bodyStart = 0;
  let sawTitle = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "") {
      titleLines.push(lines[i]);
      sawTitle = true;
    } else if (sawTitle) {
      bodyStart = i + 1;
      break;
    }
  }

  return { headers: [], titleLines, body: lines.slice(bodyStart).join("\n") };
}

// ─── Body renderer — inserts numbered blank badges ────────────────────────────

function BodyText({ text }: { text: string }) {
  const BLANK = "_______";
  const segments = text.split(BLANK);

  return (
    <>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {/* Render segment preserving line-breaks */}
          {seg.split("\n").map((line, j, arr) => (
            <Fragment key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </Fragment>
          ))}
          {/* Numbered blank badge between segments */}
          {i < segments.length - 1 && (
            <span className="inline-flex items-center justify-center mx-1 px-2 py-0.5 bg-[#6600CC]/10 border border-[#6600CC]/30 rounded text-[#6600CC] font-bold text-xs align-middle">
              [{i + 1}]
            </span>
          )}
        </Fragment>
      ))}
    </>
  );
}

// ─── Doctype container ────────────────────────────────────────────────────────

function DocContainer({
  doctype,
  text,
}: {
  doctype: string;
  text: string;
}) {
  const cfg = DOCTYPE_CONFIG[doctype] ?? { label: doctype, description: "" };
  const parsed = parseText(doctype, text);

  return (
    <div className="rounded-xl border border-[#e9d9ff] bg-[#faf6ff] overflow-hidden text-sm">
      {/* Doctype header bar */}
      <div className="px-5 py-3 border-b border-[#e9d9ff] flex items-center gap-2">
        <span className="text-xs font-bold text-[#6600CC] uppercase tracking-widest">
          {cfg.label}
        </span>
        <span className="text-xs text-gray-300">—</span>
        <span className="text-xs text-gray-500">{cfg.description}</span>
      </div>

      {/* Structured header (memo / email) */}
      {parsed.headers.length > 0 && (
        <div className="px-5 py-3 border-b border-[#f0e6ff] bg-[#fdf9ff] flex flex-col gap-1">
          {parsed.headers.map(({ key, value }) => (
            <div key={key} className="flex gap-2">
              <span className="font-semibold text-gray-500 min-w-[5.5rem] shrink-0">
                {key} :
              </span>
              <span className="text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Title block (notice / advertisement / press_release / article / letter) */}
      {parsed.titleLines.length > 0 && (
        <div className="px-5 pt-4 pb-1">
          {parsed.titleLines.map((line, i) => (
            <p key={i} className="font-bold text-gray-800">
              {line}
            </p>
          ))}
        </div>
      )}

      {/* Body with numbered blanks */}
      <div className="px-5 py-4 text-gray-700 leading-relaxed">
        <BodyText text={parsed.body} />
      </div>
    </div>
  );
}

// ─── Part6Passage ─────────────────────────────────────────────────────────────

export default function Part6Passage({
  passage,
  passageIndex,
  totalPassages,
  startQuestionNumber,
  totalQuestions,
  answers,
  onSelect,
  onNext,
  isLast,
}: Part6PassageProps) {
  const progressPct = ((passageIndex + 1) / totalPassages) * 100;
  const endQ = startQuestionNumber + passage.questions.length - 1;

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
          Partie 6 — Textes à trous
        </span>
        <span className="text-xs text-gray-400 tabular-nums">
          Texte {passageIndex + 1} / {totalPassages} &nbsp;·&nbsp; Q
          {startQuestionNumber}–{endQ} / {totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6600CC] rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Passage in its doctype container */}
      <DocContainer doctype={passage.doctype} text={passage.text} />

      {/* Questions — one row per blank */}
      <div className="flex flex-col gap-4">
        {passage.questions.map((question, localIdx) => {
          const selected = answers[localIdx] ?? null;
          // Use single-column layout when any option text is long (sentence insertion)
          const maxLen = Math.max(
            ...question.options.map(
              (o) => o.replace(/^\([A-D]\)\s*/, "").length
            )
          );
          const singleCol = maxLen > 45;

          return (
            <div
              key={localIdx}
              className="rounded-xl border border-gray-100 p-5 flex flex-col gap-3"
            >
              <p className="text-xs font-bold text-[#6600CC] uppercase tracking-wider">
                Blanc [{localIdx + 1}]
              </p>

              <div
                className={
                  singleCol ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"
                }
              >
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
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
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

      {/* Navigation */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="px-7 py-3 bg-[#6600CC] text-white text-sm font-bold rounded-full hover:bg-[#5500aa] transition-colors shadow-md"
        >
          {isLast ? "Terminer la partie 6 →" : "Texte suivant →"}
        </button>
      </div>
    </div>
  );
}
