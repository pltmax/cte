import Link from "next/link";
import { fulfillCheckoutSession } from "@/lib/stripe/fulfill";
import { RefreshOnMount } from "@/components/app/RefreshOnMount";

const PLAN_MESSAGES: Record<string, { title: string; body: string; cta: string; href: string }> = {
  rush: {
    title: "Forfait Rush activé !",
    body: "Ton accès Rush est maintenant actif pour 2 semaines. 2 crédits examens blancs ont été ajoutés à ton compte.",
    cta: "Commencer les exercices →",
    href: "/exercices",
  },
  chill: {
    title: "Forfait Chill activé !",
    body: "Ton accès Chill est maintenant actif pour 1 mois. 4 crédits examens blancs ont été ajoutés à ton compte.",
    cta: "Commencer les exercices →",
    href: "/exercices",
  },
  upgrade: {
    title: "Forfait Chill activé !",
    body: "Ton plan a été upgradé vers Chill. +2 semaines d'accès et +2 crédits ont été ajoutés à ton compte.",
    cta: "Lancer un examen blanc →",
    href: "/mockexams",
  },
  credit: {
    title: "Crédit ajouté !",
    body: "1 crédit examen blanc a été ajouté à ton compte. Bonne préparation !",
    cta: "Lancer un examen blanc →",
    href: "/mockexams",
  },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; session_id?: string }>;
}) {
  const { type, session_id } = await searchParams;

  if (session_id) {
    await fulfillCheckoutSession(session_id).catch(() => {});
  }
  const msg = PLAN_MESSAGES[type ?? ""] ?? PLAN_MESSAGES["credit"];

  return (
    <div className="p-8 flex items-start justify-center">
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-gray-100 px-10 py-12 flex flex-col items-center text-center gap-6"
        style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
      >
        {/* Check icon */}
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">{msg.title}</h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{msg.body}</p>
        </div>

        <RefreshOnMount />
        <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
          La mise à jour du compte peut prendre quelques secondes. Si ton
          statut ne s&apos;est pas encore actualisé, rafraîchis la page dans
          un instant.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href={msg.href}
            className="px-8 py-3.5 bg-[#6600CC] text-white text-sm font-bold rounded-full hover:bg-[#5500aa] transition-colors shadow-md text-center"
          >
            {msg.cta}
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 text-sm font-medium text-gray-500 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-center"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
