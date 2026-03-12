import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const PLAN_DAYS: Record<string, number> = { rush: 14, chill: 30 };
const PLAN_CREDITS: Record<string, number> = { rush: 2, chill: 4 };

function planActive(profile: {
  role?: string | null;
  premium_expires_at?: string | null;
}): boolean {
  if (profile.role === "admin") return true;
  if (profile.role !== "premium") return false;
  if (!profile.premium_expires_at) return false;
  return new Date(profile.premium_expires_at) > new Date();
}

/**
 * Fulfills a Stripe checkout session: grants premium role and/or credits.
 * Idempotent — safe to call from both the webhook and the success page.
 * Returns true if the session was processed (or had already been processed).
 */
export async function fulfillCheckoutSession(sessionId: string): Promise<boolean> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const admin = createAdminClient();

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return false;

  const userId = session.metadata?.user_id;
  const type = session.metadata?.type as "rush" | "chill" | "credit" | "upgrade" | undefined;
  if (!userId || !type) return false;

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_last_session_id, role, premium_expires_at, plan_type")
    .eq("id", userId)
    .single();

  // Already processed — idempotency guard
  if (profile?.stripe_last_session_id === sessionId) return true;

  if (session.customer) {
    await admin
      .from("profiles")
      .update({ stripe_customer_id: session.customer as string })
      .eq("id", userId);
  }

  if (type === "rush" || type === "chill") {
    const expiresAt = new Date(
      Date.now() + PLAN_DAYS[type] * 24 * 60 * 60 * 1000
    ).toISOString();

    await admin
      .from("profiles")
      .update({
        role: "premium",
        plan_type: type,
        premium_expires_at: expiresAt,
        stripe_last_session_id: sessionId,
      })
      .eq("id", userId);

    await admin.rpc("increment_credits", {
      target_user_id: userId,
      amount: PLAN_CREDITS[type],
    });
  } else if (type === "upgrade") {
    // Extend Rush expiry by 16 days (Rush=14d → Chill=30d) and add 2 credits
    const currentExpiry = profile?.premium_expires_at
      ? new Date(profile.premium_expires_at)
      : new Date();
    const newExpiry = new Date(
      currentExpiry.getTime() + 16 * 24 * 60 * 60 * 1000
    ).toISOString();

    await admin
      .from("profiles")
      .update({
        plan_type: "chill",
        premium_expires_at: newExpiry,
        stripe_last_session_id: sessionId,
      })
      .eq("id", userId);

    await admin.rpc("increment_credits", {
      target_user_id: userId,
      amount: 2,
    });
  } else if (type === "credit") {
    if (planActive(profile ?? {})) {
      await admin.rpc("increment_credits", {
        target_user_id: userId,
        amount: 1,
      });
      await admin
        .from("profiles")
        .update({ stripe_last_session_id: sessionId })
        .eq("id", userId);
    }
  }

  return true;
}
