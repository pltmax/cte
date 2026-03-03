import { createClient } from "@/lib/supabase/server";
import Part6Shell from "@/components/exam/Part6Shell";
import type { ExamData } from "@/types/exam-data";

export default async function Partie6Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_reading_part6")
    .select("doctype, text, questions")
    .eq("dataset_id", 1)
    .order("position");

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <Part6Shell passages={(data ?? []) as unknown as ExamData["part6"]} />
        </div>
      </div>
    </div>
  );
}
