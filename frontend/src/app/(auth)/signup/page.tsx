import Image from "next/image";
import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/logoWhiteMode1.svg"
              alt="Choppe Ton Exam"
              width={70}
              height={70}
              className="mx-auto"
            />
          </Link>
        </div>

        <div
          className="bg-white px-8 py-10"
          style={{
            borderRadius: "var(--main-card-corner-radius)",
            boxShadow:
              "var(--main-card-shadow-x) var(--main-card-shadow-y) var(--main-card-shadow-blur) 0px rgba(0,0,0,0.25)",
          }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Crée ton compte
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Rejoins Choppe Ton Exam et prépare ton exam depuis n&apos;importe où.
          </p>

          <SignupForm />

          <p className="mt-6 text-center text-sm text-gray-500">
            Déjà un compte ?{" "}
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
