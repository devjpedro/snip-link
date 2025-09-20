import { resolve } from "node:path";
import { config } from "dotenv";
import z from "zod";

config({ path: resolve(process.cwd(), "../../.env") });

const DEFAULT_PORT = 3333;

const envSchema = z.object({
  PORT: z.coerce.number().default(DEFAULT_PORT),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
  DATABASE_URL: z.string().min(1).startsWith("postgresql://"),
});

export const env = envSchema.parse(process.env);
