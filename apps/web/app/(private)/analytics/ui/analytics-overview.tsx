"use client";

import { MagicCard } from "@snip-link/ui/components/magic-card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { mapAnalyticsCards } from "@/utils/map-cards";
import type { MappedUserDashboardStats } from "@/utils/map-user-stats";

type AnalyticsOverviewProps = {
  analytics: MappedUserDashboardStats | null;
};

export const AnalyticsOverview = ({ analytics }: AnalyticsOverviewProps) => {
  const stats = mapAnalyticsCards(analytics);

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
