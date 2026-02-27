import Link from "next/link";

export default function PremiumRequiredPage() {
  return (
    <div className="p-8 flex items-start justify-center">
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 px-10 py-12 flex flex-col items-center text-center gap-6"
        style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
      >
        {/* Lock icon */}
        <div className="w-14 h-14 rounded-full bg-[#f3ebff] flex items-center justify-center">
          <svg
            className="w-7 h-7 text-[#6600CC]"
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

        {/* Text */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Accès Premium requis
          </h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-sm mx-auto">
            Les exercices et les examens blancs sont réservés aux membres
            Premium. Passez à l&apos;offre Premium pour un accès illimité.
          </p>
        </div>

        {/* Feature list */}
        <ul className="w-full text-left space-y-2">
          {[
            "Exercices Parties 1 à 7",
            "Examens blancs en conditions réelles",
            "Suivi de progression",
            "Conseils personnalisés",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-[#6600CC] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/credits"
            className="px-8 py-3.5 bg-[#6600CC] text-white text-sm font-bold rounded-full hover:bg-[#5500aa] transition-colors shadow-md text-center"
          >
            Passer à Premium →
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
