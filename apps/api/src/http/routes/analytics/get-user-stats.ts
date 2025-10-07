import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { clicks } from "@/db/schema/clicks";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "@/http/constants/http-status";
import { betterAuthPlugin } from "@/http/plugins/better-auth";

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

type ClicksByHour = {
  hour: string;
  clicks: number;
}[];

const DEFAULT_CHART_DAYS = 30;
const LIMIT_POPULAR_LINKS = 5;

const getAllUserStats = async (userId: string, chartDays = 30) => {
  const now = new Date();

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const monthAgo = new Date(now);
  monthAgo.setMonth(now.getMonth() - 1);
  monthAgo.setHours(0, 0, 0, 0);

  const lastMonthStart = new Date(monthAgo);
  lastMonthStart.setDate(1);

  const lastMonthEnd = new Date(now);
  lastMonthEnd.setMonth(now.getMonth() - 1);
  lastMonthEnd.setDate(0);
  // biome-ignore lint/style/noMagicNumbers: <Necessary>
  lastMonthEnd.setHours(23, 59, 59, 999);

  const chartStartDate = new Date(now);
  chartStartDate.setDate(now.getDate() - chartDays);
  chartStartDate.setHours(0, 0, 0, 0);

  const mainStatsQuery = db
    .select({
      // Estatísticas gerais
      totalLinks: sql<number>`COUNT(DISTINCT ${links.id})`,
      activeLinks: sql<number>`SUM(CASE WHEN ${links.isActive} = true THEN 1 ELSE 0 END)`,
      totalClicks: sql<number>`COUNT(${clicks.id})`,

      // Estatísticas do período
      todayClicks: sql<number>`SUM(CASE 
        WHEN ${clicks.createdAt} >= ${today.toISOString()} 
        THEN 1 ELSE 0 END)`,

      yesterdayClicks: sql<number>`SUM(CASE 
        WHEN ${clicks.createdAt} >= ${yesterday.toISOString()} 
        AND ${clicks.createdAt} < ${today.toISOString()} 
        THEN 1 ELSE 0 END)`,

      thisMonthClicks: sql<number>`SUM(CASE 
        WHEN ${clicks.createdAt} >= ${monthAgo.toISOString()} 
        THEN 1 ELSE 0 END)`,

      thisMonthLinks: sql<number>`SUM(CASE 
        WHEN ${links.createdAt} >= ${monthAgo.toISOString()} 
        THEN 1 ELSE 0 END)`,

      lastMonthClicks: sql<number>`SUM(CASE 
        WHEN ${clicks.createdAt} >= ${lastMonthStart.toISOString()} 
        AND ${clicks.createdAt} <= ${lastMonthEnd.toISOString()} 
        THEN 1 ELSE 0 END)`,

      lastMonthLinks: sql<number>`SUM(CASE 
        WHEN ${links.createdAt} >= ${lastMonthStart.toISOString()} 
        AND ${links.createdAt} <= ${lastMonthEnd.toISOString()} 
        THEN 1 ELSE 0 END)`,
    })
    .from(links)
    .leftJoin(clicks, eq(clicks.linkId, links.id))
    .where(eq(links.userId, userId));

  const clicksByHourQuery = db
    .select({
      hour: sql<string>`CAST(EXTRACT(HOUR FROM ${clicks.createdAt}) AS TEXT)`.as(
        "hour"
      ),
      clicks: count(),
    })
    .from(clicks)
    .innerJoin(links, eq(clicks.linkId, links.id))
    .where(and(eq(links.userId, userId), gte(clicks.createdAt, chartStartDate)))
    .groupBy(sql`EXTRACT(HOUR FROM ${clicks.createdAt})`)
    .orderBy(sql`EXTRACT(HOUR FROM ${clicks.createdAt})`);

  const clicksOverTimeQuery = db
    .select({
      date: sql<string>`DATE(${clicks.createdAt})`.as("date"),
      clicks: count(),
    })
    .from(clicks)
    .innerJoin(links, eq(clicks.linkId, links.id))
    .where(and(eq(links.userId, userId), gte(clicks.createdAt, chartStartDate)))
    .groupBy(sql`DATE(${clicks.createdAt})`)
    .orderBy(sql`DATE(${clicks.createdAt})`);

  const popularLinksQuery = db
    .select({
      id: links.id,
      shortId: links.shortId,
      originalUrl: links.originalUrl,
      customAlias: links.customAlias,
      clicks: sql<number>`COALESCE(COUNT(${clicks.id}), 0)`.as("clicks"),
    })
    .from(links)
    .leftJoin(clicks, eq(clicks.linkId, links.id))
    .where(and(eq(links.userId, userId), eq(links.isActive, true)))
    .groupBy(links.id, links.shortId, links.originalUrl, links.customAlias)
    .orderBy(desc(sql`COALESCE(COUNT(${clicks.id}), 0)`))
    .limit(LIMIT_POPULAR_LINKS);

  const [mainStats, clicksOverTime, popularLinks, clicksByHour] =
    await Promise.all([
      mainStatsQuery,
      clicksOverTimeQuery,
      popularLinksQuery,
      clicksByHourQuery,
    ]);

  return {
    mainStats: mainStats[0] || {
      totalLinks: 0,
      activeLinks: 0,
      totalClicks: 0,
      todayClicks: 0,
      yesterdayClicks: 0,
      thisMonthClicks: 0,
      thisMonthLinks: 0,
      lastMonthClicks: 0,
      lastMonthLinks: 0,
    },
    clicksOverTime: clicksOverTime as ClicksOverTime,
    popularLinks: popularLinks.map((link) => ({
      ...link,
      clicks: Number(link.clicks) || 0,
    })) as PopularLinks,
    clicksByHour: clicksByHour as ClicksByHour,
  };
};

