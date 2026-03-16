export interface DiagP1Question {
  id: string;
  image_url?: string;
  audio_urls?: Record<string, string>;
  statements: string[];
  answer: string;
}

export interface DiagP2Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  question_audio_url?: string;
  option_audio_urls?: Record<string, string>;
}

export interface DiagP3Conv {
  id: string;
  audio_url?: string;
  questions: Array<{ text: string; options: string[]; answer: string }>;
}

export interface DiagP4Talk {
  id: string;
  title?: string;
  audio_url?: string;
  graphic_title?: string;
  graphic_doctype?: string;
  graphic?: Record<string, string>;
  questions: Array<{ text: string; options: string[]; answer: string }>;
}

export interface DiagP5Question {
  id: string;
  text: string;
  options: string[];
  answer: string;
}

export interface DiagP6Passage {
  id: string;
  doctype?: string;
  title?: string;
  text: string;
  questions: Array<{ options: string[]; answer: string }>;
}

export interface DiagP7Passage {
  id: string;
  documents: Array<{ doctype: string; title?: string; text: string }>;
  questions: Array<{ text: string; options: string[]; answer: string }>;
}

export interface DiagnosticConfig {
  p1: DiagP1Question[];   // 2 items
  p2: DiagP2Question[];   // 2 items
  p3: DiagP3Conv;         // 1 conversation (shell slices last 2 questions)
  p4: DiagP4Talk;         // 1 talk (shell slices last 2 questions)
  p5: DiagP5Question[];   // 2 items
  p6: DiagP6Passage[];    // 2 passages (4 questions each = 8 total)
  p7: DiagP7Passage[];    // 2 passages (shell slices last 2 questions each)
}

export interface DiagnosticResult {
  user_id: string;
  completed_at: string;
  score: number;
  answers: DiagAnswers;
}

export type DiagAnswers = {
  p1: Record<number, string>;
  p2: Record<number, string>;
  p3: Record<number, string>;
  p4: Record<number, string>;
  p5: Record<number, string>;
  p6_0: Record<number, string>;
  p6_1: Record<number, string>;
  p7_0: Record<number, string>;
  p7_1: Record<number, string>;
};
