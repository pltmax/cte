"use client";

import { useState, useRef, useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import type { DiagnosticConfig, DiagAnswers } from "@/types/diagnostic";
import DiagnosticResults from "./DiagnosticResults";

// ─── Constants ────────────────────────────────────────────────────────────────

const OPTION_KEYS = ["A", "B", "C", "D"] as const;
const P2_OPTION_KEYS = ["A", "B", "C"] as const;

const DOCTYPE_LABELS_P6: Record<string, string> = {
  email: "Email",
  memo: "Mémo",
  letter: "Lettre",
  notice: "Avis",
  advertisement: "Annonce",
  article: "Article",
  press_release: "Communiqué",
};

const DOCTYPE_LABELS_P7: Record<string, string> = {
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

type Phase = "intro" | "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "p7" | "done";

// ─── renderPassageText (P6 blanks — always unverified) ────────────────────────

function renderPassageText(text: string): React.ReactNode[] {
  const parts = text.split(/(_{2,}\[\d\])/);
  const result: React.ReactNode[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const blankMatch = part.match(/^_{2,}\[(\d)\]$/);

    if (blankMatch) {
      const blankNum = parseInt(blankMatch[1]);
      result.push(
        <span key={`blank-${i}`} className="inline-flex items-baseline gap-0.5 mx-0.5">
          <span className="text-gray-400 font-medium tracking-widest">_____</span>
          <span className="text-sm text-[#7c3aed] font-bold leading-none">[{blankNum}]</span>
        </span>
      );
    } else {
      const lines = part.split("\n");
      lines.forEach((line, j) => {
        if (j > 0) result.push(<br key={`br-${i}-${j}`} />);
        if (line) result.push(line);
      });
    }
  }

  return result;
}

// ─── Score computation ────────────────────────────────────────────────────────

function computeScore(
  answers: DiagAnswers,
  config: DiagnosticConfig
): { correct: number; score: number } {
  const checks = [
    ...Object.entries(answers.p1).map(([i, a]) => a === config.p1[+i]?.answer),
    ...Object.entries(answers.p2).map(([i, a]) => a === config.p2[+i]?.answer),
    ...Object.entries(answers.p3).map(([i, a]) => a === config.p3.questions.slice(-2)[+i]?.answer),
    ...Object.entries(answers.p4).map(([i, a]) => a === config.p4.questions.slice(-2)[+i]?.answer),
    ...Object.entries(answers.p5).map(([i, a]) => a === config.p5[+i]?.answer),
    ...Object.entries(answers.p6_0).map(([i, a]) => a === config.p6[0]?.questions[+i]?.answer),
    ...Object.entries(answers.p6_1).map(([i, a]) => a === config.p6[1]?.questions[+i]?.answer),
    ...Object.entries(answers.p7_0).map(([i, a]) => a === config.p7[0]?.questions.slice(-2)[+i]?.answer),
    ...Object.entries(answers.p7_1).map(([i, a]) => a === config.p7[1]?.questions.slice(-2)[+i]?.answer),
  ];
  const correct = checks.filter(Boolean).length;
  return { correct, score: Math.round((correct / 22) * 100) };
}

// ─── DiagnosticShell ──────────────────────────────────────────────────────────

export default function DiagnosticShell({ config, userId }: { config: DiagnosticConfig; userId: string }) {
  const storageKey = `diag_progress_${userId}`;

  const [phase, setPhase] = useState<Phase>("intro");
  const [saving, setSaving] = useState(false);
  const [savedResult, setSavedResult] = useState<{
    score: number;
    answers: DiagAnswers;
  } | null>(null);

  // Per-question state (P1 / P2 — one-at-a-time with audio)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Per-passage state (P3 / P4 / P6 / P7 — batch answer)
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});

  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Accumulated answers (all parts)
  const [allAnswers, setAllAnswers] = useState<DiagAnswers>({
    p1: {}, p2: {}, p3: {}, p4: {}, p5: {}, p6_0: {}, p6_1: {}, p7_0: {}, p7_1: {},
  });

  // Audio refs — P1/P2 (sequential multi-audio)
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const currentAudioKeyRef = useRef<string | null>(null);

  // Audio refs — P3/P4 (single toggle)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const hasSaved = useRef(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  // ─── Progress persistence ───────────────────────────────────────────────────

  // Check for saved progress on mount (don't auto-restore — let user choose)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const { phase: p } = JSON.parse(saved);
      if (p && p !== "intro" && p !== "done") setHasSavedProgress(true);
    } catch {
      // ignore corrupted data
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save on every meaningful state change
  useEffect(() => {
    if (phase === "intro" || phase === "done") return;
    localStorage.setItem(storageKey, JSON.stringify({
      phase, currentIndex, currentPassageIndex, allAnswers, currentAnswers,
    }));
  }, [phase, currentIndex, currentPassageIndex, allAnswers, currentAnswers, storageKey]);

  // ─── Phase helpers ──────────────────────────────────────────────────────────

  function goToPhase(next: Phase) {
    stopMultiAudio();
    stopSingleAudio();
    setCurrentIndex(0);
    setHasPlayedAudio(false);
    setIsPlaying(false);
    setCurrentPassageIndex(0);
    setCurrentAnswers({});
    setShowQuitConfirm(false);
    setPhase(next);
  }

  // ─── Audio: P1/P2 (sequential) ─────────────────────────────────────────────

  function stopMultiAudio() {
    if (currentAudioKeyRef.current) {
      const el = audioRefs.current[currentAudioKeyRef.current];
      if (el) { el.pause(); el.currentTime = 0; }
    }
    setIsPlaying(false);
    currentAudioKeyRef.current = null;
  }

  async function handleAudioToggleP1() {
    if (isPlaying) { stopMultiAudio(); return; }
    const q = config.p1[currentIndex];
    if (!q?.audio_urls) { setHasPlayedAudio(true); return; }
    setIsPlaying(true);
    setHasPlayedAudio(true);
    const keys = ["A", "B", "C", "D"] as const;
    for (const key of keys) {
      const url = q.audio_urls[key];
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

  async function handleAudioToggleP2() {
    if (isPlaying) { stopMultiAudio(); return; }
    const q = config.p2[currentIndex];
    if (!q) return;
    setIsPlaying(true);
    setHasPlayedAudio(true);
    const urls: string[] = [
      q.question_audio_url,
      q.option_audio_urls?.A,
      q.option_audio_urls?.B,
      q.option_audio_urls?.C,
    ].filter((u): u is string => !!u);
    for (const url of urls) {
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

  // ─── Audio: P3/P4 (toggle) ─────────────────────────────────────────────────

  function stopSingleAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }

  function handleAudioToggleP3P4(url: string) {
    if (isPlaying) { stopSingleAudio(); return; }
    if (audioUrlRef.current !== url) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(url);
      audioUrlRef.current = url;
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }
    audioRef.current!.currentTime = 0;
    audioRef.current!.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
    setHasPlayedAudio(true);
  }

  // ─── Save ──────────────────────────────────────────────────────────────────

  async function saveAndFinish(finalAnswers: DiagAnswers) {
    if (hasSaved.current) return;
    hasSaved.current = true;
    localStorage.removeItem(storageKey);
    const { score } = computeScore(finalAnswers, config);
    setSaving(true);
    const supabase = createClient();
    await supabase.rpc("save_diagnostic", { p_score: score, p_answers: finalAnswers });
    setSaving(false);
    setSavedResult({ score, answers: finalAnswers });
    setPhase("done");
  }

  function handleResume() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const { phase: p, currentIndex: ci, currentPassageIndex: cpi, allAnswers: aa, currentAnswers: ca } = JSON.parse(saved);
      if (!p || p === "intro" || p === "done") return;
      setPhase(p);
      setCurrentIndex(ci ?? 0);
      setCurrentPassageIndex(cpi ?? 0);
      setAllAnswers(aa ?? { p1: {}, p2: {}, p3: {}, p4: {}, p5: {}, p6_0: {}, p6_1: {}, p7_0: {}, p7_1: {} });
      setCurrentAnswers(ca ?? {});
      setHasPlayedAudio(false);
      setIsPlaying(false);
    } catch {
      // ignore corrupted data
    }
  }

  // ─── Quit dialog ────────────────────────────────────────────────────────────

  const quitDialog = (
    <div className="relative mb-4 w-fit">
      <button
        onClick={() => setShowQuitConfirm((v) => !v)}
        title="Quitter le test"
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {showQuitConfirm && (
        <div className="absolute top-10 left-0 z-20 w-72 bg-white rounded-xl border border-gray-200 shadow-lg p-4">
          <p className="text-sm text-gray-700 mb-3">Êtes-vous sûr de vouloir quitter le test ?</p>
          <div className="flex gap-2">
            <button
              onClick={() => { setPhase("intro"); setHasSavedProgress(true); setShowQuitConfirm(false); }}
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
  );

  // ─── Done / Saving ─────────────────────────────────────────────────────────

  if (phase === "done") {
    if (saving) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Enregistrement…</p>
          </div>
        </div>
      );
    }
    if (savedResult) {
      return (
        <DiagnosticResults
          result={{
            user_id: "",
            completed_at: new Date().toISOString(),
            score: savedResult.score,
            answers: savedResult.answers,
          }}
          config={config}
        />
      );
    }
  }

  // ─── Intro ─────────────────────────────────────────────────────────────────

  if (phase === "intro") {
    const examParts = [
      { label: "Partie 1 – Photos", count: "2 questions" },
      { label: "Partie 2 – Questions-réponses", count: "2 questions" },
      { label: "Partie 3 – Conversation", count: "2 questions" },
      { label: "Partie 4 – Monologue", count: "2 questions" },
      { label: "Partie 5 – Phrases incomplètes", count: "2 questions" },
      { label: "Partie 6 – Textes lacunaires", count: "8 questions" },
      { label: "Partie 7 – Compréhension de textes", count: "4 questions" },
    ];

    return (
      <div className="p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-3">
          Test de niveau — TOEIC
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Diagnostique ton niveau</h1>
        <p className="text-sm text-gray-500 mb-6">
          22 questions sur les 7 parties officielles du TOEIC. Aucune correction en cours de route — les résultats s&apos;affichent à la fin.
        </p>

        <div className="rounded-xl border border-gray-100 overflow-hidden mb-3">
          {examParts.map((p, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                i < examParts.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-gray-700">{p.label}</span>
              <span className="text-xs font-medium text-gray-400 tabular-nums">{p.count}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mb-6">Durée estimée : ~5 minutes</p>

        {hasSavedProgress ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleResume}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 cursor-pointer w-full"
            >
              Reprendre le test →
            </button>
            <button
              onClick={() => { localStorage.removeItem(storageKey); setHasSavedProgress(false); goToPhase("p1"); }}
              className="border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 cursor-pointer w-full"
            >
              Recommencer depuis le début
            </button>
          </div>
        ) : (
          <button
            onClick={() => goToPhase("p1")}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 cursor-pointer w-full"
          >
            Commencer le test →
          </button>
        )}
      </div>
    );
  }

  // ─── P1 ───────────────────────────────────────────────────────────────────

  if (phase === "p1") {
    const q = config.p1[currentIndex];
    const isLast = currentIndex === config.p1.length - 1;
    const progress = (currentIndex / config.p1.length) * 100;

    function getP1ButtonStyle(): string {
      const base = "flex-1 min-w-0 text-left px-4 py-3 rounded-xl border text-sm transition-colors duration-150";
      if (!hasPlayedAudio) return `${base} border-gray-100 text-gray-300 cursor-not-allowed`;
      return `${base} border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800 cursor-pointer`;
    }

    function handleP1Select(key: string) {
      if (!hasPlayedAudio) return;
      setAllAnswers((prev) => ({ ...prev, p1: { ...prev.p1, [currentIndex]: key } }));
      stopMultiAudio();
      if (isLast) {
        goToPhase("p2");
      } else {
        setCurrentIndex((i) => i + 1);
        setHasPlayedAudio(false);
      }
    }

    return (
      <div className="p-6 md:p-8">
        {quitDialog}

        <div className="mb-2">
          <p className="text-xs font-medium text-gray-500">
            Partie 1 — Question {currentIndex + 1} / {config.p1.length}
          </p>
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full flex justify-center mb-5">
          <div className="relative w-80 h-80 rounded-xl overflow-hidden bg-gray-100">
            {q?.image_url && (
              <img
                src={q.image_url}
                alt={`Question ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={handleAudioToggleP1}
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

        <div className="grid grid-cols-2 gap-3">
          {OPTION_KEYS.map((key, i) => {
            if (!q?.statements[i]) return null;
            return (
              <button
                key={key}
                onClick={() => handleP1Select(key)}
                disabled={!hasPlayedAudio}
                className={getP1ButtonStyle()}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── P2 ───────────────────────────────────────────────────────────────────

  if (phase === "p2") {
    const isLast = currentIndex === config.p2.length - 1;
    const progress = (currentIndex / config.p2.length) * 100;

    function getP2ButtonStyle(): string {
      const base = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors duration-150";
      if (!hasPlayedAudio) return `${base} border-gray-100 text-gray-300 cursor-not-allowed`;
      return `${base} border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800 cursor-pointer`;
    }

    function handleP2Select(key: string) {
      if (!hasPlayedAudio) return;
      setAllAnswers((prev) => ({ ...prev, p2: { ...prev.p2, [currentIndex]: key } }));
      stopMultiAudio();
      if (isLast) {
        goToPhase("p3");
      } else {
        setCurrentIndex((i) => i + 1);
        setHasPlayedAudio(false);
      }
    }

    return (
      <div className="p-6 md:p-8">
        {quitDialog}

        <div className="mb-2">
          <p className="text-xs font-medium text-gray-500">
            Partie 2 — Question {currentIndex + 1} / {config.p2.length}
          </p>
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-center mb-5">
          <button
            onClick={handleAudioToggleP2}
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
                Écouter
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {P2_OPTION_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleP2Select(key)}
              disabled={!hasPlayedAudio}
              className={getP2ButtonStyle()}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── P3 ───────────────────────────────────────────────────────────────────

  if (phase === "p3") {
    const questions = config.p3.questions.slice(-2);
    const allAnswered = Object.keys(currentAnswers).length === questions.length;
    const audioUrl = config.p3.audio_url;

    function getP3OptionStyle(qIdx: number, key: string): string {
      const base = "w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors duration-150 flex items-center gap-3";
      if (!hasPlayedAudio) return `${base} border-gray-100 text-gray-300 cursor-not-allowed`;
      if (currentAnswers[qIdx] === key) return `${base} border-[#7c3aed] bg-[#faf5ff] text-[#7c3aed] cursor-pointer`;
      return `${base} border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800 cursor-pointer`;
    }

    function getP3BadgeStyle(qIdx: number, key: string): string {
      const base = "shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center";
      if (!hasPlayedAudio) return `${base} bg-gray-100 text-gray-300`;
      if (currentAnswers[qIdx] === key) return `${base} bg-[#7c3aed] text-white`;
      return `${base} bg-gray-100 text-gray-500`;
    }

    return (
      <div className="p-6 md:p-8">
        {quitDialog}

        <div className="mb-2">
          <p className="text-xs font-medium text-gray-500">Partie 3 — Conversation</p>
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full mb-5 overflow-hidden">
          <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: "0%" }} />
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => audioUrl && handleAudioToggleP3P4(audioUrl)}
            disabled={!audioUrl}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="flex flex-col gap-6 mb-6">
          {questions.map((q, qIdx) => (
            <div key={qIdx}>
              <p className="text-sm font-semibold text-gray-800 mb-3">
                {qIdx + 1}. {q.text}
              </p>
              <div className="flex flex-col gap-2">
                {OPTION_KEYS.map((key, optIdx) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (!hasPlayedAudio) return;
                      setCurrentAnswers((prev) => ({ ...prev, [qIdx]: key }));
                    }}
                    disabled={!hasPlayedAudio}
                    className={getP3OptionStyle(qIdx, key)}
                  >
                    <span className={getP3BadgeStyle(qIdx, key)}>{key}</span>
                    <span>{q.options[optIdx]?.replace(/^\([A-D]\)\s*/, "") ?? ""}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!allAnswered) return;
              setAllAnswers((prev) => ({ ...prev, p3: currentAnswers }));
              stopSingleAudio();
              goToPhase("p4");
            }}
            disabled={!allAnswered}
            className={`font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 ${
              allAnswered
                ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Partie suivante →
          </button>
        </div>
      </div>
    );
  }

  // ─── P4 ───────────────────────────────────────────────────────────────────

  if (phase === "p4") {
    const questions = config.p4.questions.slice(-2);
    const allAnswered = Object.keys(currentAnswers).length === questions.length;
    const audioUrl = config.p4.audio_url;

    function getP4OptionStyle(qIdx: number, key: string): string {
      const base = "w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors duration-150 flex items-center gap-3";
      if (!hasPlayedAudio) return `${base} border-gray-100 text-gray-300 cursor-not-allowed`;
      if (currentAnswers[qIdx] === key) return `${base} border-[#7c3aed] bg-[#faf5ff] text-[#7c3aed] cursor-pointer`;
      return `${base} border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800 cursor-pointer`;
    }

    function getP4BadgeStyle(qIdx: number, key: string): string {
      const base = "shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center";
      if (!hasPlayedAudio) return `${base} bg-gray-100 text-gray-300`;
      if (currentAnswers[qIdx] === key) return `${base} bg-[#7c3aed] text-white`;
      return `${base} bg-gray-100 text-gray-500`;
    }

    return (
      <div className="p-6 md:p-8">
        {quitDialog}

        <div className="mb-2">
          <p className="text-xs font-medium text-gray-500">Partie 4 — Monologue</p>
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full mb-5 overflow-hidden">
          <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: "0%" }} />
        </div>

        {config.p4.graphic && config.p4.graphic_title && (
          <div className="mb-5 rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {config.p4.graphic_title}
              </p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(config.p4.graphic).map(([k, v], i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-2.5 text-gray-600 font-medium w-1/2">{k}</td>
                    <td className="px-4 py-2.5 text-gray-800">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <button
            onClick={() => audioUrl && handleAudioToggleP3P4(audioUrl)}
            disabled={!audioUrl}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                Écouter le monologue
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-6 mb-6">
          {questions.map((q, qIdx) => (
            <div key={qIdx}>
              <p className="text-sm font-semibold text-gray-800 mb-3">
                {qIdx + 1}. {q.text}
              </p>
              <div className="flex flex-col gap-2">
                {OPTION_KEYS.map((key, optIdx) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (!hasPlayedAudio) return;
                      setCurrentAnswers((prev) => ({ ...prev, [qIdx]: key }));
                    }}
                    disabled={!hasPlayedAudio}
                    className={getP4OptionStyle(qIdx, key)}
                  >
                    <span className={getP4BadgeStyle(qIdx, key)}>{key}</span>
                    <span>{q.options[optIdx]?.replace(/^\([A-D]\)\s*/, "") ?? ""}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!allAnswered) return;
              setAllAnswers((prev) => ({ ...prev, p4: currentAnswers }));
              stopSingleAudio();
              goToPhase("p5");
            }}
            disabled={!allAnswered}
            className={`font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 ${
              allAnswered
                ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Partie suivante →
          </button>
        </div>
      </div>
    );
  }

  // ─── P5 ───────────────────────────────────────────────────────────────────

  if (phase === "p5") {
    const q = config.p5[currentIndex];
    const isLast = currentIndex === config.p5.length - 1;
    const progress = (currentIndex / config.p5.length) * 100;
    const parts = q?.text.split(/_{2,}/) ?? [];

    return (
      <div className="p-6 md:p-8">
        {quitDialog}

        <div className="mb-2">
          <p className="text-xs font-medium text-gray-500">
            Partie 5 — Question {currentIndex + 1} / {config.p5.length}
          </p>
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-6 rounded-xl bg-gray-50 border border-gray-100 px-5 py-4">
          <p className="text-base text-gray-900 leading-relaxed font-medium">
            {parts.length >= 2 ? (
              <>
                {parts[0]}
                <span className="inline-flex items-center rounded-md px-2 py-0.5 mx-0.5 text-sm font-semibold border border-[#7c3aed]/30 bg-[#7c3aed]/10 text-[#7c3aed]">
                  ________
                </span>
                {parts[1]}
              </>
            ) : (
              q?.text
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {OPTION_KEYS.map((key, idx) => (
            <button
              key={key}
              onClick={() => {
                setAllAnswers((prev) => ({ ...prev, p5: { ...prev.p5, [currentIndex]: key } }));
                if (isLast) {
                  goToPhase("p6");
                } else {
                  setCurrentIndex((i) => i + 1);
                }
              }}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800 text-sm transition-colors duration-150 flex items-center gap-3 cursor-pointer"
            >
              <span className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center bg-gray-100 text-gray-500">
                {key}
              </span>
              <span>{q?.options[idx]?.replace(/^\([A-D]\)\s*/, "") ?? ""}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── P6 ───────────────────────────────────────────────────────────────────

  if (phase === "p6") {
    const passage = config.p6[currentPassageIndex];
    const isLastPassage = currentPassageIndex === config.p6.length - 1;
    const allSelected = Object.keys(currentAnswers).length === (passage?.questions.length ?? 0);
    const progressPct = (currentPassageIndex / config.p6.length) * 100;

    function getP6OptionStyle(qIdx: number, key: string): string {
      const base = "w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors duration-150 flex items-center gap-3";
      if (currentAnswers[qIdx] === key) return `${base} border-[#7c3aed] bg-[#faf5ff] text-[#7c3aed] cursor-pointer`;
      return `${base} border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800 cursor-pointer`;
    }

    function getP6BadgeStyle(qIdx: number, key: string): string {
      const base = "shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center";
      if (currentAnswers[qIdx] === key) return `${base} bg-[#7c3aed] text-white`;
      return `${base} bg-gray-100 text-gray-500`;
    }

    return (
      <div className="p-6 md:p-8">
        {quitDialog}

        <div className="mb-2">
          <p className="text-xs font-medium text-gray-500">
            Partie 6 — Texte {currentPassageIndex + 1} / {config.p6.length}
          </p>
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="mb-6 rounded-xl bg-gray-50 border border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#7c3aed] bg-[#ede9fe] rounded-md px-2 py-0.5">
              {DOCTYPE_LABELS_P6[passage?.doctype ?? ""] ?? passage?.doctype ?? "Texte"}
            </span>
            {passage?.title && (
              <span className="text-xs text-gray-400 font-medium">{passage.title}</span>
            )}
          </div>
          <div className="text-sm text-gray-800 leading-relaxed">
            {passage && renderPassageText(passage.text)}
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-6">
          {passage?.questions.map((question, qIdx) => (
            <div key={qIdx}>
              <p className="text-sm font-semibold text-gray-700 mb-3">Q.[{qIdx + 1}]</p>
              <div className="flex flex-col gap-2">
                {OPTION_KEYS.map((key, idx) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentAnswers((prev) => ({ ...prev, [qIdx]: key }));
                    }}
                    className={getP6OptionStyle(qIdx, key)}
                  >
                    <span className={getP6BadgeStyle(qIdx, key)}>{key}</span>
                    <span>{question.options[idx]?.replace(/^\([A-D]\)\s*/, "") ?? ""}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!allSelected) return;
              const ansKey = currentPassageIndex === 0 ? "p6_0" : "p6_1";
              setAllAnswers((prev) => ({ ...prev, [ansKey]: currentAnswers }));
              if (isLastPassage) {
                goToPhase("p7");
              } else {
                setCurrentPassageIndex((i) => i + 1);
                setCurrentAnswers({});
              }
            }}
            disabled={!allSelected}
            className={`font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 ${
              allSelected
                ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLastPassage ? "Partie suivante →" : "Texte suivant →"}
          </button>
        </div>
      </div>
    );
  }

  // ─── P7 ───────────────────────────────────────────────────────────────────

  if (phase === "p7") {
    const passage = config.p7[currentPassageIndex];
    const questions = passage?.questions.slice(-2) ?? [];
    const isLastPassage = currentPassageIndex === config.p7.length - 1;
    const allSelected = Object.keys(currentAnswers).length === questions.length;
    const progressPct = (currentPassageIndex / config.p7.length) * 100;
    const doc = passage?.documents[0];

    function getP7OptionStyle(qIdx: number, key: string): string {
      const base = "w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors duration-150 flex items-center gap-3";
      if (currentAnswers[qIdx] === key) return `${base} border-[#7c3aed] bg-[#faf5ff] text-[#7c3aed] cursor-pointer`;
      return `${base} border-gray-200 hover:border-[#c4a0f0] hover:bg-[#faf6ff] text-gray-800 cursor-pointer`;
    }

    function getP7BadgeStyle(qIdx: number, key: string): string {
      const base = "shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center";
      if (currentAnswers[qIdx] === key) return `${base} bg-[#7c3aed] text-white`;
      return `${base} bg-gray-100 text-gray-500`;
    }

    return (
      <div className="p-6 md:p-8">
        {quitDialog}

        <div className="mb-2">
          <p className="text-xs font-medium text-gray-500">
            Partie 7 — Texte {currentPassageIndex + 1} / {config.p7.length}
          </p>
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {doc && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#7c3aed] bg-[#ede9fe] rounded-md px-2 py-0.5">
              {DOCTYPE_LABELS_P7[doc.doctype] ?? doc.doctype}
            </span>
            {doc.title && (
              <span className="text-xs text-gray-400 font-medium">{doc.title}</span>
            )}
          </div>
        )}

        {doc && (
          <div className="mb-6 rounded-xl bg-gray-50 border border-gray-100 px-5 py-4">
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{doc.text}</p>
          </div>
        )}

        <div className="flex flex-col gap-6 mb-6">
          {questions.map((question, qIdx) => (
            <div key={qIdx}>
              <p className="text-sm font-semibold text-gray-800 mb-3">
                {qIdx + 1}. {question.text}
              </p>
              <div className="flex flex-col gap-2">
                {OPTION_KEYS.map((key, idx) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentAnswers((prev) => ({ ...prev, [qIdx]: key }));
                    }}
                    className={getP7OptionStyle(qIdx, key)}
                  >
                    <span className={getP7BadgeStyle(qIdx, key)}>{key}</span>
                    <span>{question.options[idx]?.replace(/^\([A-D]\)\s*/, "") ?? ""}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!allSelected) return;
              const ansKey = currentPassageIndex === 0 ? "p7_0" : "p7_1";
              const newAnswers = { ...allAnswers, [ansKey]: currentAnswers };
              setAllAnswers(newAnswers);
              if (isLastPassage) {
                saveAndFinish(newAnswers);
              } else {
                setCurrentPassageIndex((i) => i + 1);
                setCurrentAnswers({});
              }
            }}
            disabled={!allSelected}
            className={`font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 ${
              allSelected
                ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLastPassage ? "Voir les résultats →" : "Texte suivant →"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
