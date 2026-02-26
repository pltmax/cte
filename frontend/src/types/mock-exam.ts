export type MockExamStatus = "pending" | "in_progress" | "completed";

export interface MockExam {
  id: string;
  user_id: string;
  created_at: string;
  completed_at: string | null;
  status: MockExamStatus;
  score: number | null;
  listening_score: number | null;
  reading_score: number | null;
}
