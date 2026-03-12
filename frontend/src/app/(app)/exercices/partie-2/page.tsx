import { createClient } from "@/lib/supabase/server";
import Part2Shell from "@/components/exam/Part2Shell";
import type { ExamP2Question } from "@/types/exam-data";

export default async function Partie2Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_listening_part2")
    .select("question, options, answer, question_audio_url, option_audio_urls, category")
    .eq("dataset_id", 1)
    .order("position");

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-15">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <Part2Shell questions={(data ?? []) as ExamP2Question[]} />
        </div>
      </div>
    </div>
  );
}
