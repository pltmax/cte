"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
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
          htmlFor="password"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Nouveau mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          placeholder="8 caractères minimum"
          className="w-full px-4 py-3 border border-[var(--text-field-stroke-color)] rounded-[var(--text-field-corner-radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="confirm"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Confirmer le mot de passe
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          placeholder="••••••••"
          className="w-full px-4 py-3 border border-[var(--text-field-stroke-color)] rounded-[var(--text-field-corner-radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#6600CC] text-white text-sm font-semibold rounded-[var(--text-field-corner-radius)] hover:bg-[#5500aa] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Mise à jour…" : "Mettre à jour le mot de passe"}
      </button>
    </form>
  );
}
