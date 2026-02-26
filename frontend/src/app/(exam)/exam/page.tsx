import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExamShell from "@/components/exam/ExamShell";

export default async function ExamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <ExamShell />;
}
