"use client";

import Link from "next/link";
import Image from "next/image";

export default function MobileTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-white border-b border-gray-100 flex items-center px-4">
      <button
        onClick={onMenuClick}
        aria-label="Ouvrir le menu"
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <Link href="/dashboard" className="absolute left-1/2 -translate-x-1/2">
        <Image
          src="/logoWhiteMode1.svg"
          alt="Choppe Ton Exam"
          width={40}
          height={40}
          priority
          className="w-10 h-10"
        />
      </Link>
    </header>
  );
}
