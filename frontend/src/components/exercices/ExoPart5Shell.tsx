"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdviceTrap {
  label: string;
  example: string;
}

interface Advice {
  intro: string;
  strategy: string;
  traps: AdviceTrap[];
}

interface Explanation {
  correct: string;
  distractors: Partial<Record<"A" | "B" | "C" | "D", string>>;
}

interface P5Question {
  category: string;
  sentence: string;
  options: string[];
  answer: string;
  explanation: Explanation;
}

interface ExoPart5ShellProps {
  questions: P5Question[];
  categoryLabel: string;
  categoryDescription: string;
  advice: Advice;
}

type Phase = "advice" | "questions" | "done";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExoPart5Shell({
  questions,
  categoryLabel,
  categoryDescription,
  advice,
}: ExoPart5ShellProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("advice");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const totalQuestions = questions.length;
  const currentQ = questions[currentIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === currentQ?.answer;

  const totalCorrect = Object.entries(answers).filter(
    ([i, ans]) => questions[Number(i)].answer === ans
  ).length;

  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / totalQuestions) * 100;

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleSelect(key: string) {
    if (isAnswered) return;
    setSelected(key);
    setAnswers((prev) => ({ ...prev, [currentIndex]: key }));
  }

  function handleNext() {
    if (currentIndex + 1 >= totalQuestions) {
      setPhase("done");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function handleRestart() {
    setPhase("advice");
    setCurrentIndex(0);
    setSelected(null);
    setAnswers({});
  }

  // ─── Option style helpers ──────────────────────────────────────────────────

  function getOptionStyle(key: string): string {
    const base =
      "w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors duration-150 flex items-center gap-3 cursor-pointer";
    if (!isAnswered) {
      return `${base} border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800`;
    }
    if (key === currentQ.answer)
      return `${base} border-green-400 bg-green-50 text-green-700 font-medium cursor-default`;
    if (key === selected)
      return `${base} border-red-300 bg-red-50 text-red-700 cursor-default`;
    return `${base} border-gray-100 text-gray-400 cursor-default`;
  }

  function getLetterBadgeStyle(key: string): string {
    const base =
      "shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center";
    if (!isAnswered) return `${base} bg-gray-100 text-gray-500`;
    if (key === currentQ.answer) return `${base} bg-green-500 text-white`;
    if (key === selected) return `${base} bg-red-100 text-red-600`;
    return `${base} bg-gray-100 text-gray-400`;
  }

  // ── Advice phase ─────────────────────────────────────────────────────────────
  if (phase === "advice") {
    return (
      <div className="p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-3">
          Partie 5 — Exercice
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Phrases incomplètes
        </h1>
        <p className="text-sm text-gray-500 mb-5">{advice.intro}</p>

        {/* Category badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd6fe] bg-[#f3eeff] px-4 py-1.5 mb-5">
          <span className="text-sm font-semibold text-[#7c3aed]">
            {categoryLabel}
          </span>
          <span className="text-xs text-[#9f7aea]">
            · {categoryDescription}
          </span>
        </div>

        {/* Strategy tip */}
        <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-amber-800">{advice.strategy}</p>
        </div>

        {/* Traps grid */}
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Les {advice.traps.length} pièges à éviter
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {advice.traps.map((trap, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#ede9fe] text-[#7c3aed] text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">{trap.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">ex. {trap.example}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPhase("questions")}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 cursor-pointer"
        >
          Aller aux questions →
        </button>
      </div>
    );
  }

  // ── Done phase ────────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <div className="p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Exercice terminé !</h2>
            <p className="text-sm text-gray-500">
              Score :{" "}
              <span className="font-semibold text-gray-800">
                {totalCorrect} / {totalQuestions}
              </span>{" "}
              bonne{totalCorrect > 1 ? "s" : ""} réponse
              {totalCorrect > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Per-question recap */}
        <div className="space-y-1.5 mb-8">
          {questions.map((q, i) => {
            const ans = answers[i];
            const correct = ans === q.answer;
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 bg-gray-50"
              >
                <span
                  className={`shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                    correct
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {correct ? "✓" : "✗"}
                </span>
                <p className="text-sm text-gray-600 flex-1 truncate">
                  {q.sentence}
                </p>
                {!correct && (
                  <span className="shrink-0 text-xs font-semibold text-green-600">
                    → {q.answer}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="border border-[#7c3aed] text-[#7c3aed] hover:bg-[#faf5ff] font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            Recommencer
          </button>
          <button
            onClick={() => router.push("/exercices")}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            Exercices
          </button>
        </div>
      </div>
    );
  }

  // ── Questions phase ───────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8">
      {/* X button + floating quit confirm */}
      <div className="relative mb-4 w-fit">
        <button
          onClick={() => setShowQuitConfirm((v) => !v)}
          title="Quitter l'exercice"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {showQuitConfirm && (
          <div className="absolute top-10 left-0 z-20 w-72 bg-white rounded-xl border border-gray-200 shadow-lg p-4">
            <p className="text-sm text-gray-700 mb-3">
              Êtes-vous sûr de vouloir quitter la page ?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/exercices")}
                className="flex-1 text-sm font-semibold py-1.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-colors cursor-pointer"
              >
                Oui
              </button>
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 text-sm font-semibold py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Non
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500">
          Question {currentIndex + 1} / {totalQuestions}
        </p>
        <span className="text-xs font-semibold text-[#7c3aed]">
          {categoryLabel}
        </span>
      </div>
      <div className="w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sentence */}
      <div className="mb-6 rounded-xl bg-gray-50 border border-gray-100 px-5 py-4">
        <p className="text-base text-gray-900 leading-relaxed font-medium">
          {currentQ.sentence}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2 mb-6">
        {OPTION_KEYS.map((key, idx) => {
          const optionText =
            currentQ.options[idx]?.replace(/^\([A-D]\)\s*/, "") ?? "";
          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={isAnswered}
              className={getOptionStyle(key)}
            >
              <span className={getLetterBadgeStyle(key)}>{key}</span>
              <span>{optionText}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback + explanation (shown after selection) */}
      {isAnswered && (
        <div className="mb-6 space-y-3">
          {/* Feedback pill */}
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
              isCorrect
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isCorrect ? (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Correct
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Faux — la bonne réponse était ({currentQ.answer})
              </>
            )}
          </div>

          {/* Per-option explanation rows */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            {OPTION_KEYS.map((key, idx) => {
              const isCorrectKey = key === currentQ.answer;
              const isChosen = selected === key;
              const text = isCorrectKey
                ? currentQ.explanation.correct
                : currentQ.explanation.distractors[key];
              if (!text) return null;
              return (
                <div
                  key={key}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                    isCorrectKey ? "bg-green-50" : isChosen ? "bg-red-50" : "bg-white"
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${
                      isCorrectKey
                        ? "bg-green-500 text-white"
                        : isChosen
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {key}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-medium mb-0.5 ${
                        isCorrectKey
                          ? "text-green-700"
                          : isChosen
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {currentQ.options[idx]?.replace(/^\([A-D]\)\s*/, "")}
                    </p>
                    <p
                      className={`text-sm ${
                        isCorrectKey
                          ? "text-green-800"
                          : isChosen
                          ? "text-red-700"
                          : "text-gray-500"
                      }`}
                    >
                      {text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            {currentIndex + 1 >= totalQuestions
              ? "Voir les résultats →"
              : "Question suivante →"}
          </button>
        </div>
      )}
    </div>
  );
}
