import { and, count, desc, eq, gte, like, lte, or } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "@/http/constants/http-status";
import { betterAuthPlugin } from "@/http/plugins/better-auth";

const PAGE_SIZE = 10;

const statusEnum = t.Enum({ active: "active", inactive: "inactive" });

const buildSearchConditions = (searchText: string) => {
  return (fields: typeof links) => {
    const conditions = [
      like(fields.shortId, `%${searchText}%`),
      like(fields.originalUrl, `%${searchText}%`),
    ];

    if (fields.customAlias) {
      conditions.push(like(fields.customAlias, `%${searchText}%`));
    }

    return or(...conditions);
  };
};

// biome-ignore lint/nursery/useMaxParams: <NECESSARY>
const buildWhereConditions = (
  userId: string,
  linkId?: string,
  status?: "active" | "inactive",
  from?: string,
  to?: string,
  searchText?: string
) => {
  // biome-ignore lint/suspicious/noExplicitAny: <NECESSARY>
  return (fields: any) => {
    const conditions = [eq(fields.userId, userId)];

    if (linkId) conditions.push(eq(fields.id, linkId));
    if (status === "active") conditions.push(eq(fields.isActive, true));
    if (status === "inactive") conditions.push(eq(fields.isActive, false));
    if (from) conditions.push(gte(fields.createdAt, new Date(from)));
    if (to) conditions.push(lte(fields.createdAt, new Date(to)));

    if (searchText) {
      const searchConditions = buildSearchConditions(searchText)(fields);
      if (searchConditions) {
        conditions.push(searchConditions);
      }
    }

    return and(...conditions);
  };
};

export const getLinks = new Elysia().use(betterAuthPlugin).get(
  "/",
  async ({ user, query, set }) => {
    const { pageIndex, linkId, status, from, to, searchText } = query;

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
        return buildWhereConditions(
          user.id,
          linkId,
          status,
          from,
          to,
          searchText
        )(fields);
      });

    const [amountOfLinksQuery, allLinks] = await Promise.all([
      db.select({ count: count() }).from(baseQuery.as("baseQuery")),
      db
        .select()
        .from(baseQuery.as("baseQuery"))
        .limit(PAGE_SIZE)
        .offset(pageIndex * PAGE_SIZE)
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
        nextPageIndex:
          amountOfLinks > (pageIndex + 1) * PAGE_SIZE ? pageIndex + 1 : null,
        pageSize: PAGE_SIZE,
        totalCount: amountOfLinks,
      },
    };
  },
  {
    auth: true,
    query: t.Object({
      searchText: t.Optional(t.String()),
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
