/**
 * TOEIC Listening & Reading — scoring utilities.
 *
 * Raw score (correct answers out of 100 per section) → scaled score (5–495)
 * via a 101-entry lookup table derived from the standard ETS conversion tables
 * used in official TOEIC preparation materials.
 *
 * Anchors used for interpolation:
 *   Listening: 0→5, 5→20, 10→45, 15→70, 20→95, 25→120, 30→150, 35→180,
 *              40→210, 45→240, 50→270, 55→300, 60→325, 65→350, 70→375,
 *              75→400, 80→425, 85→450, 90→470, 95→485, 100→495
 *   Reading:   0→5, 5→20, 10→40, 15→65, 20→90, 25→115, 30→145, 35→175,
 *              40→205, 45→235, 50→265, 55→295, 60→320, 65→350, 70→380,
 *              75→410, 80→435, 85→455, 90→470, 95→483, 100→495
 */

import type { ExamData } from "@/types/exam-data";

// ─── Conversion tables (index = raw score 0–100) ─────────────────────────────

const LISTENING_TABLE: readonly number[] = [
    5,   8,  11,  14,  17,  20,  25,  30,  35,  40,  // 0–9
   45,  50,  55,  60,  65,  70,  75,  80,  85,  90,  // 10–19
   95, 100, 105, 110, 115, 120, 126, 132, 138, 144,  // 20–29
  150, 156, 162, 168, 174, 180, 186, 192, 198, 204,  // 30–39
  210, 216, 222, 228, 234, 240, 246, 252, 258, 264,  // 40–49
  270, 276, 282, 288, 294, 300, 305, 310, 315, 320,  // 50–59
  325, 330, 335, 340, 345, 350, 355, 360, 365, 370,  // 60–69
  375, 380, 385, 390, 395, 400, 405, 410, 415, 420,  // 70–79
  425, 430, 435, 440, 445, 450, 454, 458, 462, 466,  // 80–89
  470, 473, 476, 479, 482, 485, 487, 489, 491, 493,  // 90–99
  495,                                                 // 100
];

const READING_TABLE: readonly number[] = [
    5,   8,  11,  14,  17,  20,  24,  28,  32,  36,  // 0–9
   40,  45,  50,  55,  60,  65,  70,  75,  80,  85,  // 10–19
   90,  95, 100, 105, 110, 115, 121, 127, 133, 139,  // 20–29
  145, 151, 157, 163, 169, 175, 181, 187, 193, 199,  // 30–39
  205, 211, 217, 223, 229, 235, 241, 247, 253, 259,  // 40–49
  265, 271, 277, 283, 289, 295, 300, 305, 310, 315,  // 50–59
  320, 326, 332, 338, 344, 350, 356, 362, 368, 374,  // 60–69
  380, 386, 392, 398, 404, 410, 415, 420, 425, 430,  // 70–79
  435, 439, 443, 447, 451, 455, 458, 461, 464, 467,  // 80–89
  470, 473, 475, 478, 480, 483, 485, 488, 490, 493,  // 90–99
  495,                                                 // 100
];

// ─── Types ────────────────────────────────────────────────────────────────────

export type PartAnswers = Record<number, string>;

export interface AllExamAnswers {
  p1: PartAnswers;
  p2: PartAnswers;
  p3: PartAnswers;
  p4: PartAnswers;
  p5: PartAnswers;
  p6: PartAnswers;
  p7: PartAnswers;
}

export interface ScoreResult {
  listeningRaw: number;
  readingRaw: number;
  listeningScore: number;
  readingScore: number;
  totalScore: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scaleListening(raw: number): number {
  const clamped = Math.max(0, Math.min(100, raw));
  return LISTENING_TABLE[clamped];
}

function scaleReading(raw: number): number {
  const clamped = Math.max(0, Math.min(100, raw));
  return READING_TABLE[clamped];
}

function countCorrect(
  answers: PartAnswers,
  correctAnswers: string[]
): number {
  let correct = 0;
  for (let i = 0; i < correctAnswers.length; i++) {
    if (answers[i]?.toUpperCase() === correctAnswers[i]?.toUpperCase()) {
      correct++;
    }
  }
  return correct;
}

// ─── Main scoring function ────────────────────────────────────────────────────

/**
 * Scores a completed exam against the exam data's correct answers.
 * Returns raw and scaled scores for each section and the total.
 */
export function scoreExam(
  allAnswers: AllExamAnswers,
  examData: ExamData
): ScoreResult {
  // ── Part 1 — Photographies (6 questions) ──────────────────────────────────
  const p1Correct = (examData.part1 ?? []).map((q) => q.answer);
  const p1Raw = countCorrect(allAnswers.p1, p1Correct);

  // ── Part 2 — Questions-réponses (25 questions) ────────────────────────────
  const p2Correct = (examData.part2 ?? []).map((q) => q.answer);
  const p2Raw = countCorrect(allAnswers.p2, p2Correct);

  // ── Part 3 — Conversations (13 × 3 = 39 questions) ───────────────────────
  const p3Correct: string[] = [];
  for (const conv of examData.part3 ?? []) {
    for (const q of conv.questions) {
      p3Correct.push(q.answer);
    }
  }
  const p3Raw = countCorrect(allAnswers.p3, p3Correct);

  // ── Part 4 — Monologues (10 × 3 = 30 questions) ──────────────────────────
  const p4Correct: string[] = [];
  for (const talk of examData.part4 ?? []) {
    for (const q of talk.questions) {
      p4Correct.push(q.answer);
    }
  }
  const p4Raw = countCorrect(allAnswers.p4, p4Correct);

  // ── Part 5 — Phrases incomplètes (30 questions) ───────────────────────────
  const p5Correct = (examData.part5 ?? []).map((q) => q.answer);
  const p5Raw = countCorrect(allAnswers.p5, p5Correct);

  // ── Part 6 — Textes à trous (4 × 4 = 16 questions) ───────────────────────
  const p6Correct: string[] = [];
  for (const passage of examData.part6 ?? []) {
    for (const q of passage.questions) {
      p6Correct.push(q.answer);
    }
  }
  const p6Raw = countCorrect(allAnswers.p6, p6Correct);

  // ── Part 7 — Lecture de documents (variable, ~54 questions) ───────────────
  const p7Correct: string[] = [];
  for (const passage of examData.part7 ?? []) {
    for (const q of passage.questions) {
      p7Correct.push(q.answer);
    }
  }
  const p7Raw = countCorrect(allAnswers.p7, p7Correct);

  // ── Section totals ────────────────────────────────────────────────────────
  const listeningRaw = p1Raw + p2Raw + p3Raw + p4Raw;
  const readingRaw = p5Raw + p6Raw + p7Raw;

  const listeningScore = scaleListening(listeningRaw);
  const readingScore = scaleReading(readingRaw);
  const totalScore = listeningScore + readingScore;

  return { listeningRaw, readingRaw, listeningScore, readingScore, totalScore };
}
