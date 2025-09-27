import { defineConfig } from "drizzle-kit";
import "./src/http/lib/compression-polyfill";
import { env } from "@snip-link/env";

export default defineConfig({
  schema: "./src/db/schema/**",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
