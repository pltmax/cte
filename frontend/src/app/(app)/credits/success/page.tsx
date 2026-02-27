import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; quantity?: string }>;
}) {
  const { type, quantity } = await searchParams;

  const isSubscription = type === "subscription";
  const creditCount = quantity ? parseInt(quantity, 10) : 1;

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

        {/* Message */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isSubscription ? "Bienvenue dans Premium !" : "Paiement réussi !"}
          </h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {isSubscription
              ? "Ton abonnement Premium est maintenant actif. Profite d'un accès illimité aux exercices."
              : `${creditCount} crédit${creditCount > 1 ? "s" : ""} ajouté${creditCount > 1 ? "s" : ""} à ton compte. Bonne préparation !`}
          </p>
        </div>

        {/* Note */}
        <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
          La mise à jour du compte peut prendre quelques secondes. Si ton
          statut ne s&apos;est pas encore actualisé, rafraîchis la page dans
          un instant.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full">
          {isSubscription ? (
            <Link
              href="/exercices"
              className="px-8 py-3.5 bg-[#6600CC] text-white text-sm font-bold rounded-full hover:bg-[#5500aa] transition-colors shadow-md text-center"
            >
              Commencer les exercices →
            </Link>
          ) : (
            <Link
              href="/mockexams"
              className="px-8 py-3.5 bg-[#6600CC] text-white text-sm font-bold rounded-full hover:bg-[#5500aa] transition-colors shadow-md text-center"
            >
              Lancer un examen blanc →
            </Link>
          )}
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
