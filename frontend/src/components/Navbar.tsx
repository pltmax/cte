import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header
      className="w-full bg-gradient-to-r from-[#ffffff] to-[rgba(102,0,204,0.8)]"
      style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.25)" }}
    >
      <div className="flex items-center justify-between w-full px-10 py-4">
        <Link href="/" className="flex items-center px-10">
          <Image
            src="/logoWhiteMode1.svg"
            alt="Choppe Ton Exam Logo"
            height={90}
            width={90}
            priority
            className="block"
            style={{ maxWidth: "90px", height: "auto" }}
          />
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-6 py-2.5 text-base font-semibold text-white border border-white/50 rounded-full hover:bg-white/10 transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 text-base font-semibold text-[#6600CC] bg-white rounded-full hover:bg-white/90 transition-colors"
          >
            S&apos;inscrire
          </Link>
        </nav>
      </div>
    </header>
  );
}
