"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useExerciseCompletion } from "@/hooks/useExerciseCompletion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExoType {
  id: string;
  label: string;
  description: string;
}

interface AudioUrls {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface Explanation {
  correct: string;
  distractors: Partial<Record<"A" | "B" | "C" | "D", string>>;
}

interface ExoP1Question {
  image: string;
  type: string;
  statements: string[];
  answer: string;
  explanation: Explanation;
  image_url: string;
  audio_urls: AudioUrls;
}

interface AdviceTrap {
  label: string;
  example: string;
}

interface Advice {
  intro: string;
  strategy: string;
  traps: AdviceTrap[];
}

interface ExoPart1ShellProps {
  questions: ExoP1Question[];
  types: ExoType[];
  advice: Advice;
  exerciseKey: string;
}

type Phase = "advice" | "questions" | "done";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExoPart1Shell({
  questions,
  types,
  advice,
  exerciseKey,
}: ExoPart1ShellProps) {
  const router = useRouter();
  const { markCompleted } = useExerciseCompletion();
  const [phase, setPhase] = useState<Phase>("advice");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const currentAudioKeyRef = useRef<string | null>(null);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  const isFirstOfType =
    currentIndex === 0 ||
    questions[currentIndex].type !== questions[currentIndex - 1].type;

  const currentType = types.find((t) => t.id === currentQ?.type);
  const typeIndex = types.findIndex((t) => t.id === currentQ?.type);

  const totalCorrect = Object.entries(answers).filter(
    ([idx, ans]) => questions[Number(idx)].answer === ans
  ).length;

  const perTypeStats = types.map((t) => {
    const typeQs = questions.map((q, i) => ({ q, i })).filter(({ q }) => q.type === t.id);
    const correct = typeQs.filter(({ q, i }) => answers[i] === q.answer).length;
    return { type: t, total: typeQs.length, correct };
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleSelect(key: string) {
    if (selected !== null) return;
    setSelected(key);
    setAnswers((prev) => ({ ...prev, [currentIndex]: key }));
    stopAudio();
  }

  function handleNext() {
    if (currentIndex + 1 >= totalQuestions) {
      markCompleted(exerciseKey);
      setPhase("done");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setHasPlayedAudio(false);
    }
  }

  function handleRestart() {
    setPhase("advice");
    setCurrentIndex(0);
    setSelected(null);
    setAnswers({});
    setHasPlayedAudio(false);
    stopAudio();
  }

  function stopAudio() {
    if (currentAudioKeyRef.current) {
      const el = audioRefs.current[currentAudioKeyRef.current];
      if (el) { el.pause(); el.currentTime = 0; }
    }
    setIsPlaying(false);
    currentAudioKeyRef.current = null;
  }

  async function handleAudioToggle() {
    if (isPlaying) { stopAudio(); return; }
    setIsPlaying(true);
    setHasPlayedAudio(true);
    const keys: (keyof AudioUrls)[] = ["A", "B", "C", "D"];
    for (const key of keys) {
      const url = currentQ.audio_urls[key];
      if (!url) continue;
      let audio = audioRefs.current[url];
      if (!audio) { audio = new Audio(url); audioRefs.current[url] = audio; }
      audio.currentTime = 0;
      currentAudioKeyRef.current = url;
      await new Promise<void>((resolve) => {
        if (!audio) return resolve();
        const onEnd = () => { audio?.removeEventListener("ended", onEnd); resolve(); };
        audio.addEventListener("ended", onEnd);
        audio.play().catch(() => resolve());
      });
      if (currentAudioKeyRef.current !== url) return;
    }
    setIsPlaying(false);
    currentAudioKeyRef.current = null;
  }

  // ─── Button styles ────────────────────────────────────────────────────────

  function getButtonStyle(key: string): string {
    const base =
      "flex-1 min-w-0 text-left px-4 py-3 rounded-xl border text-sm transition-colors duration-150";
    if (!hasPlayedAudio)
      return `${base} border-gray-100 text-gray-300 cursor-not-allowed`;
    if (selected === null)
      return `${base} border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800 cursor-pointer`;
    if (key === currentQ.answer)
      return `${base} border-green-400 bg-green-50 text-green-700 font-medium cursor-default`;
    if (key === selected)
      return `${base} border-red-300 bg-red-50 text-red-700 font-medium cursor-default`;
    return `${base} border-gray-100 text-gray-400 cursor-default`;
  }

  const isCorrect = selected !== null && selected === currentQ?.answer;
  const progress = ((currentIndex + (selected !== null ? 1 : 0)) / totalQuestions) * 100;

  // ── Advice phase ─────────────────────────────────────────────────────────────
  if (phase === "advice") {
    return (
      <div className="p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-3">
          Partie 1 — Exercice
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Photographies</h1>
        <p className="text-sm text-gray-500 mb-5">{advice.intro}</p>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd6fe] bg-[#f3eeff] px-4 py-1.5 mb-5">
          <span className="text-sm font-semibold text-[#7c3aed]">{types[0].label}</span>
          <span className="text-xs text-[#9f7aea]">· {totalQuestions} questions</span>
        </div>

        {/* Strategy tip */}
        <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-amber-800">{advice.strategy}</p>
        </div>

        {/* Traps grid */}
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Les 6 pièges à éviter
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
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Exercice terminé !</h2>
            <p className="text-sm text-gray-500">
              Score :{" "}
              <span className="font-semibold text-gray-800">{totalCorrect} / {totalQuestions}</span>{" "}
              bonne{totalCorrect > 1 ? "s" : ""} réponse{totalCorrect > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          {perTypeStats.map(({ type: t, total, correct }) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 bg-gray-50"
            >
              <p className="text-sm font-medium text-gray-800">{t.label}</p>
              <span
                className={`text-sm font-semibold tabular-nums ${
                  correct === total ? "text-green-600" : correct === 0 ? "text-red-500" : "text-amber-600"
                }`}
              >
                {correct} / {total}
              </span>
            </div>
          ))}
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
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {showQuitConfirm && (
          <div className="absolute top-10 left-0 z-20 w-72 bg-white rounded-xl border border-gray-200 shadow-lg p-4">
            <p className="text-sm text-gray-700 mb-3">Êtes-vous sûr de vouloir quitter la page ?</p>
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
      {/* Type header banner */}
      {isFirstOfType && currentType && (
        <div className="mb-5 rounded-xl bg-[#f3eeff] border border-[#ddd6fe] px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#7c3aed]">{currentType.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{currentType.description}</p>
          </div>
          {types.length > 1 && (
            <span className="shrink-0 text-xs font-medium text-[#7c3aed] bg-[#ede9fe] px-2 py-1 rounded-full">
              {typeIndex + 1} / {types.length} types
            </span>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500">
          Question {currentIndex + 1} / {totalQuestions}
        </p>
      </div>
      <div className="w-full h-1 bg-gray-100 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Feedback banner */}
      {selected !== null && (
        <div
          className={`mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
            isCorrect
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {isCorrect ? (
            <>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Correct
            </>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Faux — la bonne réponse était ({currentQ.answer})
            </>
          )}
        </div>
      )}

      {/* Image with audio toggle */}
      <div className="w-full flex justify-center mb-5">
        <div className="relative w-80 h-80 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={currentQ.image_url}
            alt={`Question ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleAudioToggle}
            title={isPlaying ? "Arrêter l'audio" : "Écouter A/B/C/D"}
            className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors duration-150 cursor-pointer"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Answer buttons — 2×2 grid (hidden once answered) */}
      {selected === null && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          {OPTION_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={!hasPlayedAudio}
              className={getButtonStyle(key)}
            >
              {key}
            </button>
          ))}
        </div>
      )}

      {/* Explanation */}
      {selected !== null && (
        <div className="rounded-xl border border-gray-100 overflow-hidden mb-0">
          {/* All rows in A→D order */}
          {OPTION_KEYS.map((key, i) => {
            const isCorrect = key === currentQ.answer;
            const isChosen = key === selected;
            const text = isCorrect
              ? currentQ.explanation.correct
              : currentQ.explanation.distractors[key];
            if (!text) return null;
            return (
              <div
                key={key}
                className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                  isCorrect ? "bg-green-50" : isChosen ? "bg-red-50" : "bg-white"
                }`}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${
                    isCorrect
                      ? "bg-green-500 text-white"
                      : isChosen
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {key}
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-medium mb-0.5 ${isCorrect ? "text-green-700" : isChosen ? "text-red-600" : "text-gray-400"}`}>
                    {currentQ.statements[i]}
                  </p>
                  <p className={`text-sm ${isCorrect ? "text-green-800" : isChosen ? "text-red-700" : "text-gray-500"}`}>
                    {text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Next button */}
          <div className="flex justify-end px-4 py-3 bg-gray-50">
            <button
              onClick={handleNext}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer"
            >
              {currentIndex + 1 >= totalQuestions ? "Voir les résultats →" : "Suivant →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
