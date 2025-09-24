import { AnalyticsCharts } from "./ui/analytics-charts";
import { AnalyticsOverview } from "./ui/analytics-overview";
import { PopularLinks } from "./ui/popular-links";

export default function AnalyticsPage() {
  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl">Analytics</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Acompanhe o desempenho dos seus links
          </p>
        </div>

        <AnalyticsOverview />

        <AnalyticsCharts />

        <PopularLinks />
      </div>
    </main>
  );
}
