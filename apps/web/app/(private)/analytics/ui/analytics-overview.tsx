"use client";

import { MagicCard } from "@snip-link/ui/components/magic-card";
import {
  BarChart3,
  Calendar,
  Link2,
  MousePointer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total de Links",
    value: "12",
    change: "+2",
    changeType: "increase" as const,
    period: "este mês",
    icon: Link2,
    color: "text-primary",
  },
  {
    title: "Total de Cliques",
    value: "1,234",
    change: "+15%",
    changeType: "increase" as const,
    period: "vs mês anterior",
    icon: MousePointer,
    color: "text-green-500",
  },
  {
    title: "Cliques Hoje",
    value: "25",
    change: "-5%",
    changeType: "decrease" as const,
    period: "vs ontem",
    icon: Calendar,
    color: "text-primary",
  },
  {
    title: "Taxa de Cliques",
    value: "8.2%",
    change: "+2.1%",
    changeType: "increase" as const,
    period: "vs mês anterior",
    icon: BarChart3,
    color: "text-orange-500",
  },
];

export const AnalyticsOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <MagicCard
          className="p-4 sm:p-6"
          key={`stat-card-${stat.title}-${index}`}
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-muted-foreground text-xs sm:text-sm">
              {stat.title}
            </h3>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div className="space-y-2">
            <div className="font-bold text-xl sm:text-2xl">{stat.value}</div>
            <div className="flex items-center text-xs">
              {stat.changeType === "increase" ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span
                className={
                  stat.changeType === "increase"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {stat.change}
              </span>
              <span className="ml-1 hidden text-muted-foreground sm:inline">
                {stat.period}
              </span>
            </div>
          </div>
        </MagicCard>
      ))}
    </div>
  );
};
