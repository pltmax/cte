import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExamShell from "@/components/exam/ExamShell";
import type { ExamData } from "@/types/exam-data";

// Convert null/empty arrays to undefined so each PartShell's `?? localJson`
// fallback activates when the DB has no data for that part.
function toOpt<T>(arr: T[] | null | undefined): T[] | undefined {
  return arr && arr.length > 0 ? arr : undefined;
}

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

  // ── 1. Verify the exam exists (select only stable columns) ────────────────
  const { data: exam } = await supabase
    .from("mock_exams")
    .select("id, status")
    .eq("id", examId)
    .eq("user_id", user.id)
    .single();

  if (!exam) redirect("/mockexams");
  if (exam.status === "completed") redirect(`/mockexams/${examId}/bilan`);

  // ── 2. Fetch profile for admin check (runs in parallel with dataset_id) ──
  const [{ data: profile }, { data: datasetRow, error: datasetError }] =
    await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      // dataset_id column may not exist yet if migrations haven't been applied
      supabase.from("mock_exams").select("dataset_id").eq("id", examId).single(),
    ]);

  const isAdmin = profile?.role === "admin";

  // ── 3. If dataset_id is unavailable, fall back to local JSON in each Shell ─
  type DatasetRow = { dataset_id?: number | null };
  const did: number | null = datasetError
    ? null
    : (datasetRow as DatasetRow | null)?.dataset_id ?? null;

  if (did === null) {
    return <ExamShell examId={examId} isAdmin={isAdmin} />;
  }

  // ── 4. Fetch all 7 parts in parallel, keyed by dataset_id ────────────────
  const [p1, p2, p3, p4, p5, p6, p7] = await Promise.all([
    supabase
      .from("toeic_listening_part1")
      .select("image, statements, answer, image_url, audio_urls")
      .eq("dataset_id", did)
      .order("position"),
    supabase
      .from("toeic_listening_part2")
      .select("category, question, options, answer, question_audio_url, option_audio_urls")
      .eq("dataset_id", did)
      .order("position"),
    supabase
      .from("toeic_listening_part3")
      .select("dialogue, questions, audio_url")
      .eq("dataset_id", did)
      .order("position"),
    supabase
      .from("toeic_listening_part4")
      .select("title, text, questions, audio_url, graphic_title, graphic_doctype, graphic")
      .eq("dataset_id", did)
      .order("position"),
    supabase
      .from("toeic_reading_part5")
      .select("text, options, answer")
      .eq("dataset_id", did)
      .order("position"),
    supabase
      .from("toeic_reading_part6")
      .select("doctype, text, questions")
      .eq("dataset_id", did)
      .order("position"),
    supabase
      .from("toeic_reading_part7")
      .select("documents, questions")
      .eq("dataset_id", did)
      .order("position"),
  ]);

  const examData: ExamData = {
    exam_number: did,
    part1: toOpt(p1.data) as ExamData["part1"],
    part2: toOpt(p2.data) as ExamData["part2"],
    part3: toOpt(p3.data) as ExamData["part3"],
    part4: toOpt(p4.data) as ExamData["part4"],
    part5: toOpt(p5.data) as ExamData["part5"],
    part6: toOpt(p6.data) as ExamData["part6"],
    part7: toOpt(p7.data) as ExamData["part7"],
  };

  return <ExamShell examId={examId} examData={examData} isAdmin={isAdmin} />;
}
