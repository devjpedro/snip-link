import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/sign-up"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const sessionToken = request.cookies.get("better-auth.session_token");

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
