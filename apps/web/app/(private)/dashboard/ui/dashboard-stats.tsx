"use client";

import { MagicCard } from "@snip-link/ui/components/magic-card";
import { mapDashboardCards } from "@/utils/map-cards";
import type { MappedUserDashboardStats } from "@/utils/map-user-stats";

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
