import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExamShell from "@/components/exam/ExamShell";
import type { ExamData, ExamMeta } from "@/types/exam-data";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // ── 1. Fetch exam row (includes embedded data built at launch time) ────────
  const [{ data: examRow }, { data: profile }] = await Promise.all([
    supabase
      .from("mock_exams")
      .select("id, status, exam_data, exam_question_ids")
      .eq("id", examId)
      .eq("user_id", user.id)
      .single(),
    supabase.from("profiles").select("role").eq("id", user.id).single(),
  ]);

  if (!examRow) redirect("/mockexams");
  if (examRow.status === "completed") redirect(`/mockexams/${examId}/bilan`);
  if (examRow.status === "abandoned") redirect(`/mockexams/${examId}/bilan`);
  // Old exams (pre-migration) have no embedded data — treat as abandoned.
  if (!examRow.exam_data) redirect("/mockexams");

  const isAdmin = profile?.role === "admin";
  const examData = examRow.exam_data as ExamData;
  const examMeta = examRow.exam_question_ids as ExamMeta | undefined;

  return (
    <ExamShell
      examId={examId}
      examData={examData}
      examMeta={examMeta}
      isAdmin={isAdmin}
    />
  );
}
