import { hashSync, verifySync } from "@node-rs/bcrypt";
import { env } from "@snip-link/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "../../db/client";

const MAX_AGE = 7; // 7 days
const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  basePath: "/auth",
  trustedOrigins: [
    env.NEXT_PUBLIC_BASE_URL,
    env.NEXT_PUBLIC_API_URL,
    "https://*.up.railway.app",
  ],
  plugins: [openAPI()],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: false,
    },
    cookiePrefix: "snip-link",
    useSecureCookies: isProduction,
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => hashSync(password, 10),
      verify: async ({ password, hash }) => verifySync(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * MAX_AGE,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * MAX_AGE,
    },
  },
});
