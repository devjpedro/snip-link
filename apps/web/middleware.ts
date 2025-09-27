import { env } from "@snip-link/env";
import { getCookieCache } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/sign-up"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const session = await getCookieCache(request, {
    secret: env.BETTER_AUTH_SECRET,
  });

  if (!(session || PUBLIC_PATHS.includes(path))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && (path === "/login" || path === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
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
