/** biome-ignore-all lint/suspicious/noConsole: <Necessary logs> */
/** biome-ignore-all lint/style/noMagicNumbers: <Necessary magic number> */
import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import Elysia from "elysia";
import { betterAuthPlugin, OpenAPI } from "./plugins/better-auth";
import { analyticsRoutes } from "./routes/analytics";
import { linksRoutes } from "./routes/links";
import { redirectToUrl } from "./routes/redirect-to-url";

const isProduction = process.env.NODE_ENV === "production";
const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN;

const allowedOrigin = railwayDomain
  ? `https://${railwayDomain}`
  : "http://localhost:3000";

const port = Number.parseInt(
  process.env.API_PORT ?? process.env.PORT ?? "3333",
  10
);

console.log("🔧 Initializing Elysia server...");
console.log(`📍 Environment: ${process.env.NODE_ENV}`);
console.log(`🔗 Allowed origin: ${allowedOrigin}`);

const app = new Elysia()
  .onStart(() => {
    console.log("✅ Elysia plugins loaded");
  })
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get("origin");

        if (!origin) return true;

        if (isProduction) {
          return origin === allowedOrigin || origin.endsWith(".up.railway.app");
        }

        return origin.includes("localhost");
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
      exposeHeaders: ["Set-Cookie", "Cookie", "Authorization"],
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
  .get("/health", () => {
    console.log("✅ Health check called");
    return {
      status: "ok",
      timestamp: Date.now(),
      service: "snip-link-api",
      version: "1.0.0",
    };
  })
  .listen({
    port,
    hostname: "0.0.0.0",
  });

console.log(`
╔══════════════════════════════════════╗
║  🦊 Elysia Server Running           ║
║  📍 ${app.server?.hostname}:${app.server?.port?.toString().padEnd(19)} ║
║  🌍 ${(process.env.NODE_ENV || "development").padEnd(29)} ║
╚══════════════════════════════════════╝
`);
