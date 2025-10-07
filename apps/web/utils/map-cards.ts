import {
  BarChart3,
  Calendar,
  Link2,
  MousePointer,
  TrendingUp,
} from "lucide-react";
import type { MappedUserDashboardStats } from "./map-user-stats";

type ChangeType = "increase" | "decrease";

const formatChange = (value: number, includePercent = true): string => {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}${includePercent ? "%" : ""}`;
};

const getChangeType = (value: number): ChangeType => {
  return value >= 0 ? "increase" : "decrease";
};

export const mapAnalyticsCards = (
  analyticsData: MappedUserDashboardStats | null
) => {
  const data = analyticsData ?? {
    totalLinks: 0,
    newLinksThisMonth: 0,
    totalClicks: 0,
    clicksVsLastMonth: 0,
    clicksToday: 0,
    clicksVsYesterday: 0,
    clickRate: 0,
    clickRateVsLastMonth: 0,
  };

  return [
    {
      title: "Total de Links",
      value: data.totalLinks.toString(),
      change: `+${data.newLinksThisMonth}`,
      changeType: "increase" as const,
      period: "este mês",
      icon: Link2,
      color: "text-primary",
    },
    {
      title: "Total de Cliques",
      value: data.totalClicks.toLocaleString("pt-BR"),
      change: formatChange(data.clicksVsLastMonth),
      changeType: getChangeType(data.clicksVsLastMonth),
      period: "vs mês anterior",
      icon: MousePointer,
      color: "text-green-500",
    },
    {
      title: "Cliques Hoje",
      value: data.clicksToday.toString(),
      change: formatChange(data.clicksVsYesterday),
      changeType: getChangeType(data.clicksVsYesterday),
      period: "vs ontem",
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "Taxa de Cliques",
      value: `${data.clickRate.toFixed(1)}%`,
      change: formatChange(data.clickRateVsLastMonth, true),
      changeType: getChangeType(data.clickRateVsLastMonth),
      period: "vs mês anterior",
      icon: BarChart3,
      color: "text-orange-500",
    },
  ];
};

export const mapDashboardCards = (
  statsData: MappedUserDashboardStats | null
) => {
  return [
    {
      title: "Total de Links",
      value: (statsData?.totalLinks ?? 0).toString(),
      change: `${formatChange(statsData?.newLinksThisMonth ?? 0, false)} este mês`,
      icon: Link2,
      color: "text-primary",
    },
    {
      title: "Total de Cliques",
      value: (statsData?.totalClicks ?? 0).toLocaleString("pt-BR"),
      change: `${formatChange(statsData?.clicksVsLastMonth ?? 0)} vs mês anterior`,
      icon: MousePointer,
      color: "text-green-500",
    },
    {
      title: "Links Ativos",
      value: (statsData?.activeLinks ?? 0).toString(),
      change: `${statsData?.inactiveLinks ?? 0} ${statsData?.inactiveLinks === 1 ? "inativo" : "inativos"}`,
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Taxa de Cliques",
      value: `${(statsData?.clickRate ?? 0).toFixed(1)}%`,
      change: `${formatChange(statsData?.clickRateVsLastMonth ?? 0)} vs mês anterior`,
      icon: BarChart3,
      color: "text-orange-500",
    },
  ];
};
