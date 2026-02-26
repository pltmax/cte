import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
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
            Mot de passe oublié ?
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Saisis ton email et on t&apos;envoie un lien pour réinitialiser ton
            mot de passe.
          </p>

          <ForgotPasswordForm />

          <p className="mt-6 text-center text-sm text-gray-500">
            Tu te souviens ?{" "}
            <Link
              href="/login"
              className="text-[#6600CC] font-semibold hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
