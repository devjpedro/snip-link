import z from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url().min(1),
  NEXT_PUBLIC_API_URL: z.string().url().min(1),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
