import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { env } from "@snip-link/env";
import Elysia from "elysia";
import { betterAuthPlugin, OpenAPI } from "./plugins/better-auth";
import { analyticsRoutes } from "./routes/analytics";
import { linksRoutes } from "./routes/links";
import { redirectToUrl } from "./routes/redirect-to-url";

const isProduction = process.env.NODE_ENV === "production";

const app = new Elysia()
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get("origin");

        if (isProduction) {
          return origin?.endsWith(".up.railway.app") ?? false;
        }

        return origin?.includes("localhost") ?? false;
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      exposeHeaders: ["Authorization", "Set-Cookie"],
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
