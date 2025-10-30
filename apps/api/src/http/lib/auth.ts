import { env } from "@snip-link/env";
import bcrypt from "bcrypt";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, jwt, openAPI } from "better-auth/plugins";
import { db } from "../../db/client";
import { schema } from "../../db/schema";

const MAX_AGE = 7; // 7 days

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  basePath: "/auth",
  trustedOrigins: [env.NEXT_PUBLIC_BASE_URL, env.NEXT_PUBLIC_API_URL],
  plugins: [openAPI(), jwt(), bearer()],
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
  },
} satisfies BetterAuthOptions);
