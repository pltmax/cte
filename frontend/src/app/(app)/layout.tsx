import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/app/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPremium = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, premium_expires_at")
      .eq("id", user.id)
      .single();

    const role: string = profile?.role ?? "user";
    const expiresAt: string | null = profile?.premium_expires_at ?? null;
    isPremium =
      role === "admin" ||
      (role === "premium" &&
        expiresAt !== null &&
        new Date(expiresAt) > new Date());
  }

  return <AppShell isPremium={isPremium}>{children}</AppShell>;
}
