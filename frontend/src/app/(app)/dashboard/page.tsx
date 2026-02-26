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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
      <p className="text-sm text-gray-500 mt-1">
        Bienvenue, {user.email}
      </p>
    </div>
  );
}
