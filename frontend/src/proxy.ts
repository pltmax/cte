import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Any authenticated user
const AUTH_ONLY_PATHS = ["/dashboard", "/exam", "/guides", "/exercices", "/parametres", "/diagnostic", "/credits"];
// Authenticated + premium (or admin) role — full page block
const PREMIUM_PATHS = ["/mockexams", "/guides/vocabulaire", "/guides/grammaire"];
// Exercise pages accessible without a premium plan
const FREE_EXERCISE_PATHS = new Set([
  "/exercices/partie-1/1",
  "/exercices/partie-5/1",
]);

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const needsAuth = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));
  const needsPremium = PREMIUM_PATHS.some((p) => pathname.startsWith(p));

  // Individual exercise sub-pages that are NOT free require premium
  const isLockedExercise =
    /^\/exercices\/partie-\d+(\/multi)?\/\d+/.test(pathname) &&
    !FREE_EXERCISE_PATHS.has(pathname);

  // ── Unauthenticated → /login ──────────────────────────────────────────────
  if ((needsAuth || needsPremium || isLockedExercise) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ── Premium check (full-block paths + locked exercise pages) ─────────────
  if ((needsPremium || isLockedExercise) && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isPremium =
      profile?.role === "premium" || profile?.role === "admin";

    if (!isPremium) {
      const url = request.nextUrl.clone();
      url.pathname = needsPremium ? "/premium-required" : "/exercices";
      return NextResponse.redirect(url);
    }
  }

  // ── /reset-password requires a valid session ──────────────────────────────
  if (!user && pathname === "/reset-password") {
    const url = request.nextUrl.clone();
    url.pathname = "/forgot-password";
    return NextResponse.redirect(url);
  }

  // ── Redirect authenticated users away from auth pages ────────────────────
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, premium_expires_at")
      .eq("id", user.id)
      .single();
    const role: string = profile?.role ?? "user";
    const expiresAt: string | null = profile?.premium_expires_at ?? null;
    const isPremium =
      role === "admin" ||
      (role === "premium" && expiresAt !== null && new Date(expiresAt) > new Date());
    const url = request.nextUrl.clone();
    url.pathname = isPremium ? "/exercices" : "/diagnostic";
    return NextResponse.redirect(url);
  }

  // ── /dashboard → smart redirect based on role ────────────────────────────
  if (user && pathname === "/dashboard") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, premium_expires_at")
      .eq("id", user.id)
      .single();
    const role: string = profile?.role ?? "user";
    const expiresAt: string | null = profile?.premium_expires_at ?? null;
    const isPremium =
      role === "admin" ||
      (role === "premium" && expiresAt !== null && new Date(expiresAt) > new Date());
    const url = request.nextUrl.clone();
    url.pathname = isPremium ? "/exercices" : "/diagnostic";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
