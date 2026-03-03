"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close settings popover on outside click
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const collapse = () => {
    setIsCollapsed(true);
    setGuidesOpen(false);
    setSettingsOpen(false);
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
    <aside
      className={`relative flex flex-col bg-white border-r border-gray-100 shrink-0 h-screen transition-[width] duration-200 ease-in-out`}
      style={{ width: isCollapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div
        className={`flex px-5 items-center py-6 mb-5`}
      >
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

      {/* Collapse toggle — floats on the right edge, ~80px from top */}
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
              <Link
                href="/guides/toeic"
                className={navItem(isActive("/guides/toeic"))}
              >
                <span className="truncate">Guide TOEIC</span>
              </Link>
              <Link
                href="/guides/ecoute"
                className={navItem(isActive("/guides/ecoute"))}
              >
                <span className="truncate">Guide Écoute</span>
              </Link>
              <Link
                href="/guides/lecture"
                className={navItem(isActive("/guides/lecture"))}
              >
                <span className="truncate">Guide Lecture</span>
              </Link>
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
        <Link
          href="/mockexams"
          className={navItem(isActive("/mockexams"))}
          title={isCollapsed ? "Examens blancs" : undefined}
        >
          <ExamIcon className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="truncate">Examens blancs</span>}
        </Link>
      </nav>

      {/* Settings — pinned to bottom */}
      <div ref={settingsRef} className="relative px-2 pb-4 shrink-0">
        {/* Popover — opens upward */}
        {settingsOpen && (
          <div className="absolute bottom-16 left-2 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 min-w-[180px]">
            <Link
              href="/profil"
              onClick={() => setSettingsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-gray-400" />
              Profil
            </Link>
            <Link
              href="/abonnement"
              onClick={() => setSettingsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CardIcon className="w-4 h-4 text-gray-400" />
              Abonnement
            </Link>
            <Link
              href="/credits"
              onClick={() => setSettingsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CoinIcon className="w-4 h-4 text-gray-400" />
              Crédits
            </Link>
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        )}

        <button
          onClick={() => setSettingsOpen((o) => !o)}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            settingsOpen
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
          }`}
          title={isCollapsed ? "Paramètres" : undefined}
        >
          <GearIcon className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="truncate">Paramètres</span>}
        </button>
      </div>
    </aside>
  );
}
