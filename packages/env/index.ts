import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const DEFAULT_PORT = 3333;

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(DEFAULT_PORT),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    DATABASE_URL: z.string().min(1).startsWith("postgresql://"),
    // Credenciais do Google OAuth (opcionais; o provider só é ligado se ambas existirem)
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.url().min(1),
    NEXT_PUBLIC_API_URL: z.url().min(1),
    // "password": login email/senha + signup (dev). "google": apenas login com Google (prod).
    NEXT_PUBLIC_AUTH_MODE: z.enum(["password", "google"]).default("password"),
  },
  runtimeEnv: {
    PORT: process.env.PORT,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_MODE: process.env.NEXT_PUBLIC_AUTH_MODE,
  },
  emptyStringAsUndefined: true,
});
