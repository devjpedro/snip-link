import { clientEnv } from "@snip-link/env/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_API_URL,
  basePath: "/auth",
  fetchOptions: {
    credentials: "include",
  },
});

export const { useSession, signIn, signOut } = authClient;
