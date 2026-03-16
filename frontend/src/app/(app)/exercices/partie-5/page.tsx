import { createClient } from "@/lib/supabase/server";
import Part5Shell from "@/components/exam/Part5Shell";
import type { P5Question } from "@/components/exam/Part5Batch";

export default async function Partie5Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_reading_part5")
    .select("text, options, answer")
    .eq("dataset_id", 1)
    .order("position");

  return (
    <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-8 md:py-10">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <Part5Shell questions={(data ?? []) as P5Question[]} />
        </div>
      </div>
    </div>
  );
}
