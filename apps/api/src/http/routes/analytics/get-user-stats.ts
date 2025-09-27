import { and, count, desc, eq, gte, sql, sum } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { clicks } from "@/db/schema/clicks";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "@/http/constants/http-status";
import { betterAuthPlugin } from "@/http/plugins/better-auth";

type PeriodStats = {
  totalClicks: number;
  totalLinks: number;
  activeLinks: number;
};

type ClicksOverTime = {
  date: string;
  clicks: number;
}[];

type PopularLinks = {
  id: string;
  shortId: string;
  originalUrl: string;
  customAlias: string | null;
  clicks: number;
}[];

const DAYS_IN_WEEK = 7;
const DEFAULT_CHART_DAYS = 30;

// obter data de início do período
const getStartDate = (period: string): Date => {
  const now = new Date();

  switch (period) {
    case "today": {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      return today;
    }

    case "week": {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - DAYS_IN_WEEK);
      weekStart.setHours(0, 0, 0, 0);
      return weekStart;
    }

    case "month": {
      const monthStart = new Date(now);
      monthStart.setMonth(now.getMonth() - 1);
      monthStart.setHours(0, 0, 0, 0);
      return monthStart;
    }

    default:
      return new Date("2000-01-01");
  }
};

// obter estatísticas de período específico
const getPeriodStats = async (
  userId: string,
  period: string
): Promise<PeriodStats> => {
  const startDate = getStartDate(period);

  const [totalClicksResult, totalLinksResult, activeLinksResult] =
    await Promise.all([
      // cliques no período
      db
        .select({ count: count() })
        .from(clicks)
        .innerJoin(links, eq(clicks.linkId, links.id))
        .where(and(eq(links.userId, userId), gte(clicks.createdAt, startDate))),

      // links criados no período
      db
        .select({ count: count() })
        .from(links)
        .where(and(eq(links.userId, userId), gte(links.createdAt, startDate))),

      // links ativos criados no período
      db
        .select({ count: count() })
        .from(links)
        .where(
          and(
            eq(links.userId, userId),
            eq(links.isActive, true),
            gte(links.createdAt, startDate)
          )
        ),
    ]);

  return {
    totalClicks: totalClicksResult[0]?.count || 0,
    totalLinks: totalLinksResult[0]?.count || 0,
    activeLinks: activeLinksResult[0]?.count || 0,
  };
};

// obter cliques ao longo do tempo
const getClicksOverTime = async (
  userId: string,
  days = 30
): Promise<ClicksOverTime> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const clicksOverTime = await db
    .select({
      date: sql<string>`DATE(${clicks.createdAt})`.as("date"),
      clicks: count(),
    })
    .from(clicks)
    .innerJoin(links, eq(clicks.linkId, links.id))
    .where(and(eq(links.userId, userId), gte(clicks.createdAt, startDate)))
    .groupBy(sql`DATE(${clicks.createdAt})`)
    .orderBy(sql`DATE(${clicks.createdAt})`);

  return clicksOverTime as ClicksOverTime;
};

// obter links mais populares
const getPopularLinks = async (
  userId: string,
  limit = 10
): Promise<PopularLinks> => {
  const popularLinks = await db
    .select({
      id: links.id,
      shortId: links.shortId,
      originalUrl: links.originalUrl,
      customAlias: links.customAlias,
      clicks: sql<number>`COALESCE(${sum(sql`1`)}, 0)`.as("clicks"),
    })
    .from(links)
    .leftJoin(clicks, eq(clicks.linkId, links.id))
    .where(and(eq(links.userId, userId), eq(links.isActive, true)))
    .groupBy(links.id, links.shortId, links.originalUrl, links.customAlias)
    .orderBy(desc(sql`COALESCE(COUNT(${clicks.id}), 0)`))
    .limit(limit);

  return popularLinks.map((link) => ({
    ...link,
    clicks: Number(link.clicks) || 0,
  })) as PopularLinks;
};

// obter estatísticas gerais
const getOverallStats = async (userId: string) => {
  const [totalLinksResult, activeLinksResult, totalClicksResult] =
    await Promise.all([
      // ttal de links
      db
        .select({ count: count() })
        .from(links)
        .where(eq(links.userId, userId)),

      // links ativos
      db
        .select({ count: count() })
        .from(links)
        .where(and(eq(links.userId, userId), eq(links.isActive, true))),

      // total de cliques
      db
        .select({ count: count() })
        .from(clicks)
        .innerJoin(links, eq(clicks.linkId, links.id))
        .where(eq(links.userId, userId)),
    ]);

  return {
    totalLinks: totalLinksResult[0]?.count || 0,
    activeLinks: activeLinksResult[0]?.count || 0,
    totalClicks: totalClicksResult[0]?.count || 0,
  };
};

export const getUserStats = new Elysia().use(betterAuthPlugin).get(
  "/",
  async ({ query, set, user }) => {
    if (!user?.id) {
      set.status = HTTP_STATUS.UNAUTHORIZED;
      return {
        success: false,
        error: "Usuário não autenticado.",
      };
    }

    try {
      const [
        overallStats,
        todayStats,
        weekStats,
        monthStats,
        clicksOverTime,
        popularLinks,
      ] = await Promise.all([
        getOverallStats(user.id),
        getPeriodStats(user.id, "today"),
        getPeriodStats(user.id, "week"),
        getPeriodStats(user.id, "month"),
        getClicksOverTime(user.id, Number(query.days) || DEFAULT_CHART_DAYS),
        getPopularLinks(user.id, Number(query.limit) || 10),
      ]);

      return {
        success: true,
        data: {
          overview: {
            totalLinks: overallStats.totalLinks,
            activeLinks: overallStats.activeLinks,
            totalClicks: overallStats.totalClicks,
            inactiveLinks: overallStats.totalLinks - overallStats.activeLinks,
          },
          periods: {
            today: {
              clicks: todayStats.totalClicks,
              newLinks: todayStats.totalLinks,
              activeLinks: todayStats.activeLinks,
            },
            thisWeek: {
              clicks: weekStats.totalClicks,
              newLinks: weekStats.totalLinks,
              activeLinks: weekStats.activeLinks,
            },
            thisMonth: {
              clicks: monthStats.totalClicks,
              newLinks: monthStats.totalLinks,
              activeLinks: monthStats.activeLinks,
            },
          },
          charts: {
            clicksOverTime: clicksOverTime.map((item) => ({
              date: item.date,
              clicks: item.clicks,
            })),
          },
          popularLinks: popularLinks.map((link) => ({
            id: link.id,
            shortId: link.shortId,
            originalUrl: link.originalUrl,
            customAlias: link.customAlias,
            clicks: link.clicks,
            displayUrl: link.customAlias || link.shortId,
          })),
        },
      };
    } catch {
      set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;

      return {
        success: false,
        error: "Erro ao obter as estatísticas do usuário.",
      };
    }
  },
  {
    detail: {
      summary: "Obter estatísticas gerais do usuário",
      description:
        "Retorna estatísticas completas do usuário logado, incluindo links, cliques e gráficos.",
    },
    query: t.Object({
      days: t.Optional(
        t.Numeric({
          minimum: 1,
          maximum: 365,
          description: "Número de dias para o gráfico de cliques (padrão: 30)",
        })
      ),
      limit: t.Optional(
        t.Numeric({
          minimum: 1,
          maximum: 50,
          description: "Limite de links populares (padrão: 10)",
        })
      ),
    }),
    auth: true,
  }
);
