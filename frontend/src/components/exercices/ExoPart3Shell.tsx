"use client";

import { useRef, useState } from "react";
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

interface DialogueLine {
  speaker: string;
  text: string;
}

interface Explanation {
  correct: string;
  distractors: Partial<Record<"A" | "B" | "C" | "D", string>>;
}

interface Question {
  text: string;
  options: string[];
  answer: string;
  explanation: Explanation;
}

interface Conversation {
  type: string;
  dialogue: DialogueLine[];
  questions: Question[];
  audio_url: string;
}

interface ExoPart3ShellProps {
  conversations: Conversation[];
  advice: Advice;
}

type Phase = "advice" | "questions" | "done";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExoPart3Shell({ conversations, advice }: ExoPart3ShellProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("advice");
  const [currentConvIndex, setCurrentConvIndex] = useState(0);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});
  const [verified, setVerified] = useState(false);
  const [allAnswers, setAllAnswers] = useState<Record<number, Record<number, string>>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const currentConv = conversations[currentConvIndex];
  const totalConvs = conversations.length;
  const allAnswered = Object.keys(currentAnswers).length === currentConv?.questions.length;
  const canVerify = hasPlayedAudio && allAnswered && !verified;

  const totalQs = conversations.reduce((acc, c) => acc + c.questions.length, 0);
  const totalCorrect = Object.entries(allAnswers).reduce((acc, [convIdxStr, qAnswers]) => {
    const conv = conversations[Number(convIdxStr)];
    return (
      acc +
      Object.entries(qAnswers).filter(
        ([qIdxStr, ans]) => conv.questions[Number(qIdxStr)].answer === ans
      ).length
    );
  }, 0);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleSelect(qIndex: number, key: string) {
    if (verified || !hasPlayedAudio) return;
    setCurrentAnswers((prev) => ({ ...prev, [qIndex]: key }));
  }

  function handleVerify() {
    if (!canVerify) return;
    setVerified(true);
    setAllAnswers((prev) => ({ ...prev, [currentConvIndex]: currentAnswers }));
    stopAudio();
  }

  function handleNext() {
    if (currentConvIndex + 1 >= totalConvs) {
      setPhase("done");
    } else {
      setCurrentConvIndex((i) => i + 1);
      setCurrentAnswers({});
      setVerified(false);
      setHasPlayedAudio(false);
      stopAudio();
    }
  }

  function handleRestart() {
    setPhase("advice");
    setCurrentConvIndex(0);
    setCurrentAnswers({});
    setVerified(false);
    setAllAnswers({});
    setHasPlayedAudio(false);
    stopAudio();
  }

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }

  function handleAudioToggle() {
    if (isPlaying) { stopAudio(); return; }

    if (audioUrlRef.current !== currentConv.audio_url) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(currentConv.audio_url);
      audioUrlRef.current = currentConv.audio_url;
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }

    audioRef.current!.currentTime = 0;
    audioRef.current!.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
    setHasPlayedAudio(true);
  }

  // ─── Option button style ───────────────────────────────────────────────────

  function getOptionStyle(qIndex: number, key: string): string {
    const base =
      "w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors duration-150 flex items-center gap-3";
    const q = currentConv.questions[qIndex];

    if (!hasPlayedAudio)
      return `${base} border-gray-100 text-gray-300 cursor-not-allowed`;

    if (!verified) {
      if (currentAnswers[qIndex] === key)
        return `${base} border-[#7c3aed] bg-[#faf5ff] text-[#7c3aed] cursor-pointer`;
      return `${base} border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800 cursor-pointer`;
    }

    if (key === q.answer)
      return `${base} border-green-400 bg-green-50 text-green-700 font-medium cursor-default`;
    if (key === currentAnswers[qIndex])
      return `${base} border-red-300 bg-red-50 text-red-700 cursor-default`;
    return `${base} border-gray-100 text-gray-400 cursor-default`;
  }

  function getLetterBadgeStyle(qIndex: number, key: string): string {
    const base =
      "shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center";
    const q = currentConv.questions[qIndex];

    if (!hasPlayedAudio) return `${base} bg-gray-100 text-gray-300`;

    if (!verified) {
      if (currentAnswers[qIndex] === key) return `${base} bg-[#7c3aed] text-white`;
      return `${base} bg-gray-100 text-gray-500`;
    }

    if (key === q.answer) return `${base} bg-green-500 text-white`;
    if (key === currentAnswers[qIndex]) return `${base} bg-red-100 text-red-600`;
    return `${base} bg-gray-100 text-gray-400`;
  }

  const progress = ((currentConvIndex + (verified ? 1 : 0)) / totalConvs) * 100;

  // ── Advice phase ─────────────────────────────────────────────────────────────
  if (phase === "advice") {
    return (
      <div className="p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-3">
          Partie 3 — Exercice
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Conversations</h1>
        <p className="text-sm text-gray-500 mb-6">{advice.intro}</p>

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
                {totalCorrect} / {totalQs}
              </span>{" "}
              bonne{totalCorrect > 1 ? "s" : ""} réponse{totalCorrect > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          {conversations.map((conv, i) => {
            const qAnswers = allAnswers[i] ?? {};
            const correct = conv.questions.filter(
              (q, qi) => qAnswers[qi] === q.answer
            ).length;
            const total = conv.questions.length;
            return (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-700 truncate pr-4">
                  Conv. {i + 1} — {conv.type.split(" — ")[0]}
                </p>
                <span
                  className={`shrink-0 text-sm font-semibold tabular-nums ${
                    correct === total
                      ? "text-green-600"
                      : correct === 0
                      ? "text-red-500"
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
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500">
          Conversation {currentConvIndex + 1} / {totalConvs}
        </p>
      </div>
      <div className="w-full h-1 bg-gray-100 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Topic banner */}
      <div className="mb-5 rounded-xl bg-[#f3eeff] border border-[#ddd6fe] px-4 py-3">
        <p className="text-sm font-semibold text-[#7c3aed]">{currentConv.type}</p>
      </div>

      {/* Audio button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleAudioToggle}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold transition-colors duration-150 cursor-pointer"
        >
          {isPlaying ? (
            <>
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              Arrêter
            </>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Écouter la conversation
            </>
          )}
        </button>
      </div>

      {/* 3 Questions */}
      <div className="flex flex-col gap-6 mb-6">
        {currentConv.questions.map((q, qIdx) => (
          <div key={qIdx}>
            <p className="text-sm font-semibold text-gray-800 mb-3">
              {qIdx + 1}. {q.text}
            </p>
            {/* Answer buttons (hidden once verified) */}
            {!verified && (
              <div className="flex flex-col gap-2">
                {OPTION_KEYS.map((key, optIdx) => {
                  const optionText = q.options[optIdx]?.replace(/^\([A-D]\)\s*/, "") ?? "";
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelect(qIdx, key)}
                      disabled={!hasPlayedAudio}
                      className={getOptionStyle(qIdx, key)}
                    >
                      <span className={getLetterBadgeStyle(qIdx, key)}>{key}</span>
                      <span>{optionText}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Per-option explanation rows after verification */}
            {verified && (
              <div className="mt-3 rounded-xl border border-gray-100 overflow-hidden">
                {OPTION_KEYS.map((key, optIdx) => {
                  const isCorrectKey = key === q.answer;
                  const isChosen = currentAnswers[qIdx] === key;
                  const text = isCorrectKey
                    ? q.explanation.correct
                    : q.explanation.distractors[key];
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
                          {q.options[optIdx]?.replace(/^\([A-D]\)\s*/, "")}
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

      {/* Vérifier / Next */}
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
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            {currentConvIndex + 1 >= totalConvs
              ? "Voir les résultats →"
              : "Conversation suivante →"}
          </button>
        )}
      </div>
    </div>
  );
}
