"use client";

import { useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { createClient } from "@/lib/supabase/client";
import type { HowHeard } from "@/types/profile";

const HOW_HEARD_OPTIONS: { value: HowHeard; label: string }[] = [
  { value: "reseaux_sociaux", label: "Réseaux sociaux" },
  { value: "ami", label: "Un ami / Une amie" },
  { value: "moteur_recherche", label: "Moteur de recherche" },
  { value: "publicite", label: "Publicité" },
  { value: "ecole", label: "École / Université" },
  { value: "autre", label: "Autre" },
];

function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parsed = parsePhoneNumberFromString(trimmed, "FR");
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number; // E.164 e.g. "+33612345678"
}

function isPhoneDuplicateError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("profiles_phone_e164_unique") ||
    lower.includes("unique constraint") ||
    lower.includes("duplicate key") ||
    lower.includes("phone_e164")
  );
}

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const rawPhone = (formData.get("phone") as string) ?? "";
    const howHeardRaw = formData.get("how_heard") as string;
    const howHeard = howHeardRaw || null;

    // Phone is required
    if (!rawPhone.trim()) {
      setError("Le numéro de téléphone est obligatoire.");
      setLoading(false);
      return;
    }

    // Normalize to E.164; reject if invalid
    const phoneE164 = normalizePhone(rawPhone);
    if (!phoneE164) {
      setError(
        "Numéro de téléphone invalide. Utilise le format international (ex : +33 6 12 34 56 78)."
      );
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Pre-check uniqueness for fast UX (before signUp creates the auth user)
    const { data: available, error: rpcError } = await supabase.rpc(
      "is_phone_available",
      { p_phone_e164: phoneE164 }
    );
    if (rpcError) {
      setError("Une erreur est survenue. Réessaie dans quelques instants.");
      setLoading(false);
      return;
    }
    if (!available) {
      setError("Ce numéro de téléphone est déjà associé à un compte.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          phone: rawPhone.trim(),
          phone_e164: phoneE164,
          ...(howHeard ? { how_heard: howHeard } : {}),
        },
      },
    });

    if (authError) {
      if (isPhoneDuplicateError(authError.message)) {
        setError("Ce numéro de téléphone est déjà associé à un compte.");
      } else {
        // Do not surface raw Supabase errors — they leak DB internals (table
      // names, constraint names, etc.). Show a generic message instead.
      setError("Une erreur est survenue. Vérifie tes informations et réessaie.");
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-7 h-7 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-foreground text-lg">
          Vérifie tes emails !
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Un lien de confirmation a été envoyé à ton adresse email. Clique
          dessus pour activer ton compte.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Prénom
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            autoComplete="given-name"
            placeholder="Jean"
            className="w-full px-4 py-3 border border-[var(--text-field-stroke-color)] rounded-[var(--text-field-corner-radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Nom
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Dupont"
            className="w-full px-4 py-3 border border-[var(--text-field-stroke-color)] rounded-[var(--text-field-corner-radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:border-transparent"
          />
        </div>
      </div>

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
          placeholder="jean.dupont@exemple.fr"
          className="w-full px-4 py-3 border border-[var(--text-field-stroke-color)] rounded-[var(--text-field-corner-radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Numéro de téléphone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+33 6 12 34 56 78"
          className="w-full px-4 py-3 border border-[var(--text-field-stroke-color)] rounded-[var(--text-field-corner-radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Mot de passe
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
          htmlFor="how_heard"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Comment as-tu entendu parler de nous ?{" "}
          <span className="text-gray-400 font-normal">*</span>
        </label>
        <select
          id="how_heard"
          name="how_heard"
          defaultValue=""
          className="w-full px-4 py-3 border border-[var(--text-field-stroke-color)] rounded-[var(--text-field-corner-radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:border-transparent bg-white appearance-none"
        >
          <option value="">Sélectionne une option</option>
          {HOW_HEARD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#6600CC] text-white text-sm font-semibold rounded-[var(--text-field-corner-radius)] hover:bg-[#5500aa] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {loading ? "Inscription…" : "Créer mon compte"}
      </button>
    </form>
  );
}
