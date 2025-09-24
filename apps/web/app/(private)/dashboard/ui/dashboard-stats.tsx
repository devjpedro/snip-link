"use client";

import { MagicCard } from "@snip-link/ui/components/magic-card";
import { BarChart3, Link2, MousePointer, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total de Links",
    value: "12",
    change: "+2 este mês",
    icon: Link2,
    color: "text-primary",
  },
  {
    title: "Total de Cliques",
    value: "1,234",
    change: "+15% vs mês anterior",
    icon: MousePointer,
    color: "text-green-500",
  },
  {
    title: "Links Ativos",
    value: "10",
    change: "2 inativos",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    title: "Taxa de Cliques",
    value: "8.2%",
    change: "+2.1% vs mês anterior",
    icon: BarChart3,
    color: "text-orange-500",
  },
];

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {stats.map((stat, index) => (
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
