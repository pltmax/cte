import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DiagnosticShell from "@/components/diagnostic/DiagnosticShell";
import DiagnosticResults from "@/components/diagnostic/DiagnosticResults";
import type { DiagnosticConfig, DiagnosticResult } from "@/types/diagnostic";

export default async function DiagnosticPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Premium users go to /exercices
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, premium_expires_at")
    .eq("id", user.id)
    .single();

  const role: string = profile?.role ?? "user";
  const expiresAt: string | null = profile?.premium_expires_at ?? null;
  const isPremium =
    role === "admin" ||
    (role === "premium" && expiresAt !== null && new Date(expiresAt) > new Date());

  if (isPremium) {
    redirect("/exercices");
  }

  // Check if already completed
  const { data: existingResult } = await supabase
    .from("diagnostic_results")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch diagnostic config (single row)
  const { data: configRow } = await supabase
    .from("diagnostic_config")
    .select("questions")
    .eq("id", 1)
    .single();

  if (!configRow) {
    return (
      <div className="p-8 text-center text-gray-500">
        Le test de niveau n&apos;est pas disponible pour le moment.
      </div>
    );
  }

  const config = configRow.questions as DiagnosticConfig;

  const content = existingResult ? (
    <DiagnosticResults
      result={existingResult as DiagnosticResult}
      config={config}
    />
  ) : (
    <DiagnosticShell config={config} userId={user.id} />
  );

  return (
    <div className="flex-1 flex items-start justify-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
