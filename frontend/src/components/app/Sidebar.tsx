"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PremiumGateModal } from "@/components/app/PremiumGateModal";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function ExamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar({ isPremium }: { isPremium: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const collapse = () => {
    setIsCollapsed(true);
    setGuidesOpen(false);
  };

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const navItem = (active: boolean) =>
    `flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      active
        ? "bg-[#f3ebff] text-[#6600CC]"
        : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
    }`;

  return (
    <>
      <aside
        className={`relative flex flex-col bg-white border-r border-gray-100 shrink-0 h-screen transition-[width] duration-200 ease-in-out`}
        style={{ width: isCollapsed ? 72 : 240 }}
      >
        {/* Logo */}
        <div className={`flex px-5 items-center py-6 mb-5`}>
          <Link href="/dashboard">
            <Image
              src="/logoWhiteMode1.svg"
              alt="Choppe Ton Exam"
              width={80}
              height={80}
              priority
              className={`transition-all duration-200 ${
                isCollapsed ? "w-10 h-10" : "w-20 h-20"
              }`}
            />
          </Link>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => (isCollapsed ? setIsCollapsed(false) : collapse())}
          className="absolute -right-3 top-20 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          aria-label={isCollapsed ? "Ouvrir le menu" : "Réduire le menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-400" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 min-h-0 px-2 pt-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {/* Test de niveau — non-premium only */}
          {!isPremium && (
            <Link
              href="/diagnostic"
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                isActive("/diagnostic")
                  ? "bg-[#f3ebff] text-[#6600CC] border-[#6600CC]/30"
                  : "text-[#6600CC] border-[#e9d9ff] hover:bg-[#faf6ff]"
              }`}
              title={isCollapsed ? "Test de niveau" : undefined}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">Test de niveau</span>
                </>
              )}
            </Link>
          )}

          {/* Guides (accordion) */}
          <div>
            <button
              onClick={() => !isCollapsed && setGuidesOpen((o) => !o)}
              className={navItem(isActive("/guides"))}
              title={isCollapsed ? "Guides" : undefined}
            >
              <BookIcon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">Guides</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      guidesOpen ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>
            {guidesOpen && !isCollapsed && (
              <div className="mt-0.5 ml-4 pl-3 border-l border-gray-100 space-y-0.5 py-0.5">
                <Link href="/guides/toeic" className={navItem(isActive("/guides/toeic"))}>
                  <span className="truncate">Guide TOEIC</span>
                </Link>
                <Link href="/guides/ecoute" className={navItem(isActive("/guides/ecoute"))}>
                  <span className="truncate">Guide Écoute</span>
                </Link>
                <Link href="/guides/lecture" className={navItem(isActive("/guides/lecture"))}>
                  <span className="truncate">Guide Lecture</span>
                </Link>
                {isPremium ? (
                  <Link href="/guides/vocabulaire" className={navItem(isActive("/guides/vocabulaire"))}>
                    <span className="truncate">Vocabulaire</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setGateOpen(true)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-50 hover:text-gray-400 transition-colors"
                  >
                    <span className="flex-1 text-left truncate">Vocabulaire</span>
                    <LockIcon className="w-3.5 h-3.5 shrink-0" />
                  </button>
                )}
                {isPremium ? (
                  <Link href="/guides/grammaire" className={navItem(isActive("/guides/grammaire"))}>
                    <span className="truncate">Grammaire</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setGateOpen(true)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-50 hover:text-gray-400 transition-colors"
                  >
                    <span className="flex-1 text-left truncate">Grammaire</span>
                    <LockIcon className="w-3.5 h-3.5 shrink-0" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Exercices */}
          <Link
            href="/exercices"
            className={navItem(isActive("/exercices"))}
            title={isCollapsed ? "Exercices" : undefined}
          >
            <PencilIcon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="truncate">Exercices</span>}
          </Link>

          {/* Examens blancs */}
          {isPremium ? (
            <Link
              href="/mockexams"
              className={navItem(isActive("/mockexams"))}
              title={isCollapsed ? "Examens blancs" : undefined}
            >
              <ExamIcon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Examens blancs</span>}
            </Link>
          ) : (
            <button
              onClick={() => setGateOpen(true)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-50 hover:text-gray-400 transition-colors"
              title={isCollapsed ? "Examens blancs (forfait requis)" : undefined}
            >
              <ExamIcon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">Examens blancs</span>
                  <LockIcon className="w-3.5 h-3.5 shrink-0" />
                </>
              )}
            </button>
          )}
        </nav>

        {/* Bottom — Paramètres + Déconnexion */}
        <div className="px-2 pb-4 shrink-0 space-y-0.5">
          <Link
            href="/parametres"
            className={navItem(isActive("/parametres"))}
            title={isCollapsed ? "Paramètres" : undefined}
          >
            <GearIcon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="truncate">Paramètres</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            title={isCollapsed ? "Déconnexion" : undefined}
          >
            <LogoutIcon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="truncate">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {gateOpen && <PremiumGateModal onClose={() => setGateOpen(false)} />}
    </>
  );
}
