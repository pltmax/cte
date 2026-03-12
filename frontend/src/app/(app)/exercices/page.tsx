import { createClient } from "@/lib/supabase/server";
import ExercisesListClient from "@/components/exercices/ExercisesListClient";

export default async function ExercicesPage() {
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

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground">Exercices</h1>
        <p className="text-sm text-gray-500 mt-1">
          Entraîne-toi par partie pour progresser avant le jour J.
        </p>
      </div>
      <ExercisesListClient isPremium={isPremium} />
    </div>
  );
}
