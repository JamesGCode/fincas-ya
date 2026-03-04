import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_PATHS = [
  "/admin/properties",
  "/admin/knowledge",
  "/admin/conversations",
];

// Routes that are always public (even inside /admin)
const PUBLIC_PATHS = ["/admin/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("better-auth.session_data") ||
    request.cookies.has("__Secure-better-auth.session_token");

  // If already logged in, redirect away from login page to dashboard
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin/properties", request.url));
    }
    return NextResponse.next();
  }

  // Check if this is a protected admin route
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected) {
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/properties/:path*",
    "/admin/knowledge/:path*",
    "/admin/conversations/:path*",
    "/admin/login",
  ],
};
