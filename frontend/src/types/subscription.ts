export interface Subscription {
  id: string; // Stripe subscription ID
  user_id: string;
  stripe_customer_id: string;
  status: string; // "active" | "canceled" | "past_due" | "trialing" | …
  current_period_end: string | null;
  cancel_at: string | null;
  created_at: string;
  updated_at: string;
}
