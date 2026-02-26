export type UserRole = "admin" | "premium" | "user";

export type HowHeard =
  | "reseaux_sociaux"
  | "ami"
  | "moteur_recherche"
  | "publicite"
  | "ecole"
  | "autre";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  how_heard: HowHeard | null;
  credit_number: number;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
