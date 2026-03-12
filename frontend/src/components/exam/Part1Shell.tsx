"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Part1Intro from "@/components/exam/Part1Intro";
import Part1Question from "@/components/exam/Part1Question";
import type { ExamP1Question } from "@/types/exam-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type P1QuestionData = ExamP1Question;
type AudioMap = Record<"A" | "B" | "C" | "D", HTMLAudioElement>;

// ─── Config ───────────────────────────────────────────────────────────────────
const AUDIO_SEQUENCE = ["A", "B", "C", "D"] as const;

// ─── Audio helpers ────────────────────────────────────────────────────────────

function buildAudioMap(urls: { A: string; B: string; C: string; D: string }): AudioMap {
  const map = {} as AudioMap;
  for (const letter of AUDIO_SEQUENCE) {
    const el = new Audio(urls[letter]);
    el.preload = "auto";
    map[letter] = el;
  }
  return map;
}

function destroyAudioMap(map: AudioMap) {
  for (const el of Object.values(map)) {
    el.pause();
    el.src = "";
  }
}

// ─── Shell ────────────────────────────────────────────────────────────────────

interface Part1ShellProps {
  onStart?: () => void;
  onComplete?: (answers: Record<number, string>) => void;
  onAnswersChange?: (answers: Record<number, string>) => void;
  inExam?: boolean;
  questions: P1QuestionData[];
  /** Admin-only: shows a per-question skip button */
  isAdmin?: boolean;
  /** When inExam, adds an exam-wide numbering offset (1-based display) */
  questionNumberOffset?: number;
  /** When inExam, display total questions across the whole exam (e.g. 200) */
  examTotalQuestions?: number;
}

export default function Part1Shell({
  onStart,
  onComplete,
  onAnswersChange,
  inExam = false,
  questions: questionsData,
  isAdmin = false,
  questionNumberOffset = 0,
  examTotalQuestions,
}: Part1ShellProps) {
  const PART1_TOTAL = questionsData.length;

  // ─── Visual state ──────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<"intro" | "questions" | "done">("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // ─── Refs ─────────────────────────────────────────────────────────────────
  const audioCacheRef = useRef<Map<number, AudioMap>>(new Map());
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  const onAnswersChangeRef = useRef(onAnswersChange);
  useEffect(() => {
    onAnswersChangeRef.current = onAnswersChange;
  }, [onAnswersChange]);
  // Keep a fresh copy of answers for the async auto-advance timer.
  const answersRef = useRef<Record<number, string>>({});
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ─── Preloading ────────────────────────────────────────────────────────────

  const preloadQuestion = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= questionsData.length) return;
      const q = questionsData[idx];
      if (!q?.audio_urls) return;
      if (audioCacheRef.current.has(idx)) return;
      audioCacheRef.current.set(idx, buildAudioMap(q.audio_urls));
    },
    [questionsData]
  );

  // Preload Q0 during the intro screen.
  // Depends on preloadQuestion so it re-runs if questionsData changes (e.g. async
  // localStorage hydration in ExamShell), clearing any stale cached audio first.
  useEffect(() => {
    for (const map of audioCacheRef.current.values()) destroyAudioMap(map);
    audioCacheRef.current.clear();
    preloadQuestion(0);
    return () => {
      for (const map of audioCacheRef.current.values()) destroyAudioMap(map);
      audioCacheRef.current.clear();
    };
  }, [preloadQuestion]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    onStart?.();
    setPhase("questions");
    setQuestionIndex(0);
  }, [onStart]);

  const handleSelect = useCallback(
    (answer: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionIndex]: answer };
        onAnswersChangeRef.current?.(next);
        return next;
      });
    },
    [questionIndex]
  );

  // Called when Part1Question enters grace period — preload the next question.
  const handleGraceStart = useCallback(
    (idx: number) => {
      preloadQuestion(idx + 1);
    },
    [preloadQuestion]
  );

  // Called when Part1Question's grace countdown reaches 0 — advance.
  const handleAutoAdvance = useCallback(
    (idx: number) => {
      const done = audioCacheRef.current.get(idx);
      if (done) {
        destroyAudioMap(done);
        audioCacheRef.current.delete(idx);
      }

      const next = idx + 1;
      if (next >= PART1_TOTAL) {
        setPhase("done");
        onCompleteRef.current?.(answersRef.current);
        return;
      }

      setQuestionIndex(next);
    },
    [PART1_TOTAL]
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  const currentQuestion = questionsData[questionIndex];
  const shownNumber = (inExam ? questionNumberOffset : 0) + (questionIndex + 1);
  const shownTotal = inExam ? (examTotalQuestions ?? 200) : PART1_TOTAL;

  return (
    <>
      {phase === "intro" && (
        <Part1Intro onStart={handleStart} inExam={inExam} />
      )}

      {phase === "questions" && (
        <>
          <Part1Question
            key={questionIndex}
            questionIndex={questionIndex}
            totalQuestions={PART1_TOTAL}
            displayQuestionNumber={shownNumber}
            displayTotalQuestions={shownTotal}
            selectedAnswer={answers[questionIndex] ?? null}
            onSelect={handleSelect}
            imageUrl={currentQuestion?.image_url}
            audioUrls={currentQuestion?.audio_urls}
            preloadedAudios={audioCacheRef.current.get(questionIndex)}
            onGraceStart={() => handleGraceStart(questionIndex)}
            onAutoAdvance={() => handleAutoAdvance(questionIndex)}
          />
          {isAdmin && (
            <div className="flex justify-end px-8 pb-5">
              <button
                onClick={() => handleAutoAdvance(questionIndex)}
                className="text-xs text-gray-400 hover:text-[#6600CC] border border-gray-200 hover:border-[#6600CC] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              >
                ⏭ Passer
              </button>
            </div>
          )}
        </>
      )}

      {phase === "done" && (
        <div className="px-10 py-14 flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Partie 1 terminée
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {Object.keys(answers).length} réponse
              {Object.keys(answers).length > 1 ? "s" : ""} sur {PART1_TOTAL}{" "}
              question
              {PART1_TOTAL > 1 ? "s" : ""}
            </p>
          </div>
          {!inExam && (
            <p className="text-xs text-gray-400">
              Exercice terminé. Revenez quand vous le souhaitez.
            </p>
          )}
        </div>
      )}
    </>
  );
}
