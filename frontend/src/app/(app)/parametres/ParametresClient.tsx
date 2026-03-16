"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { updateProfile, updatePassword, sendContactMessage } from "./actions";

type FormState = { error?: string; success?: boolean } | null;

const inputClass =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6600CC]/30 focus:border-[#6600CC]";

// ─── Profile Section ──────────────────────────────────────────────────────────

interface ProfileSectionProps {
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
}

export function ProfileSection({
  firstName,
  lastName,
  email,
  phone,
}: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    updateProfile,
    null
  );

  // Return to view mode on success
  useEffect(() => {
    if (state?.success) setIsEditing(false);
  }, [state?.success]);

  // ── View mode ────────────────────────────────────────────────────────────
  if (!isEditing) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-5">
          {[
            { label: "Prénom", value: firstName },
            { label: "Nom", value: lastName },
            { label: "Email", value: email },
            { label: "Téléphone", value: phone },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-medium text-gray-400 mb-0.5">
                {label}
              </p>
              <p className="text-sm text-gray-800">{value || "—"}</p>
            </div>
          ))}
        </div>

        {state?.success && (
          <p className="text-sm text-green-600 mb-3">Profil mis à jour.</p>
        )}

        <button
          onClick={() => setIsEditing(true)}
          className="px-5 py-2 text-sm font-semibold text-[#6600CC] border border-[#6600CC]/30 rounded-full hover:bg-[#f3ebff] transition-colors"
        >
          Modifier
        </button>
      </div>
    );
  }

  // ── Edit mode ─────────────────────────────────────────────────────────────
  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Prénom
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            defaultValue={firstName ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Nom
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            defaultValue={lastName ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full px-3 py-2 text-sm border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={phone ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          disabled={isPending}
          className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 text-sm font-semibold text-white bg-[#6600CC] rounded-full hover:bg-[#5500aa] transition-colors disabled:opacity-50"
        >
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    sendContactMessage,
    null
  );
  const [message, setMessage] = useState("");

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Tu as remarqué une erreur dans une question, une traduction approximative,
        ou quelque chose qui ne fonctionne pas comme prévu&nbsp;?
        Envoie-nous un message — on corrige rapidement.
      </p>

      {state?.success ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-700">
            Message envoyé, merci&nbsp;!
          </p>
        </div>
      ) : (
        <form action={formAction} className="space-y-3">
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Décris ce que tu as remarqué…"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#6600CC]/30 focus:border-[#6600CC]"
          />
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || message.trim().length < 10}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#6600CC] rounded-full hover:bg-[#5500aa] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "Envoi…" : "Envoyer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Password Form ────────────────────────────────────────────────────────────

export function PasswordForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    updatePassword,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Nouveau mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="confirm"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-600">Mot de passe modifié.</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 text-sm font-semibold text-white bg-[#6600CC] rounded-full hover:bg-[#5500aa] transition-colors disabled:opacity-50"
        >
          {isPending ? "Modification…" : "Modifier le mot de passe"}
        </button>
      </div>
    </form>
  );
}
