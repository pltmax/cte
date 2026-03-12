import { createClient } from "@/lib/supabase/server";
import Part4Shell from "@/components/exam/Part4Shell";
import type { TalkData } from "@/components/exam/Part4Talk";

export default async function Partie4Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("toeic_listening_part4")
    .select("title, text, questions, audio_url, graphic_title, graphic_doctype, graphic")
    .eq("dataset_id", 1)
    .order("position");

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          <Part4Shell talks={(data ?? []) as TalkData[]} />
        </div>
      </div>
    </div>
  );
}
