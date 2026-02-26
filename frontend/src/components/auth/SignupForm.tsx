"use client";

import { useState } from "react";
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
    const phone = formData.get("phone") as string;
    const howHeard = formData.get("how_heard") as HowHeard;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          phone,
          how_heard: howHeard,
        },
      },
    });

    if (authError) {
      setError(authError.message);
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
          Numéro de téléphone{" "}
          <span className="text-gray-400 font-normal">(facultatif)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
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
          Comment as-tu entendu parler de nous ?
        </label>
        <select
          id="how_heard"
          name="how_heard"
          required
          defaultValue=""
          className="w-full px-4 py-3 border border-[var(--text-field-stroke-color)] rounded-[var(--text-field-corner-radius)] text-sm focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:border-transparent bg-white"
        >
          <option value="" disabled>
            Sélectionne une option
          </option>
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
