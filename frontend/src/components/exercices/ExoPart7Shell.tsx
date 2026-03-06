"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useExerciseCompletion } from "@/hooks/useExerciseCompletion";

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

interface P7Question {
  text: string;
  options: string[];
  answer: string;
  explanation: Explanation;
}

interface P7Passage {
  doctype: string;
  title: string;
  text: string;
  questions: P7Question[];
}

interface ExoPart7ShellProps {
  passages: P7Passage[];
  advice: Advice;
  exerciseLabel: string;
  exerciseKey: string;
}

type Phase = "advice" | "questions" | "done";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

const DOCTYPE_LABELS: Record<string, string> = {
  article: "Article",
  email: "Email",
  notice: "Avis",
  memo: "Mémo",
  job_posting: "Offre d'emploi",
  advertisement: "Annonce",
  letter: "Lettre",
  flyer: "Flyer",
  review: "Avis client",
  schedule: "Planning",
  text_message: "SMS",
  invoice: "Facture",
  itinerary: "Itinéraire",
  product_label: "Étiquette produit",
  business_card: "Carte de visite",
  coupon: "Coupon",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExoPart7Shell({
  passages,
  advice,
  exerciseLabel,
  exerciseKey,
}: ExoPart7ShellProps) {
  const router = useRouter();
  const { markCompleted } = useExerciseCompletion();
  const [phase, setPhase] = useState<Phase>("advice");
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});
  const [verified, setVerified] = useState(false);
  const [allAnswers, setAllAnswers] = useState<Record<number, Record<number, string>>>({});
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const totalPassages = passages.length;
  const currentPassage = passages[currentPassageIndex];
  const allSelected =
    Object.keys(currentAnswers).length === currentPassage?.questions.length;
  const canVerify = allSelected && !verified;

  const totalQuestions = passages.reduce((sum, p) => sum + p.questions.length, 0);
  const totalCorrect = passages.reduce((sum, passage, pIdx) => {
    const pAnswers = allAnswers[pIdx] ?? {};
    return (
      sum +
      passage.questions.filter((q, qIdx) => pAnswers[qIdx] === q.answer).length
    );
  }, 0);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function handleSelect(questionIdx: number, key: string) {
    if (verified) return;
    setCurrentAnswers((prev) => ({ ...prev, [questionIdx]: key }));
  }

  function handleVerify() {
    if (!canVerify) return;
    setVerified(true);
    setAllAnswers((prev) => ({ ...prev, [currentPassageIndex]: currentAnswers }));
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPassageIndex]);

  function handleNext() {
    if (currentPassageIndex + 1 >= totalPassages) {
      markCompleted(exerciseKey);
      setPhase("done");
    } else {
      setCurrentPassageIndex((i) => i + 1);
      setCurrentAnswers({});
      setVerified(false);
    }
  }

  function handleRestart() {
    setPhase("advice");
    setCurrentPassageIndex(0);
    setCurrentAnswers({});
    setVerified(false);
    setAllAnswers({});
  }

  // ─── Option style helpers ────────────────────────────────────────────────────

  function getOptionStyle(questionIdx: number, key: string): string {
    const base =
      "w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors duration-150 flex items-center gap-3";
    const q = currentPassage.questions[questionIdx];
    if (!verified) {
      if (currentAnswers[questionIdx] === key)
        return `${base} border-[#7c3aed] bg-[#faf5ff] text-[#7c3aed] cursor-pointer`;
      return `${base} border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800 cursor-pointer`;
    }
    if (key === q.answer)
      return `${base} border-green-400 bg-green-50 text-green-700 font-medium cursor-default`;
    if (key === currentAnswers[questionIdx])
      return `${base} border-red-300 bg-red-50 text-red-700 cursor-default`;
    return `${base} border-gray-100 text-gray-400 cursor-default`;
  }

  function getLetterBadgeStyle(questionIdx: number, key: string): string {
    const base =
      "shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center";
    const q = currentPassage.questions[questionIdx];
    if (!verified) {
      if (currentAnswers[questionIdx] === key) return `${base} bg-[#7c3aed] text-white`;
      return `${base} bg-gray-100 text-gray-500`;
    }
    if (key === q.answer) return `${base} bg-green-500 text-white`;
    if (key === currentAnswers[questionIdx]) return `${base} bg-red-100 text-red-600`;
    return `${base} bg-gray-100 text-gray-400`;
  }

  // ── Advice phase ─────────────────────────────────────────────────────────────

  if (phase === "advice") {
    return (
      <div className="p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-3">
          Partie 7 — {exerciseLabel}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Lecture de documents
        </h1>
        <p className="text-sm text-gray-500 mb-5">{advice.intro}</p>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd6fe] bg-[#f3eeff] px-4 py-1.5 mb-5">
          <span className="text-sm font-semibold text-[#7c3aed]">{exerciseLabel}</span>
          <span className="text-xs text-[#9f7aea]">
            · {totalPassages} textes · {totalQuestions} questions
          </span>
        </div>

        <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-amber-800">{advice.strategy}</p>
        </div>

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
          Aller aux textes →
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
              bonne{totalCorrect > 1 ? "s" : ""} réponse{totalCorrect > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          {passages.map((passage, pIdx) => {
            const pAnswers = allAnswers[pIdx] ?? {};
            const correct = passage.questions.filter(
              (q, qIdx) => pAnswers[qIdx] === q.answer
            ).length;
            const total = passage.questions.length;
            const allCorrect = correct === total;
            return (
              <div
                key={pIdx}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 bg-gray-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`shrink-0 text-xs font-semibold uppercase tracking-wide rounded-md px-2 py-0.5 ${
                      allCorrect
                        ? "bg-green-100 text-green-700"
                        : correct === 0
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {DOCTYPE_LABELS[passage.doctype] ?? passage.doctype}
                  </span>
                  <p className="text-sm text-gray-700 truncate">{passage.title}</p>
                </div>
                <span
                  className={`shrink-0 text-xs font-semibold ml-3 tabular-nums ${
                    allCorrect
                      ? "text-green-600"
                      : correct === 0
                      ? "text-red-600"
                      : "text-amber-600"
                  }`}
                >
                  {correct} / {total}
                </span>
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

  const progressPct =
    ((currentPassageIndex + (verified ? 1 : 0)) / totalPassages) * 100;

  return (
    <div className="p-6 md:p-8">
      {/* Quit button */}
      <div className="relative mb-4 w-fit">
        <button
          onClick={() => setShowQuitConfirm((v) => !v)}
          title="Quitter l'exercice"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          Texte {currentPassageIndex + 1} / {totalPassages}
        </p>
        <span className="text-xs font-semibold text-[#7c3aed]">{exerciseLabel}</span>
      </div>
      <div className="w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Document header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#7c3aed] bg-[#ede9fe] rounded-md px-2 py-0.5">
          {DOCTYPE_LABELS[currentPassage.doctype] ?? currentPassage.doctype}
        </span>
        <span className="text-xs text-gray-400 font-medium">{currentPassage.title}</span>
      </div>

      {/* Passage text */}
      <div className="mb-6 rounded-xl bg-gray-50 border border-gray-100 px-5 py-4">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {currentPassage.text}
        </p>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-6 mb-6">
        {currentPassage.questions.map((question, qIdx) => (
          <div key={qIdx}>
            <p className="text-sm font-semibold text-gray-800 mb-3">
              {qIdx + 1}. {question.text}
            </p>

            {/* Options — hidden after verify */}
            {!verified && (
              <div className="flex flex-col gap-2">
                {OPTION_KEYS.map((key, idx) => {
                  const optionText =
                    question.options[idx]?.replace(/^\([A-D]\)\s*/, "") ?? "";
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelect(qIdx, key)}
                      className={getOptionStyle(qIdx, key)}
                    >
                      <span className={getLetterBadgeStyle(qIdx, key)}>{key}</span>
                      <span>{optionText}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Explanation rows — shown after verify */}
            {verified && (
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                {OPTION_KEYS.map((key, idx) => {
                  const isCorrectKey = key === question.answer;
                  const isChosen = currentAnswers[qIdx] === key;
                  const text = isCorrectKey
                    ? question.explanation.correct
                    : question.explanation.distractors[key];
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
                          {question.options[idx]?.replace(/^\([A-D]\)\s*/, "")}
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
            )}
          </div>
        ))}
      </div>

      {/* Vérifier / Texte suivant */}
      <div className="flex justify-end mt-2">
        {!verified ? (
          <button
            onClick={handleVerify}
            disabled={!canVerify}
            className={`font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 ${
              canVerify
                ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Vérifier mes réponses →
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            {currentPassageIndex + 1 >= totalPassages
              ? "Voir les résultats →"
              : "Texte suivant →"}
          </button>
        )}
      </div>
    </div>
  );
}
