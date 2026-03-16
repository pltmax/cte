import { createClient } from "@/lib/supabase/server";
import Part3Shell from "@/components/exam/Part3Shell";
import type { ExamP3Conv } from "@/types/exam-data";

export default async function Partie3Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_listening_part3")
    .select("dialogue, questions, audio_url")
    .eq("dataset_id", 1)
    .order("position");

  return (
    <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-8 md:py-10">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <Part3Shell conversations={(data ?? []) as ExamP3Conv[]} />
        </div>
      </div>
    </div>
  );
}
