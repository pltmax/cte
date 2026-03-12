"use client";

import Link from "next/link";

export function PremiumGateModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl px-8 py-10 max-w-sm w-full mx-4 flex flex-col items-center text-center gap-5"
        style={{ boxShadow: "0px 4px 24px 0px rgba(0,0,0,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-[#f3ebff] flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[#6600CC]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Contenu réservé</h2>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            Choisissez un forfait Rush ou Chill pour accéder à l&apos;intégralité
            des exercices et des examens blancs.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/parametres"
            onClick={onClose}
            className="w-full py-3 bg-[#6600CC] text-white text-sm font-bold rounded-full text-center hover:bg-[#5500aa] transition-colors"
          >
            Voir les forfaits →
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-medium text-gray-500 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
