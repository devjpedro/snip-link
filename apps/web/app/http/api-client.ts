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
      async () => {
        if (process.env.NODE_ENV === "development") {
          await sleep(DELAY);
        }
      },
    ],
  },
});
