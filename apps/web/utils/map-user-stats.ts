import type { UserStatsData } from "@/app/types/user-stats";

export const mapUserDashboardStats = (data: UserStatsData) => {
  return {
    totalLinks: data.overview.totalLinks,
    newLinksThisMonth: data.periods.thisMonth.newLinks,
    totalClicks: data.overview.totalClicks,
    clicksVsLastMonth: data.growth.clicksVsLastMonth,
    activeLinks: data.overview.activeLinks,
    inactiveLinks: data.overview.inactiveLinks,
    clickRate: data.overview.clickRate,
    clickRateVsLastMonth: data.growth.clickRateVsLastMonth,
    clicksToday: data.periods.today.clicks,
    clicksVsYesterday: data.growth.clicksVsYesterday,
  };
};

export type MappedUserDashboardStats = ReturnType<typeof mapUserDashboardStats>;
