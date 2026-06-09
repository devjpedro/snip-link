import { env } from "@snip-link/env";
import bcrypt from "bcryptjs";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, jwt, openAPI } from "better-auth/plugins";
import { db } from "../../db/client";
import { schema } from "../../db/schema";

const MAX_AGE = 7; // 7 days

// Provider Google só é configurado quando ambas as credenciais existem.
const googleProvider =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined;

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  // basePath precisa casar com onde a auth roda no front (Next em /api/auth) e
  // com o auth-client — senão o redirect_uri do OAuth sai errado (sem /api).
  basePath: "/api/auth",
  trustedOrigins: [env.NEXT_PUBLIC_BASE_URL, env.NEXT_PUBLIC_API_URL],
  plugins: [openAPI(), jwt(), bearer()],
  ...(googleProvider ? { socialProviders: googleProvider } : {}),
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: env.NEXT_PUBLIC_AUTH_MODE === "password",
    autoSignIn: true,
    requireEmailVerification: false,
    password: {
      hash: (password: string) => bcrypt.hash(password, 10),
      verify: async ({ password, hash }) => bcrypt.compare(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * MAX_AGE,
  },
} satisfies BetterAuthOptions);
