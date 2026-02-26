import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No valid session — the reset link was invalid or already used
  if (!user) {
    redirect("/forgot-password");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans px-4 py-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/logoWhiteMode1.svg"
              alt="Choppe Ton Exam"
              width={100}
              height={100}
              className="mx-auto"
            />
          </Link>
        </div>

        <div
          className="bg-white px-8 py-6"
          style={{
            borderRadius: "var(--main-card-corner-radius)",
            boxShadow:
              "var(--main-card-shadow-x) var(--main-card-shadow-y) var(--main-card-shadow-blur) 0px rgba(0,0,0,0.25)",
          }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Nouveau mot de passe
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Choisis un nouveau mot de passe pour ton compte.
          </p>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
