"use client";

import Image from "next/image";
import Link from "next/link";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamHeader({
  secondsLeft,
  timerActive,
}: {
  secondsLeft: number;
  timerActive: boolean;
}) {
  const isLow = timerActive && secondsLeft < 5 * 60;

  return (
    <header className="w-full bg-white border-b border-gray-100 px-8 py-4 shrink-0">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Left: logo + title */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Image
              src="/logoWhiteMode1.svg"
              alt="Choppe Ton Exam"
              width={36}
              height={36}
              priority
            />
          </Link>
          <div className="w-px h-5 bg-gray-200" />
          <span className="text-sm font-semibold text-gray-700">
            Examen d&apos;entraînement
          </span>
        </div>

        {/* Right: timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-semibold transition-colors ${
            isLow
              ? "bg-red-50 text-red-600"
              : "bg-gray-50 text-gray-700"
          }`}
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {formatTime(secondsLeft)}
          <span className="text-xs font-sans font-normal text-gray-400 ml-1">
            Écoute
          </span>
        </div>
      </div>
    </header>
  );
}
