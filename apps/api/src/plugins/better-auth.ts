/** biome-ignore-all lint/suspicious/noExplicitAny lint/suspicious/noAssignInExpressions lint/style/noMagicNumbers: <Necessary> */

import Elysia from "elysia";
import { auth } from "@/lib/auth";

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const betterAuthPlugin = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

export const OpenAPI = {
  getPaths: (prefix = "/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        const pathValue = paths[path];

        if (pathValue) {
          reference[key] = pathValue;

          for (const method of Object.keys(pathValue)) {
            const operation = (reference[key] as any)[method];

            operation.tags = ["auth"];
          }
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
