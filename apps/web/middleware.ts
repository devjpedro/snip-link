import { env } from "@snip-link/env";
import { getCookieCache } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/sign-up"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const session = await getCookieCache(request, {
    secret: env.BETTER_AUTH_SECRET,
    isSecure: process.env.NODE_ENV === "production",
    cookiePrefix: "snip-link",
  });

  const isPublicPath = PUBLIC_PATHS.includes(path);
  const isAuthPath = path === "/login" || path === "/sign-up";

  if (!(session || isPublicPath)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();

  if (process.env.NODE_ENV === "production") {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/sign-up",
    "/dashboard/:path*",
    "/analytics/:path*",
  ],
};
