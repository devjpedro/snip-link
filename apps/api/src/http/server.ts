import openapi from "@elysiajs/openapi";
import { env } from "@snip-link/env";
import { Elysia } from "elysia";
import { betterAuthPlugin, OpenAPI } from "./plugins/better-auth";
import { linksRoutes } from "./routes/links";
import { redirectToUrl } from "./routes/redirect-to-url";

const app = new Elysia()
  .use(betterAuthPlugin)
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
  .get("/", () => "hi")
  .listen(env.PORT);

// biome-ignore lint/suspicious/noConsole: <Necessary for logging>
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
