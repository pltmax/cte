"use server";

import Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type FormState = { error?: string; success?: boolean } | null;

const PRICE_IDS: Record<string, string> = {
  rush: process.env.STRIPE_RUSH_PRICE_ID!,
  chill: process.env.STRIPE_CHILL_PRICE_ID!,
  upgrade: process.env.STRIPE_UPGRADE_PRICE_ID!,
  credit: process.env.STRIPE_CREDIT_PRICE_ID!,
};

function planActive(profile: {
  role?: string | null;
  premium_expires_at?: string | null;
}): boolean {
  if (profile.role === "admin") return true;
  if (profile.role !== "premium") return false;
  if (!profile.premium_expires_at) return false;
  return new Date(profile.premium_expires_at) > new Date();
}

export async function updateProfile(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: (formData.get("first_name") as string).trim() || null,
      last_name: (formData.get("last_name") as string).trim() || null,
      phone: (formData.get("phone") as string).trim() || null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/parametres");
  return { success: true };
}

export async function updatePassword(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const password = (formData.get("password") as string).trim();
  const confirm = (formData.get("confirm") as string).trim();

  if (!password) return { error: "Veuillez saisir un nouveau mot de passe." };
  if (password.length < 8)
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  if (password !== confirm)
    return { error: "Les mots de passe ne correspondent pas." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { success: true };
}

export async function startCheckout(
  type: "rush" | "chill" | "credit" | "upgrade"
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, stripe_customer_id, role, premium_expires_at, plan_type")
    .eq("id", user.id)
    .single();

  const active = planActive(profile ?? {});

  if ((type === "rush" || type === "chill") && active) {
    throw new Error(
      "Vous avez déjà un forfait actif. Attendez son expiration avant d'en acheter un nouveau."
    );
  }
  if (type === "upgrade" && (!active || profile?.plan_type !== "rush")) {
    throw new Error(
      "L'upgrade est uniquement disponible pour les abonnés Rush actifs."
    );
  }
  if (type === "credit" && !active) {
    throw new Error(
      "Un forfait Rush ou Chill actif est requis pour acheter des crédits supplémentaires."
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

  // Get or create Stripe customer
  let customerId: string = profile?.stripe_customer_id ?? "";
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? "",
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const priceId = PRICE_IDS[type];
  if (!priceId) throw new Error(`Prix Stripe manquant pour le type : ${type}`);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { user_id: user.id, type },
    success_url: `${APP_URL}/credits/success?type=${type}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/parametres`,
  });

  if (!session.url) throw new Error("Stripe n'a pas retourné d'URL de paiement.");
  redirect(session.url);
}
