import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExamShell from "@/components/exam/ExamShell";

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

  const { data: exam } = await supabase
    .from("mock_exams")
    .select("id, status")
    .eq("id", examId)
    .eq("user_id", user.id)
    .single();

  if (!exam) redirect("/mockexams");
  if (exam.status === "completed") redirect(`/mockexams/${examId}/bilan`);

  return <ExamShell />;
}
