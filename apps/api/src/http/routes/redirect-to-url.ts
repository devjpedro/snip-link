import { env } from "@snip-link/env";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { clicks } from "@/db/schema/clicks";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "../constants/http-status";
import { betterAuthPlugin } from "../plugins/better-auth";

export const redirectToUrl = new Elysia().use(betterAuthPlugin).get(
  "/r/:shortId",
  async ({ params, set, redirect, request, user }) => {
    try {
      const { shortId } = params;

      if (!shortId || shortId.trim() === "" || shortId === "{shortId}") {
        set.status = HTTP_STATUS.BAD_REQUEST;
        return {
          success: false,
          error: "ID do link é obrigatório.",
        };
      }

      const link = await db.query.links.findFirst({
        where(fields, { eq: eqOp, and: andOp, or: orOp }) {
          return andOp(
            orOp(
              eqOp(fields.shortId, shortId),
              eqOp(fields.customAlias, shortId)
            ),
            eqOp(fields.isActive, true)
          );
        },
      });

      if (!link) return redirect(`${env.NEXT_PUBLIC_BASE_URL}/not-found`);

      if (user?.id !== link.userId) {
        await db.insert(clicks).values({
          linkId: link.id,
          userAgent: request.headers.get("user-agent") || null,
          ipAddress:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown",
          referrer: request.headers.get("referer") || null,
        });

        await db
          .update(links)
          .set({ clickCount: link.clickCount + 1 })
          .where(eq(links.id, link.id));
      }

      return redirect(link.originalUrl);
    } catch {
      set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      return {
        success: false,
        error: "Erro interno do servidor.",
      };
    }
  },
  {
    getUser: true,
    detail: {
      summary: "Redirecionar para URL",
      description: "Redireciona para a URL original com base no ID curto",
      tags: ["redirect"],
    },
    params: t.Object({
      shortId: t.String({
        description: "ID curto do link",
        example: "abc123",
      }),
    }),
  }
);
