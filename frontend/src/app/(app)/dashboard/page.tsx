import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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

  redirect(isPremium ? "/exercices" : "/diagnostic");
}
