"use client";

const LETTERS = ["A", "B", "C", "D"] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface P5Question {
  text: string;
  options: string[]; // "(A) …", "(B) …", …
  answer: string;
}

interface Part5BatchProps {
  questions: P5Question[];
  batchIndex: number;
  totalBatches: number;
  startQuestionNumber: number;
  totalQuestions: number;
  answers: Record<number, string>; // keyed by local index 0–9
  onSelect: (localIndex: number, letter: string) => void;
  onNext: () => void; // advance to next batch or finish
  isLast: boolean;
}

// ─── Sentence with highlighted blank ─────────────────────────────────────────

function SentenceText({ text }: { text: string }) {
  const BLANK = "_______";
  const idx = text.indexOf(BLANK);

  if (idx === -1) return <span>{text}</span>;

  return (
    <>
      {text.slice(0, idx)}
      <span className="inline-block px-3 border-b-2 border-[#6600CC] text-[#6600CC] font-semibold mx-0.5 min-w-[4rem] text-center">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </span>
      {text.slice(idx + BLANK.length)}
    </>
  );
}

// ─── Part5Batch ───────────────────────────────────────────────────────────────

export default function Part5Batch({
  questions,
  batchIndex,
  totalBatches,
  startQuestionNumber,
  totalQuestions,
  answers,
  onSelect,
  onNext,
  isLast,
}: Part5BatchProps) {
  const progressPct = ((batchIndex + 1) / totalBatches) * 100;
  const endQuestionNumber = startQuestionNumber + questions.length - 1;

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
          Partie 5 — Phrases incomplètes
        </span>
        <span className="text-xs text-gray-400 tabular-nums">
          Q{startQuestionNumber}–{endQuestionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6600CC] rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-5">
        {questions.map((question, localIdx) => {
          const qNum = startQuestionNumber + localIdx;
          const selected = answers[localIdx] ?? null;

          return (
            <div
              key={localIdx}
              className="rounded-xl border border-gray-100 p-5 flex flex-col gap-3"
            >
              {/* Sentence */}
              <p className="text-sm text-gray-800 leading-relaxed">
                <span className="text-[#6600CC] font-bold mr-2">{qNum}.</span>
                <SentenceText text={question.text} />
              </p>

              {/* Answer grid — 2 columns */}
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

      {/* Navigation */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="px-7 py-3 bg-[#6600CC] text-white text-sm font-bold rounded-full hover:bg-[#5500aa] transition-colors shadow-md"
        >
          {isLast ? "Terminer la partie 5 →" : "Questions suivantes →"}
        </button>
      </div>
    </div>
  );
}
