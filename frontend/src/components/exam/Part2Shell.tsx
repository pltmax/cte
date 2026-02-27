"use client";

import { useState, useCallback } from "react";
import Part2Intro from "@/components/exam/Part2Intro";
import Part2Batch from "@/components/exam/Part2Batch";
import rawP2 from "@mockdata/TOEIC/listening_part2/part2_transcript.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface P2QuestionData {
  question: string;
  options: string[];
  answer: string;
  // Populated by scripts/gcs/upload_to_gcs.py after GCS upload
  question_audio_url?: string;
  option_audio_urls?: { A: string; B: string; C: string };
}

// ─── Config ───────────────────────────────────────────────────────────────────

const p2Data = rawP2 as { questions: P2QuestionData[] };
const PART2_TOTAL = 25; // TOEIC Part 2 uses 25 questions
const BATCH_SIZE = 5;

// ─── Shell ────────────────────────────────────────────────────────────────────

interface Part2ShellProps {
  /** Called when user clicks "Commencer la partie 2" — use to resume timer */
  onStart?: () => void;
  /** Called when all 25 questions are answered */
  onComplete?: () => void;
  /** Controls copy in Part2Intro ("Le minuteur reprend…" vs default) */
  inExam?: boolean;
}

export default function Part2Shell({
  onStart,
  onComplete,
  inExam = false,
}: Part2ShellProps) {
  const [phase, setPhase] = useState<"intro" | "questions" | "done">("intro");
  // First global question index of the current batch (0-based)
  const [batchStart, setBatchStart] = useState(0);
  // All answers keyed by global 0-based question index
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const batchIndex = Math.floor(batchStart / BATCH_SIZE);
  const batchSize = Math.min(BATCH_SIZE, PART2_TOTAL - batchStart);

  const handleStart = useCallback(() => {
    onStart?.();
    setPhase("questions");
  }, [onStart]);

  const handleSelect = useCallback(
    (localIndex: number, letter: string) => {
      setAnswers((prev) => ({ ...prev, [batchStart + localIndex]: letter }));
    },
    [batchStart]
  );

  const handleBatchComplete = useCallback(() => {
    const nextStart = batchStart + batchSize;
    if (nextStart >= PART2_TOTAL) {
      setPhase("done");
      onComplete?.();
    } else {
      setBatchStart(nextStart);
    }
  }, [batchStart, batchSize, onComplete]);

  // Slice the question audio data for the current batch
  const batchQuestions = p2Data.questions.slice(batchStart, batchStart + batchSize);
  const questionAudios = batchQuestions.map((q) => ({
    questionAudioUrl: q.question_audio_url,
    optionAudioUrls: q.option_audio_urls,
  }));

  return (
    <>
      {phase === "intro" && (
        <Part2Intro onStart={handleStart} inExam={inExam} />
      )}

      {phase === "questions" && (
        // key forces full remount on each new batch → resets all timers
        <Part2Batch
          key={batchIndex}
          batchIndex={batchIndex}
          batchSize={batchSize}
          startQuestionNumber={batchStart + 1}
          totalQuestions={PART2_TOTAL}
          answers={
            Object.fromEntries(
              Object.entries(answers)
                .filter(([k]) => {
                  const g = Number(k);
                  return g >= batchStart && g < batchStart + batchSize;
                })
                .map(([k, v]) => [Number(k) - batchStart, v])
            )
          }
          onSelect={handleSelect}
          onBatchComplete={handleBatchComplete}
          questionAudios={questionAudios}
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
              Partie 2 terminée
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {Object.keys(answers).length} réponse
              {Object.keys(answers).length > 1 ? "s" : ""} sur {PART2_TOTAL}{" "}
              question
              {PART2_TOTAL > 1 ? "s" : ""}
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
