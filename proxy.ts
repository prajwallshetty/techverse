import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);
import { NextResponse } from "next/server";
import type { UserRole } from "@/types/domain";
import { ROLE_DASHBOARD } from "@/types/domain";

const publicPaths = ["/", "/signin", "/signup", "/verify", "/onboarding", "/api/auth", "/api/health", "/api/i18n", "/api/twilio", "/api/marketplace/seed"];


const roleToDashboard: Record<string, UserRole> = {
  "/dashboard/farmer": "farmer",
  "/dashboard/warehouse": "warehouse_owner",
  "/dashboard/trader": "trader",
  "/dashboard/admin": "admin",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const session = req.auth;

  // Not authenticated → redirect to signin
  if (!session?.user) {
    const signinUrl = new URL("/signin", req.nextUrl.origin);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  const userRole = session.user.role as UserRole | undefined | null;

  // Check role-based dashboard access
  if (pathname.startsWith("/dashboard") && userRole) {
    // Find matching dashboard path
    const matchedEntry = Object.entries(roleToDashboard).find(([path]) =>
      pathname.startsWith(path),
    );

    if (matchedEntry) {
      const [, requiredRole] = matchedEntry;
      if (userRole !== requiredRole) {
        // Redirect to the user's own dashboard
        const correctDashboard =
          ROLE_DASHBOARD[userRole ?? "farmer"] ?? "/dashboard";
        return NextResponse.redirect(
          new URL(correctDashboard, req.nextUrl.origin),
        );
      }
    }

    // /dashboard root — redirect to role-specific dashboard
    if (pathname === "/dashboard") {
      const dashboard =
        ROLE_DASHBOARD[userRole ?? "farmer"] ?? "/dashboard/farmer";
      return NextResponse.redirect(new URL(dashboard, req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
