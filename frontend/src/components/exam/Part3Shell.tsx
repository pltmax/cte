"use client";

import { useState, useCallback } from "react";
import Part3Intro from "@/components/exam/Part3Intro";
import Part3Conversation from "@/components/exam/Part3Conversation";
import rawP3 from "@mockdata/TOEIC/listening_part3/part3_transcript.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface P3Question {
  text: string;
  options: string[];
  answer: string;
}

interface P3Conv {
  dialogue: Array<{ speaker: string; text: string }>;
  questions: P3Question[];
  // Populated by scripts/gcs/upload_to_gcs.py after GCS upload
  audio_url?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const p3Data = rawP3 as { conversations: P3Conv[] };
const QUESTIONS_PER_CONV = 3;
const TOTAL_CONVS = Math.min(13, p3Data.conversations.length); // 13 for TOEIC Part 3
const PART3_TOTAL = TOTAL_CONVS * QUESTIONS_PER_CONV;

// ─── Shell ────────────────────────────────────────────────────────────────────

interface Part3ShellProps {
  onStart?: () => void;
  onComplete?: () => void;
  inExam?: boolean;
}

export default function Part3Shell({
  onStart,
  onComplete,
  inExam = false,
}: Part3ShellProps) {
  const [phase, setPhase] = useState<"intro" | "questions" | "done">("intro");
  const [conversationIndex, setConversationIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // keyed by global 0-based index

  const convStart = conversationIndex * QUESTIONS_PER_CONV;

  const handleStart = useCallback(() => {
    onStart?.();
    setPhase("questions");
  }, [onStart]);

  const handleSelect = useCallback(
    (localIndex: number, letter: string) => {
      setAnswers((prev) => ({ ...prev, [convStart + localIndex]: letter }));
    },
    [convStart]
  );

  const handleConversationComplete = useCallback(() => {
    const next = conversationIndex + 1;
    if (next >= TOTAL_CONVS) {
      setPhase("done");
      onComplete?.();
    } else {
      setConversationIndex(next);
    }
  }, [conversationIndex, onComplete]);

  const currentConv = p3Data.conversations[conversationIndex];

  return (
    <>
      {phase === "intro" && (
        <Part3Intro onStart={handleStart} inExam={inExam} />
      )}

      {phase === "questions" && (
        // key forces full remount on each new conversation → resets timers
        <Part3Conversation
          key={conversationIndex}
          conversationIndex={conversationIndex}
          totalConversations={TOTAL_CONVS}
          startQuestionNumber={convStart + 1}
          totalQuestions={PART3_TOTAL}
          answers={Object.fromEntries(
            Object.entries(answers)
              .filter(([k]) => {
                const g = Number(k);
                return g >= convStart && g < convStart + QUESTIONS_PER_CONV;
              })
              .map(([k, v]) => [Number(k) - convStart, v])
          )}
          onSelect={handleSelect}
          onConversationComplete={handleConversationComplete}
          audioUrl={currentConv?.audio_url}
          questions={currentConv?.questions}
        />
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
              Partie 3 terminée
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {Object.keys(answers).length} réponse
              {Object.keys(answers).length > 1 ? "s" : ""} sur {PART3_TOTAL}{" "}
              question
              {PART3_TOTAL > 1 ? "s" : ""}
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
