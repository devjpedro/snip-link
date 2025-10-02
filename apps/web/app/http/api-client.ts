// biome-ignore-all lint/suspicious/noConsole: <Necessary>

import { env } from "@snip-link/env";
import ky from "ky";
import { DELAY } from "../constants/delay";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
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

        if (typeof window === "undefined") {
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
