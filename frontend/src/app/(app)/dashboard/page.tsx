import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <header
        className="w-full bg-gradient-to-r from-[#ffffff] to-[rgba(102,0,204,0.8)]"
        style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.25)" }}
      >
        <div className="flex items-center justify-between w-full px-10 py-4">
          <span className="text-white font-semibold text-lg">
            Choppe Ton Exam
          </span>
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-[90%]">
        <div
          className="bg-white p-[28px]"
          style={{
            borderRadius: "var(--main-card-corner-radius)",
            boxShadow:
              "var(--main-card-shadow-x) var(--main-card-shadow-y) var(--main-card-shadow-blur) 0px rgba(0,0,0,0.25)",
          }}
        >
          <div
            className="min-h-[500px] border bg-white flex items-center justify-center"
            style={{
              borderRadius: "var(--text-field-corner-radius)",
              borderColor: "var(--text-field-stroke-color)",
            }}
          >
            <p className="text-gray-400 text-sm">
              L&apos;application arrive bientôt ici.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
