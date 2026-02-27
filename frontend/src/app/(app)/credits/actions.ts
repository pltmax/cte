"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

async function getAccessToken(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");
  return session.access_token;
}

export async function startCheckout(
  type: "subscription" | "credits",
  quantity: number = 1
): Promise<void> {
  const token = await getAccessToken();

  const res = await fetch(`${API_URL}/api/v1/stripe/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type, quantity }),
  });

  if (!res.ok) {
    throw new Error("Failed to create checkout session");
  }

  const { url }: { url: string } = await res.json();
  redirect(url);
}

export async function openBillingPortal(): Promise<void> {
  const token = await getAccessToken();

  const res = await fetch(`${API_URL}/api/v1/stripe/portal`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create portal session");
  }

  const { url }: { url: string } = await res.json();
  redirect(url);
}
