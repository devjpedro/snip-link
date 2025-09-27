import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const DEFAULT_PORT = 3333;

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(DEFAULT_PORT),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    DATABASE_URL: z.string().min(1).startsWith("postgresql://"),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.url().min(1),
    NEXT_PUBLIC_API_URL: z.url().min(1),
  },
  runtimeEnv: {
    PORT: process.env.PORT,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
});
