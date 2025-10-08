import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { env } from "@snip-link/env";
import Elysia from "elysia";
import { betterAuthPlugin, OpenAPI } from "./plugins/better-auth";
import { analyticsRoutes } from "./routes/analytics";
import { linksRoutes } from "./routes/links";
import { redirectToUrl } from "./routes/redirect-to-url";

const app = new Elysia()
  .use(
    cors({
      origin: env.NEXT_PUBLIC_BASE_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(betterAuthPlugin)
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
        info: {
          title: "SnipLink API",
          version: "1.0.0",
          description: "Documentação oficial da API do SnipLink",
        },
      },
    })
  )
  .use(linksRoutes)
  .use(redirectToUrl)
  .use(analyticsRoutes)
  .get("/health", () => "OK")
  .listen({
    port: env.PORT,
    hostname: "0.0.0.0",
  });

// biome-ignore lint/suspicious/noConsole: <Necessary for logging>
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
