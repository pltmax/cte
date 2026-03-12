/**
 * Shared types for pre-built TOEIC exam datasets.
 * Each exam JSON (mockexamData/exams/exam_{1-4}.json) conforms to ExamData.
 *
 * Shell components accept these as optional props; when absent they fall back
 * to the full transcript JSON (used for the /exercices standalone routes).
 */

import type { P5Question } from "@/components/exam/Part5Batch";
import type { PassageData } from "@/components/exam/Part6Passage";
import type { P7Passage } from "@/components/exam/Part7Passage";
import type { TalkData } from "@/components/exam/Part4Talk";

export interface ExamP1Question {
  image: string;
  statements: string[];
  answer: string;
  image_url?: string;
  audio_urls?: { A: string; B: string; C: string; D: string };
}

export interface ExamP2Question {
  category?: string;
  question: string;
  options: string[];
  answer: string;
  question_audio_url?: string;
  option_audio_urls?: { A: string; B: string; C: string };
}

export interface ExamP3Conv {
  dialogue: Array<{ speaker: string; text: string }>;
  questions: Array<{ text: string; options: string[]; answer: string }>;
  audio_url?: string;
}

export interface ExamData {
  exam_number: number;
  part1?: ExamP1Question[];
  part2?: ExamP2Question[];
  part3?: ExamP3Conv[];
  part4?: TalkData[];
  part5?: P5Question[];
  part6?: PassageData[];
  part7?: P7Passage[];
}

/** Metadata stored in mock_exams.exam_question_ids — maps part → sampled UUIDs. */
export interface ExamMeta {
  p1: string[];
  p2: string[];
  p3: string[];
  p4: string[];
  p5: string[];
  p6: string[];
  p7: string[];
  /** Number of questions per Part 7 passage (for answer-offset math during scoring). */
  p7_question_counts: number[];
}
