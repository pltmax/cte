"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const AUDIO_DURATION_MS = 12_000; // simulated conversation
const GRACE_PERIOD_S = 10; // time to answer 3 questions after audio
const LETTERS = ["A", "B", "C", "D"] as const;
const FLICKER_MS = 850;

// ─── Placeholder question data ────────────────────────────────────────────────

const Q_TEMPLATES = [
  {
    q: "Quel est le sujet principal de cette conversation ?",
    opts: [
      "Un changement de planning",
      "Une commande de matériel",
      "Un problème technique",
      "Une réunion annulée",
    ],
  },
  {
    q: "Où se déroule probablement cette conversation ?",
    opts: [
      "Dans un bureau",
      "Dans un restaurant",
      "À l'aéroport",
      "Dans une salle de réunion",
    ],
  },
  {
    q: "Que vont probablement faire les personnes ensuite ?",
    opts: [
      "Envoyer un rapport",
      "Appeler un client",
      "Modifier le document",
      "Prendre rendez-vous",
    ],
  },
  {
    q: "Quel problème est mentionné dans la conversation ?",
    opts: [
      "Un délai trop court",
      "Un budget dépassé",
      "Une erreur de livraison",
      "Un dossier manquant",
    ],
  },
  {
    q: "Quelle est la relation entre les deux personnes ?",
    opts: [
      "Collègues de travail",
      "Client et vendeur",
      "Supérieur et employé",
      "Partenaires commerciaux",
    ],
  },
  {
    q: "Qu'est-ce que l'homme suggère de faire ?",
    opts: [
      "Reporter la réunion",
      "Contacter le service",
      "Vérifier les stocks",
      "Préparer une présentation",
    ],
  },
  {
    q: "De quoi la femme a-t-elle besoin ?",
    opts: [
      "D'une confirmation écrite",
      "D'un nouveau budget",
      "D'une aide supplémentaire",
      "D'un accès au système",
    ],
  },
] as const;

function getQuestion(convIndex: number, qIndex: number) {
  return Q_TEMPLATES[(convIndex * 3 + qIndex) % Q_TEMPLATES.length];
}

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface Part3ConversationProps {
  conversationIndex: number; // 0-based
  totalConversations: number; // 13
  startQuestionNumber: number; // 1-based global (e.g. 1, 4, 7, …)
  totalQuestions: number; // 39
  answers: Record<number, string>; // keyed by local index 0, 1, 2
  onSelect: (localIndex: number, letter: string) => void;
  onConversationComplete: () => void;
}

// ─── Part3Conversation ────────────────────────────────────────────────────────

export default function Part3Conversation({
  conversationIndex,
  totalConversations,
  startQuestionNumber,
  totalQuestions,
  answers,
  onSelect,
  onConversationComplete,
}: Part3ConversationProps) {
  const [audioPhase, setAudioPhase] = useState<"playing" | "grace" | "done">(
    "playing"
  );
  const [graceLeft, setGraceLeft] = useState(GRACE_PERIOD_S);

  const onCompleteRef = useCallback(onConversationComplete, [onConversationComplete]); // eslint-disable-line

  // Phase 1: audio
  useEffect(() => {
    setAudioPhase("playing");
    setGraceLeft(GRACE_PERIOD_S);
    const id = setTimeout(() => setAudioPhase("grace"), AUDIO_DURATION_MS);
    return () => clearTimeout(id);
  }, []); // once per mount; key resets between conversations

  // Phase 2: grace countdown
  useEffect(() => {
    if (audioPhase !== "grace") return;
    const id = setInterval(() => {
      setGraceLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setAudioPhase("done");
          onCompleteRef();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [audioPhase, onCompleteRef]);

  const progressPct =
    ((conversationIndex + 1) / totalConversations) * 100;

  const isPlaying = audioPhase === "playing";

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
          Partie 3 — Conversations
        </span>
        <span className="text-xs text-gray-400 tabular-nums">
          Conv. {conversationIndex + 1} / {totalConversations} &nbsp;·&nbsp; Q
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

      {/* Audio status row */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
        <SoundIcon isPlaying={isPlaying} />
        <div className="flex-1">
          {audioPhase === "playing" && (
            <p className="text-sm text-gray-500 animate-pulse">
              Conversation en cours d&apos;écoute…
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
            <p className="text-sm text-gray-400">Conversation terminée</p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((localIdx) => {
          const qNum = startQuestionNumber + localIdx;
          const { q, opts } = getQuestion(conversationIndex, localIdx);
          const selected = answers[localIdx] ?? null;

          return (
            <div
              key={localIdx}
              className="rounded-xl border border-gray-100 p-5 flex flex-col gap-3"
            >
              {/* Question text */}
              <p className="text-sm font-medium text-gray-800">
                <span className="text-[#6600CC] font-bold mr-2">{qNum}.</span>
                {q}
              </p>

              {/* Answer grid — 2 columns */}
              <div className="grid grid-cols-2 gap-2">
                {LETTERS.map((letter, i) => {
                  const isSelected = selected === letter;
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
                      <span className="leading-snug">{opts[i]}</span>
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
