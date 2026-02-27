import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Any authenticated user
const AUTH_ONLY_PATHS = ["/dashboard", "/exam"];
// Authenticated + premium (or admin) role
const PREMIUM_PATHS = ["/exercices", "/mockexams"];

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

  // ── Unauthenticated → /login ─────────────────────────────────────────────
  if ((needsAuth || needsPremium) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ── Authenticated but not premium → /premium-required ───────────────────
  if (needsPremium && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isPremium =
      profile?.role === "premium" || profile?.role === "admin";

    if (!isPremium) {
      const url = request.nextUrl.clone();
      url.pathname = "/premium-required";
      return NextResponse.redirect(url);
    }
  }

  // ── /reset-password requires a valid session ─────────────────────────────
  if (!user && pathname === "/reset-password") {
    const url = request.nextUrl.clone();
    url.pathname = "/forgot-password";
    return NextResponse.redirect(url);
  }

  // ── Redirect authenticated users away from auth pages ────────────────────
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
