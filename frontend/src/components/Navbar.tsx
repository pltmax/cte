"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_TABS = [
  { label: "Le concept", href: "/#concept", id: "concept" },
  { label: "Lance-toi", href: "/#lance-toi", id: "lance-toi" },
  { label: "Avis", href: "/#avis", id: "avis" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!isLanding) return;

    const handleScroll = () => {
      const threshold = window.innerHeight * 0.45;
      let active: string | null = null;

      for (const { id } of NAV_TABS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          active = id;
        }
      }

      setActiveSection(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLanding]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logoWhiteMode1.svg"
            alt="Choppe Ton Exam Logo"
            height={70}
            width={70}
            priority
            className="block"
          />
        </Link>

        {/* Right side: tabs + auth buttons */}
        <div className="flex items-center gap-2">
          {isLanding && (
            <nav className="hidden md:flex items-center gap-1 mr-2">
              {NAV_TABS.map((tab) => {
                const isActive = activeSection === tab.id;
                return (
                  <a
                    key={tab.href}
                    href={tab.href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#f3ebff] text-[#6600CC] font-semibold"
                        : "text-gray-600 hover:bg-[#f3ebff] hover:text-[#6600CC]"
                    }`}
                  >
                    {tab.label}
                  </a>
                );
              })}
            </nav>
          )}

          <Link
            href="/login"
            className="px-4 py-1.5 text-sm font-semibold text-[#6600CC] border border-[#6600CC]/30 rounded-full hover:bg-[#f3ebff] transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="px-4 py-1.5 text-sm font-semibold text-white bg-[#6600CC] rounded-full hover:bg-[#5500aa] transition-colors"
          >
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}
