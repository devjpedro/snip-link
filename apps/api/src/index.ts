import { env } from "@snip-link/env";
import { Elysia } from "elysia";

const PORT = env.PORT;

const app = new Elysia().get("/", () => "hi").listen(PORT);

// biome-ignore lint/suspicious/noConsole: <Necessary for logging>
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
