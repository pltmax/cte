"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Identifiants incorrects. Vérifie ton email et ton mot de passe.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Email
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

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            Mot de passe
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-[#6600CC] hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full px-4 py-3 border border-[var(--text-field-stroke-color)] rounded-[var(--text-field-corner-radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#6600CC] text-white text-sm font-semibold rounded-[var(--text-field-corner-radius)] hover:bg-[#5500aa] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
