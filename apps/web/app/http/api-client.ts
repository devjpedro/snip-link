// biome-ignore-all lint/suspicious/noConsole: <Necessary>
import { env } from "@snip-link/env";
import ky from "ky";
import { DELAY } from "../constants/delay";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const isServer = typeof window === "undefined";

// No servidor (SSR / Server Actions) falamos com a API diretamente,
// encaminhando os cookies manualmente (server-to-server não sofre com CORS nem
// SameSite). No browser passamos pelo proxy same-origin "/api/proxy" (rewrite
// no next.config -> Railway), de modo que o cookie de sessão seja first-party.
const prefixUrl = isServer ? env.NEXT_PUBLIC_API_URL : "/api/proxy";

export const api = ky.create({
  prefixUrl,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  hooks: {
    beforeRequest: [
      async (request) => {
        if (process.env.NODE_ENV === "development") {
          await sleep(DELAY);
        }

        if (isServer) {
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            const cookieHeader = cookieStore
              .getAll()
              .map((cookie) => `${cookie.name}=${cookie.value}`)
              .join("; ");

            if (cookieHeader) request.headers.set("Cookie", cookieHeader);
          } catch (error) {
            console.error("Failed to set cookies on request:", error);
          }
        }
      },
    ],
  },
});
