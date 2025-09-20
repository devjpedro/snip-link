import { Elysia } from "elysia";

const PORT = 3333;

const app = new Elysia().get("/", () => "hi").listen(PORT);

// biome-ignore lint/suspicious/noConsole: <Necessary for logging>
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
