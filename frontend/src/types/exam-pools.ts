/**
 * Types for the dynamic weighted exam selection system.
 * Pool items are sourced from part{1-7}_pool.json files.
 */

// ─── Priority store ───────────────────────────────────────────────────────────

export interface PriorityRecord {
  priority: 1 | 2 | 3;
  /** null = never answered */
  lastAnsweredExamCount: number | null;
}

export interface PriorityStore {
  examCount: number;
  /** key = pool item id (e.g. "p3_e2_q005") */
  items: Record<string, PriorityRecord>;
}

// ─── Exam selection metadata ──────────────────────────────────────────────────

export interface ExamSelectionMeta {
  p1Ids: string[];
  p2Ids: string[];
  p3Ids: string[];
  p4Ids: string[];
  p5Ids: string[];
  p6Ids: string[];
  p7Ids: string[];
  /** Number of questions per P7 passage (for offset math during scoring) */
  p7QuestionCounts: number[];
}

// ─── Pool item base ───────────────────────────────────────────────────────────

export interface PoolItemBase {
  id: string;
  source_exam: number;
}
