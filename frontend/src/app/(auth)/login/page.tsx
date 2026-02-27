import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
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
            Bon retour !
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Connecte-toi à ton compte pour continuer.
          </p>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="text-[#6600CC] font-semibold hover:underline"
            >
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
