import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/sign-up"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // getSessionCookie resolve o nome correto do cookie, incluindo o prefixo
  // "__Secure-" usado pelo Better Auth em produção (HTTPS).
  const sessionToken = getSessionCookie(request);

  if (!(sessionToken || PUBLIC_PATHS.includes(path))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionToken && (path === "/login" || path === "/sign-up")) {
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
