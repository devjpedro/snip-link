import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { clicks } from "@/db/schema/clicks";
import { HTTP_STATUS } from "@/http/constants/httpStatus";
import { betterAuthPlugin } from "@/http/plugins/better-auth";

const END_OF_DAY_HOURS = 23;
const END_OF_DAY_MINUTES = 59;
const END_OF_DAY_SECONDS = 59;
const END_OF_DAY_MILLISECONDS = 999;

type ClicksByDay = { date: string; clicks: number }[];
type ClicksByMonth = { month: string; clicks: number }[];
type ClicksByHour = { hour: string; clicks: number }[];

const validateLinkId = (linkId: string): boolean => {
  return Boolean(linkId) && linkId.trim() !== "" && linkId !== "{id}";
};

const buildWhereConditions = (linkId: string, from?: string, to?: string) => {
  const whereConditions = [eq(clicks.linkId, linkId)];

  if (from) {
    const fromDate = new Date(from);
    if (!Number.isNaN(fromDate.getTime())) {
      whereConditions.push(gte(clicks.createdAt, fromDate));
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (!Number.isNaN(toDate.getTime())) {
      toDate.setHours(
        END_OF_DAY_HOURS,
        END_OF_DAY_MINUTES,
        END_OF_DAY_SECONDS,
        END_OF_DAY_MILLISECONDS
      );
      whereConditions.push(lte(clicks.createdAt, toDate));
    }
  }

  return whereConditions.length > 1
    ? and(...whereConditions)
    : whereConditions[0];
};

const getBasicStats = async (
  whereClause: ReturnType<typeof buildWhereConditions>
) => {
  const [totalClicksResult, clicksByDay, clicksByMonth] = await Promise.all([
    // total de cliques
    db
      .select({ count: count() })
      .from(clicks)
      .where(whereClause),

    // cliques por dia
    db
      .select({
        date: sql<string>`DATE(${clicks.createdAt})`.as("date"),
        clicks: count(),
      })
      .from(clicks)
      .where(whereClause)
      .groupBy(sql`DATE(${clicks.createdAt})`)
      .orderBy(sql`DATE(${clicks.createdAt})`),

    // cliques por mês
    db
      .select({
        month: sql<string>`to_char(${clicks.createdAt}, 'YYYY-MM')`.as("month"),
        clicks: count(),
      })
      .from(clicks)
      .where(whereClause)
      .groupBy(sql`to_char(${clicks.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${clicks.createdAt}, 'YYYY-MM')`),
  ]);

  return {
    totalClicks: totalClicksResult[0]?.count || 0,
    clicksByDay: clicksByDay as ClicksByDay,
    clicksByMonth: clicksByMonth as ClicksByMonth,
  };
};

// buscar estatísticas por hora
const getHourlyStats = async (linkId: string): Promise<ClicksByHour> => {
  const last24Hours = new Date();
  last24Hours.setHours(last24Hours.getHours() - 24);

  const clicksByHour = await db
    .select({
      hour: sql<string>`EXTRACT(HOUR FROM ${clicks.createdAt})`.as("hour"),
      clicks: count(),
    })
    .from(clicks)
    .where(and(eq(clicks.linkId, linkId), gte(clicks.createdAt, last24Hours)))
    .groupBy(sql`EXTRACT(HOUR FROM ${clicks.createdAt})`)
    .orderBy(sql`EXTRACT(HOUR FROM ${clicks.createdAt})`);

  return clicksByHour as ClicksByHour;
};

export const getLinkStats = new Elysia().use(betterAuthPlugin).get(
  "/:id",
  async ({ params, query, set, user }) => {
    const { id: linkId } = params;

    if (!validateLinkId(linkId)) {
      set.status = HTTP_STATUS.BAD_REQUEST;
      return {
        success: false,
        error: "ID do link é obrigatório.",
      };
    }

    const link = await db.query.links.findFirst({
      where(fields, { eq: eqOp }) {
        return eqOp(fields.id, linkId);
      },
    });

    if (!link) {
      set.status = HTTP_STATUS.NOT_FOUND;
      return {
        success: false,
        error: "Link não encontrado.",
      };
    }

    if (link.userId !== user.id) {
      set.status = HTTP_STATUS.FORBIDDEN;
      return {
        success: false,
        error: "Você não tem permissão para acessar este link.",
      };
    }

    try {
      const whereClause = buildWhereConditions(linkId, query.from, query.to);

      const basicStats = await getBasicStats(whereClause);

      const shouldIncludeHourly = !(query.from || query.to);
      const hourlyStats = shouldIncludeHourly
        ? await getHourlyStats(linkId)
        : [];

      return {
        success: true,
        data: {
          link: {
            id: link.id,
            shortId: link.shortId,
            originalUrl: link.originalUrl,
            customAlias: link.customAlias,
            isActive: link.isActive,
            createdAt: link.createdAt,
          },
          stats: {
            totalClicks: basicStats.totalClicks,
            period: {
              from: query.from || null,
              to: query.to || null,
            },
            clicksByDay: basicStats.clicksByDay.map((item) => ({
              date: item.date,
              clicks: item.clicks,
            })),
            clicksByMonth: basicStats.clicksByMonth.map((item) => ({
              month: item.month,
              clicks: item.clicks,
            })),
            ...(shouldIncludeHourly && {
              clicksByHour: hourlyStats.map((item) => ({
                hour: `${item.hour}:00`,
                clicks: item.clicks,
              })),
            }),
          },
        },
      };
    } catch {
      set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;

      return {
        success: false,
        error: "Erro ao obter as estatísticas do link.",
      };
    }
  },
  {
    detail: {
      summary: "Obter as estatísticas de um link",
      description: "Retorna as estatísticas de um link específico.",
    },
    params: t.Object({
      id: t.String(),
    }),
    query: t.Object({
      from: t.Optional(
        t.String({
          pattern: "^\\d{4}-\\d{2}-\\d{2}$",
          description: "Start date (YYYY-MM-DD)",
        })
      ),
      to: t.Optional(
        t.String({
          pattern: "^\\d{4}-\\d{2}-\\d{2}$",
          description: "End date (YYYY-MM-DD)",
        })
      ),
    }),
    auth: true,
  }
);
