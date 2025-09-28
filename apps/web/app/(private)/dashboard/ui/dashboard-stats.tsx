"use client";

import { MagicCard } from "@snip-link/ui/components/magic-card";
import { BarChart3, Link2, MousePointer, TrendingUp } from "lucide-react";
import type { MappedUserDashboardStats } from "@/utils/map-user-stats";

const mapDashboardCards = (statsData: MappedUserDashboardStats | null) => {
  return [
    {
      title: "Total de Links",
      value: (statsData?.totalLinks ?? 0).toString(),
      change: `+${statsData?.newLinksThisMonth ?? 0} este mês`,
      icon: Link2,
      color: "text-primary",
    },
    {
      title: "Total de Cliques",
      value: (statsData?.totalClicks ?? 0).toLocaleString("pt-BR"),
      change: `${(statsData?.clicksVsLastMonth ?? 0) > 0 ? "+" : ""}${statsData?.clicksVsLastMonth ?? 0}% vs mês anterior`,
      icon: MousePointer,
      color: "text-green-500",
    },
    {
      title: "Links Ativos",
      value: (statsData?.activeLinks ?? 0).toString(),
      change: `${statsData?.inactiveLinks ?? 0} inativos`,
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Taxa de Cliques",
      value: `${(statsData?.clickRate ?? 0).toFixed(1)}%`,
      change: `${(statsData?.clickRateVsLastMonth ?? 0) > 0 ? "+" : ""}${statsData?.clickRateVsLastMonth ?? 0}% vs mês anterior`,
      icon: BarChart3,
      color: "text-orange-500",
    },
  ];
};

type DashboardStatsProps = {
  stats: MappedUserDashboardStats | null;
};

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const cards = mapDashboardCards(stats);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {cards.map((stat, index) => (
        <MagicCard
          className="p-4 sm:p-6"
          key={`dashboard-stat-${stat.title}-${index}`}
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-muted-foreground text-xs sm:text-sm">
              {stat.title}
            </h3>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-xl sm:text-2xl">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.change}</p>
          </div>
        </MagicCard>
      ))}
    </div>
  );
};
