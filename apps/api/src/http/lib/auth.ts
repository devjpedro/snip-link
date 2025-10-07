import { env } from "@snip-link/env";
import bcrypt from "bcrypt";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "../../db/client";

const MAX_AGE = 7; // 7 days

export const auth = betterAuth({
  basePath: "/auth",
  trustedOrigins: [env.NEXT_PUBLIC_BASE_URL],
  plugins: [openAPI()],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: false,
    },
    useSecureCookies: env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    password: {
      hash: (password: string) => bcrypt.hash(password, 10),
      verify: async ({ password, hash }) => bcrypt.compare(password, hash),
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
