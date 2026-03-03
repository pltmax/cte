import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckoutButton from "@/components/app/CheckoutButton";
import type { Subscription } from "@/types/subscription";
import {
  startCheckout,
  openBillingPortal,
} from "@/app/(app)/credits/actions";

// ─── Credit packs ─────────────────────────────────────────────────────────────

const CREDIT_PACKS = [
  { quantity: 1, label: "1 crédit", price: "6,99 €" },
  { quantity: 3, label: "3 crédits", price: "20,97 €" },
  { quantity: 5, label: "5 crédits", price: "34,95 €" },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CreditsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profileData }, { data: subData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("role, credit_number, stripe_customer_id")
      .eq("id", user.id)
      .single(),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  const role: string = profileData?.role ?? "user";
  const credits: number = profileData?.credit_number ?? 0;
  const hasStripeCustomer = Boolean(profileData?.stripe_customer_id);
  const isPremium = role === "premium" || role === "admin";
  const activeSub = subData as Subscription | null;

  const renewDate = activeSub?.current_period_end
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(activeSub.current_period_end))
    : null;

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Abonnement &amp; crédits
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez votre accès Premium et vos crédits d&apos;examens blancs.
        </p>
      </div>

      {/* ── Current status ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        {/* Role badge */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
            isPremium
              ? "bg-[#f3ebff] text-[#6600CC]"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isPremium ? "bg-[#6600CC]" : "bg-gray-400"
            }`}
          />
          {isPremium ? "Premium actif" : "Compte gratuit"}
          {renewDate && (
            <span className="text-xs text-[#6600CC]/60 ml-1">
              · renouv. {renewDate}
            </span>
          )}
        </div>

        {/* Credits badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-600">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {credits} crédit{credits !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Premium plan ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-3">
          Abonnement Premium
        </h2>

        <div
          className={`relative bg-white rounded-2xl border overflow-hidden ${
            isPremium ? "border-[#6600CC]/30" : "border-gray-100"
          }`}
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.06)" }}
        >
          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#6600CC] to-[#9933ff]" />

          <div className="px-8 py-7 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-foreground">
                  Plan Premium
                </span>
                {isPremium && (
                  <span className="px-2 py-0.5 bg-[#f3ebff] text-[#6600CC] text-xs font-semibold rounded-full">
                    Actif
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-[#6600CC]">
                15 €
                <span className="text-sm font-normal text-gray-400 ml-1">
                  / mois
                </span>
              </p>
              <ul className="mt-3 space-y-1">
                {[
                  "Accès illimité aux exercices Parties 1–7",
                  "Examens blancs complets (selon crédits)",
                  "Suivi de progression et bilans",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
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
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0">
              {isPremium ? (
                hasStripeCustomer ? (
                  <CheckoutButton
                    action={openBillingPortal}
                    className="px-6 py-3 text-sm font-semibold text-[#6600CC] border border-[#6600CC]/30 rounded-full hover:bg-[#f3ebff] transition-colors"
                  >
                    Gérer l&apos;abonnement →
                  </CheckoutButton>
                ) : (
                  <span className="text-sm text-gray-400">
                    Abonnement géré manuellement
                  </span>
                )
              ) : (
                <CheckoutButton
                  action={startCheckout.bind(null, "subscription", 1)}
                  className="px-8 py-3.5 bg-[#6600CC] text-white text-sm font-bold rounded-full hover:bg-[#5500aa] transition-colors shadow-md"
                >
                  S&apos;abonner →
                </CheckoutButton>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Extra credits ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-1">
          Crédits supplémentaires
        </h2>
        <p className="text-sm text-gray-400 mb-3">
          Chaque crédit permet de passer un examen blanc complet.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CREDIT_PACKS.map(({ quantity, label, price }) => (
            <div
              key={quantity}
              className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col gap-4"
              style={{ boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.05)" }}
            >
              <div>
                <p className="text-base font-bold text-foreground">{label}</p>
                <p className="text-2xl font-bold text-[#6600CC] mt-0.5">
                  {price}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  6,99 € / crédit
                </p>
              </div>
              <CheckoutButton
                action={startCheckout.bind(null, "credits", quantity)}
                className="w-full py-2.5 text-sm font-semibold text-[#6600CC] border border-[#6600CC]/30 rounded-full hover:bg-[#f3ebff] transition-colors"
              >
                Acheter →
              </CheckoutButton>
            </div>
          ))}
        </div>
      </section>

      {/* ── Billing note ────────────────────────────────────────────────────── */}
      <p className="text-xs text-gray-400 leading-relaxed">
        Paiements sécurisés par Stripe. L&apos;abonnement se renouvelle
        automatiquement chaque mois et peut être annulé à tout moment depuis
        le portail de gestion.
      </p>
    </div>
  );
}
