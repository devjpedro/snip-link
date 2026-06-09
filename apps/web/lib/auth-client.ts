import { env } from "@snip-link/env";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // As chamadas de auth passam pelo handler local do Next (/api/auth), no mesmo
  // domínio do front. Assim o cookie de sessão é first-party e funciona mesmo
  // com front (Vercel) e API (Railway) em domínios diferentes.
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  basePath: "/api/auth",
});

export const { useSession, signIn, signUp, signOut } = authClient;
