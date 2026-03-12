import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckoutButton from "@/components/app/CheckoutButton";
import { ProfileSection, PasswordForm } from "./ParametresClient";
import { startCheckout } from "./actions";

// ─── Static plan data ─────────────────────────────────────────────────────────

const PLANS = [
  {
    type: "rush" as const,
    label: "Rush",
    duration: "2 semaines",
    price: "14 €",
    credits: 2,
    features: [
      "Accès aux exercices Parties 1–7",
      "Accès aux guides de cours",
      "2 crédits examens blancs inclus",
    ],
  },
  {
    type: "chill" as const,
    label: "Chill",
    duration: "1 mois",
    price: "20 €",
    credits: 4,
    features: [
      "Accès aux exercices Parties 1–7",
      "Accès aux guides de cours",
      "4 crédits examens blancs inclus",
    ],
  },
] as const;

const PLAN_LABELS: Record<string, string> = { rush: "Rush", chill: "Chill" };

// ─── Micro-components ─────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-[#6600CC] shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const cardStyle = { boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.06)" };
const packStyle = { boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.05)" };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ParametresPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "first_name, last_name, phone, role, credit_number, premium_expires_at, plan_type"
    )
    .eq("id", user.id)
    .single();

  const role: string = profile?.role ?? "user";
  const credits: number = profile?.credit_number ?? 0;
  const premiumExpiresAt: string | null = profile?.premium_expires_at ?? null;
  const planType: string | null = profile?.plan_type ?? null;

  // Admin is always premium; others check expiry
  const planActive =
    role === "admin"
      ? true
      : role === "premium" && premiumExpiresAt
        ? new Date(premiumExpiresAt) > new Date()
        : false;

  const expiryFormatted = premiumExpiresAt
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(premiumExpiresAt))
    : null;

  const activePlan = planActive
    ? PLANS.find((p) => p.type === planType) ?? null
    : null;

  // Countdown for upgrade card
  const msRemaining = premiumExpiresAt
    ? new Date(premiumExpiresAt).getTime() - Date.now()
    : 0;
  const daysRemaining = Math.max(0, Math.floor(msRemaining / (1000 * 60 * 60 * 24)));
  const hoursRemaining = Math.max(0, Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const countdownText = daysRemaining > 0
    ? `${daysRemaining} jour${daysRemaining > 1 ? "s" : ""} et ${hoursRemaining} heure${hoursRemaining > 1 ? "s" : ""}`
    : `${hoursRemaining} heure${hoursRemaining > 1 ? "s" : ""}`;

  // Projected new expiry after upgrade (+16 days from current expiry)
  const upgradeExpiryFormatted = premiumExpiresAt
    ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
        new Date(new Date(premiumExpiresAt).getTime() + 16 * 24 * 60 * 60 * 1000)
      )
    : null;

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez votre compte, votre offre et vos crédits.
        </p>
      </div>

      {/* ── Profil ───────────────────────────────────────────────────────────── */}
      <section
        className="bg-white rounded-2xl border border-gray-100 p-6"
        style={cardStyle}
      >
        <h2 className="text-base font-semibold text-foreground mb-4">
          Mon profil
        </h2>
        <ProfileSection
          firstName={profile?.first_name ?? null}
          lastName={profile?.last_name ?? null}
          email={user.email!}
          phone={profile?.phone ?? null}
        />
      </section>

      {/* ── Sécurité ─────────────────────────────────────────────────────────── */}
      <section
        className="bg-white rounded-2xl border border-gray-100 p-6"
        style={cardStyle}
      >
        <h2 className="text-base font-semibold text-foreground mb-4">
          Sécurité
        </h2>
        <PasswordForm />
      </section>

      {/* ── Mon offre ────────────────────────────────────────────────────────── */}
      <section
        className="bg-white rounded-2xl border border-gray-100 p-6"
        style={cardStyle}
      >
        <h2 className="text-base font-semibold text-foreground mb-4">
          Mon offre
        </h2>

        {planActive ? (
          /* ── Active plan ── */
          <div className="space-y-4">
            <div
              className="relative border border-[#6600CC]/20 rounded-xl overflow-hidden"
              style={packStyle}
            >
              <div className="h-1 w-full bg-gradient-to-r from-[#6600CC] to-[#9933ff]" />
              <div className="px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-foreground">
                        {PLAN_LABELS[planType ?? ""] ?? "Premium"}
                      </span>
                      <span className="px-2 py-0.5 bg-[#f3ebff] text-[#6600CC] text-xs font-semibold rounded-full">
                        Actif
                      </span>
                    </div>
                    {expiryFormatted && (
                      <p className="text-xs text-gray-400 mb-3">
                        Expire le {expiryFormatted}
                      </p>
                    )}
                    <ul className="space-y-1.5">
                      {(activePlan?.features ?? []).map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <CheckIcon />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Crédits</p>
                    <p className="text-2xl font-bold text-[#6600CC]">
                      {credits}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade card — Rush only */}
            {planType === "rush" && role !== "admin" && upgradeExpiryFormatted && (
              <div className="rounded-xl border border-[#6600CC]/30 bg-[#f9f5ff] overflow-hidden" style={packStyle}>
                <div className="h-0.5 w-full bg-gradient-to-r from-[#6600CC] to-[#9933ff]" />
                <div className="px-5 py-4 flex flex-col gap-3">
                  <div>
                    <p className="text-xs text-[#6600CC] font-medium uppercase tracking-wide">
                      Votre abonnement Rush prend fin dans
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-0.5">
                      {countdownText}
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">
                      Passez au plan Chill
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckIcon />
                        +2 semaines d&apos;accès (jusqu&apos;au {upgradeExpiryFormatted})
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckIcon />
                        +2 crédits examens blancs
                      </li>
                    </ul>
                  </div>
                  <CheckoutButton
                    action={startCheckout.bind(null, "upgrade")}
                    className="self-start px-5 py-2.5 text-sm font-semibold text-white bg-[#6600CC] rounded-full hover:bg-[#5500aa] transition-colors"
                  >
                    Passer au Chill — 6 €
                  </CheckoutButton>
                </div>
              </div>
            )}

            {/* Extra credit inline row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <p className="flex-1 text-sm text-gray-500">
                Chaque crédit supplémentaire permet de passer un examen blanc
                complet.
              </p>
              <CheckoutButton
                action={startCheckout.bind(null, "credit")}
                className="shrink-0 px-5 py-2.5 text-sm font-semibold text-white bg-[#6600CC] rounded-full hover:bg-[#5500aa] transition-colors"
              >
                Acheter un crédit — 4 €
              </CheckoutButton>
            </div>
          </div>
        ) : (
          /* ── No active plan — show Rush and Chill ── */
          <div>
            <p className="text-sm text-gray-400 mb-4">
              Accès à l&apos;achat unique — aucun abonnement.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLANS.map(({ type, label, duration, price, features }) => (
                <div
                  key={type}
                  className="border border-gray-100 rounded-xl overflow-hidden flex flex-col"
                  style={packStyle}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-[#6600CC] to-[#9933ff]" />
                  <div className="px-5 py-4 flex flex-col gap-4 flex-1">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {duration}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#6600CC] mt-0.5">
                        {price}
                      </p>
                      <ul className="mt-2.5 space-y-1.5">
                        {features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <CheckIcon />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <CheckoutButton
                      action={startCheckout.bind(null, type)}
                      className="mt-auto w-full py-2.5 text-sm font-semibold text-white bg-[#6600CC] rounded-full hover:bg-[#5500aa] transition-colors"
                    >
                      Choisir {label} →
                    </CheckoutButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <p className="text-xs text-gray-400 leading-relaxed">
        Paiements sécurisés par Stripe. Les forfaits et crédits sont à usage
        unique et non remboursables après utilisation.
      </p>
    </div>
  );
}
