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

const BAR_TOP_RADIUS = 4;

const clicksData = [
  { date: "18/01", clicks: 10 },
  { date: "19/01", clicks: 15 },
  { date: "20/01", clicks: 30 },
  { date: "21/01", clicks: 55 },
  { date: "22/01", clicks: 85 },
  { date: "23/01", clicks: 159 },
];

const hourlyData = [
  { hour: "00:00", clicks: 2 },
  { hour: "06:00", clicks: 5 },
  { hour: "09:00", clicks: 25 },
  { hour: "12:00", clicks: 45 },
  { hour: "15:00", clicks: 35 },
  { hour: "18:00", clicks: 55 },
  { hour: "21:00", clicks: 30 },
];

export const AnalyticsCharts = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Cliques ao Longo do Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={300} width="100%">
            <LineChart data={clicksData}>
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
          <CardTitle>Distribuição por Horário</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={300} width="100%">
            <BarChart data={hourlyData}>
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
