"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    // Always show success — prevents email enumeration
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-7 h-7 text-[#6600CC]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-foreground text-lg">
          Vérifie tes emails
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Si un compte existe pour cette adresse, tu recevras un lien de
          réinitialisation dans quelques instants.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Adresse email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="toi@exemple.fr"
          className="w-full px-4 py-3 border border-[var(--text-field-stroke-color)] rounded-[var(--text-field-corner-radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#6600CC] text-white text-sm font-semibold rounded-[var(--text-field-corner-radius)] hover:bg-[#5500aa] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Envoi…" : "Envoyer le lien"}
      </button>
    </form>
  );
}
