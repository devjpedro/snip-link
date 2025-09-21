import { and, count, desc, eq, gte, lte } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "@/http/constants/httpStatus";
import { betterAuthPlugin } from "@/http/plugins/better-auth";

const statusEnum = t.Enum({ active: "active", inactive: "inactive" });

export const getLinks = new Elysia().use(betterAuthPlugin).get(
  "/",
  async ({ user, query, set }) => {
    const { pageIndex, linkId, status, from, to } = query;

    const baseQuery = db
      .select({
        id: links.id,
        shortId: links.shortId,
        originalUrl: links.originalUrl,
        customAlias: links.customAlias,
        userId: links.userId,
        clickCount: links.clickCount,
        isActive: links.isActive,
        createdAt: links.createdAt,
        updatedAt: links.updatedAt,
      })
      .from(links)
      .where((fields) => {
        const conditions = [eq(fields.userId, user.id)];

        if (linkId) conditions.push(eq(fields.id, linkId));
        if (status === "active") conditions.push(eq(fields.isActive, true));
        if (status === "inactive") conditions.push(eq(fields.isActive, false));
        if (from) conditions.push(gte(fields.createdAt, new Date(from)));
        if (to) conditions.push(lte(fields.createdAt, new Date(to)));

        return and(...conditions);
      });

    const [amountOfLinksQuery, allLinks] = await Promise.all([
      db.select({ count: count() }).from(baseQuery.as("baseQuery")),
      db
        .select()
        .from(baseQuery.as("baseQuery"))
        .limit(10)
        .offset(pageIndex * 10)
        .orderBy((fields) => {
          return [desc(fields.createdAt)];
        }),
    ]);

    const amountOfLinks = amountOfLinksQuery[0]?.count ?? 0;

    set.status = HTTP_STATUS.OK;

    return {
      links: allLinks,
      meta: {
        pageIndex,
        pageSize: 20,
        totalCount: amountOfLinks,
      },
    };
  },
  {
    auth: true,
    query: t.Object({
      linkId: t.Optional(t.String()),
      from: t.Optional(t.String({ format: "date-time" })),
      to: t.Optional(t.String({ format: "date-time" })),
      status: t.Optional(statusEnum),
      pageIndex: t.Numeric({ minimum: 0, default: 0 }),
    }),
    detail: {
      summary: "Obter todos os links do usuário",
      description:
        "Retornar uma lista paginada de links do usuário autenticado.",
    },
  }
);