const PERCENT = 100;

const calculateGrowthPercentage = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return current > 0 ? PERCENT : 0;
  return (
    Math.round(((current - previous) / previous) * PERCENT * PERCENT) / PERCENT
  );
};

const calculateClickRate = (
  totalClicks: number,
  totalLinks: number
): number => {
  if (totalLinks === 0) return 0;
  return Math.round((totalClicks / totalLinks) * PERCENT * PERCENT) / PERCENT;
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
      // Uma única função que otimiza as consultas
      const { mainStats, clicksOverTime, popularLinks, clicksByHour } =
        await getAllUserStats(
          user.id,
          Number(query.days) || DEFAULT_CHART_DAYS
        );

      // Cálculos simples em memória
      const totalLinksNum = Number(mainStats.totalLinks);
      const activeLinksNum = Number(mainStats.activeLinks);
      const totalClicksNum = Number(mainStats.totalClicks);
      const todayClicksNum = Number(mainStats.todayClicks);
      const yesterdayClicksNum = Number(mainStats.yesterdayClicks);
      const thisMonthClicksNum = Number(mainStats.thisMonthClicks);
      const thisMonthLinksNum = Number(mainStats.thisMonthLinks);
      const lastMonthClicksNum = Number(mainStats.lastMonthClicks);
      const lastMonthLinksNum = Number(mainStats.lastMonthLinks);

      // Calcular percentuais
      const clicksGrowthVsLastMonth = calculateGrowthPercentage(
        thisMonthClicksNum,
        lastMonthClicksNum
      );

      const clicksGrowthVsYesterday = calculateGrowthPercentage(
        todayClicksNum,
        yesterdayClicksNum
      );

      const linksGrowthVsLastMonth = calculateGrowthPercentage(
        thisMonthLinksNum,
        lastMonthLinksNum
      );

      const currentClickRate = calculateClickRate(
        totalClicksNum,
        totalLinksNum
      );
      const lastMonthClickRate = calculateClickRate(
        lastMonthClicksNum,
        lastMonthLinksNum || 1
      );
      const clickRateGrowth = calculateGrowthPercentage(
        currentClickRate,
        lastMonthClickRate
      );

      return {
        success: true,
        data: {
          overview: {
            totalLinks: totalLinksNum,
            activeLinks: activeLinksNum,
            totalClicks: totalClicksNum,
            inactiveLinks: totalLinksNum - activeLinksNum,
            clickRate: currentClickRate,
          },
          periods: {
            today: {
              clicks: todayClicksNum,
              clicksGrowthVsYesterday,
            },
            yesterday: {
              clicks: yesterdayClicksNum,
            },
            thisMonth: {
              clicks: thisMonthClicksNum,
              newLinks: thisMonthLinksNum,
              clicksGrowthVsLastMonth,
              linksGrowthVsLastMonth,
            },
            lastMonth: {
              clicks: lastMonthClicksNum,
              newLinks: lastMonthLinksNum,
            },
          },
          growth: {
            clicksVsLastMonth: clicksGrowthVsLastMonth,
            clicksVsYesterday: clicksGrowthVsYesterday,
            linksVsLastMonth: linksGrowthVsLastMonth,
            clickRateVsLastMonth: clickRateGrowth,
          },
          charts: {
            clicksOverTime: clicksOverTime.map((item) => ({
              date: item.date,
              clicks: item.clicks,
            })),
            clicksByHour,
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
      summary: "Obter estatísticas otimizadas do usuário",
      description:
        "Retorna estatísticas completas do usuário com performance otimizada, usando menos consultas ao banco.",
    },
    query: t.Object({
      days: t.Optional(
        t.Numeric({
          minimum: 1,
          maximum: 365,
          description: "Número de dias para o gráfico de cliques (padrão: 30)",
        })
      ),
    }),
    auth: true,
  }
);
