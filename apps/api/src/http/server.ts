import openapi from "@elysiajs/openapi";
import { env } from "@snip-link/env";
import { Elysia } from "elysia";
import { OpenAPI } from "./plugins/better-auth";
import { analyticsRoutes } from "./routes/analytics";
import { linksRoutes } from "./routes/links";
import { redirectToUrl } from "./routes/redirect-to-url";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .use(linksRoutes)
  .use(redirectToUrl)
  .use(analyticsRoutes)
  .get("/health", () => "OK")
  .listen(env.PORT);

// biome-ignore lint/suspicious/noConsole: <Necessary for logging>
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
