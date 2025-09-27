import { getCookieCache } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/sign-up"];

export async function middleware(request: NextRequest) {
  const session = await getCookieCache(request);

  if (!(session || PUBLIC_PATHS.includes(request.nextUrl.pathname))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    session &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/sign-up")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
