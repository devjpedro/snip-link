import { getUserStats } from "@/app/http/get-user-stats";
import { isApiSuccess } from "@/utils/api-guards";
import { mapUserDashboardStats } from "@/utils/map-user-stats";
import { AnalyticsCharts } from "./ui/analytics-charts";
import { AnalyticsOverview } from "./ui/analytics-overview";
import { PopularLinks } from "./ui/popular-links";

export default async function AnalyticsPage() {
  const userStats = await getUserStats();

  if (!isApiSuccess(userStats)) {
    return {
      cardsData: null,
      chartsData: null,
      popularLinks: null,
    };
  }

  const { data } = userStats;

  const cardsData = mapUserDashboardStats(data);
  const chartsData = data.charts;
  const popularLinks = data.popularLinks;

  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl">Analytics</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Acompanhe o desempenho dos seus links
          </p>
        </div>

        <AnalyticsOverview analytics={cardsData} />

        <AnalyticsCharts charts={chartsData} />

        <PopularLinks links={popularLinks} />
      </div>
    </main>
  );
}
