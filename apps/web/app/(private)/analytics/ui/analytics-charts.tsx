"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@snip-link/ui/components/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Charts } from "@/app/types/user-stats";
import { formatChartsData } from "@/utils/format-chart-data";

const BAR_TOP_RADIUS = 4;

export const AnalyticsCharts = ({ charts }: { charts: Charts }) => {
  const formattedCharts = formatChartsData(charts);

  const { clicksOverTime, clicksByHour } = formattedCharts;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Cliques ao longo do tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={300} width="100%">
            <LineChart data={clicksOverTime}>
              <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
              <XAxis
                className="text-muted-foreground"
                dataKey="date"
                fontSize={12}
              />
              <YAxis className="text-muted-foreground" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Line
                dataKey="clicks"
                dot={{ fill: "var(--primary))" }}
                stroke="var(--primary)"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Distribuição por horário</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={300} width="100%">
            <BarChart data={clicksByHour}>
              <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
              <XAxis
                className="text-muted-foreground"
                dataKey="hour"
                fontSize={12}
              />
              <YAxis className="text-muted-foreground" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="clicks"
                fill="var(--primary)"
                radius={[BAR_TOP_RADIUS, BAR_TOP_RADIUS, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
