import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import Bun from "bun";
import { db } from "@/db/client";

const MAX_AGE = 7; // 7 days
const MAX_AGE_CACHE = 5; // 5 minutes

export const auth = betterAuth({
  basePath: "/auth",
  plugins: [openAPI()],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
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
      hash: (password: string) => Bun.password.hash(password),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * MAX_AGE, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * MAX_AGE_CACHE, // 5 minutes
    },
  },
});
