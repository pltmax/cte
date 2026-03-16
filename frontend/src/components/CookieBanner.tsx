"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only if the user hasn't already chosen
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const deny = () => {
    localStorage.setItem(STORAGE_KEY, "denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl"
      role="dialog"
      aria-label="Consentement aux cookies"
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{ boxShadow: "0px 8px 32px rgba(0,0,0,0.12)" }}
      >
        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-0.5">
            Cookies
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Nous utilisons des cookies strictement nécessaires à l&apos;authentification
            et au bon fonctionnement du service. Aucun cookie de tracking ou
            publicitaire.{" "}
            <Link href="/cgv" className="underline hover:text-[#6600CC] transition-colors">
              En savoir plus
            </Link>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={deny}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#6600CC] text-white hover:bg-[#5500aa] transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
