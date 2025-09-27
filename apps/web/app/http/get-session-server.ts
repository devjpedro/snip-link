import { auth } from "@snip-link/api/auth";
import { headers } from "next/headers";

export const getSessionServer = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
};
