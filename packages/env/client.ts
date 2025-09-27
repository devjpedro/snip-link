/** biome-ignore-all lint/style/noNonNullAssertion: <Necessary> */
import z from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z
    .url()
    .min(1)
    .default(process.env.NEXT_PUBLIC_BASE_URL!),
  NEXT_PUBLIC_API_URL: z.url().min(1).default(process.env.NEXT_PUBLIC_API_URL!),
  BETTER_AUTH_SECRET: z
    .string()
    .min(1)
    .default(process.env.BETTER_AUTH_SECRET!),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
});
