import { env } from "@snip-link/env";
import { defineConfig } from "drizzle-kit";
import "./src/lib/compression-polyfill";

export default defineConfig({
  schema: "./src/db/schema/**",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
