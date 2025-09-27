import { clientEnv } from "@snip-link/env/client";
import { getCookieCache } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/sign-up"];
const NEXT_STATIC = ["/_next/", "/favicon.ico"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (NEXT_STATIC.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  const session = await getCookieCache(request, {
    secret: clientEnv.BETTER_AUTH_SECRET,
  });

  if (!(session || PUBLIC_PATHS.includes(path))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && (path === "/login" || path === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
