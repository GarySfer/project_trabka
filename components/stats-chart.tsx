"use client";

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartDataPoint } from "@/types/http-status";

interface StatsChartProps {
  data: ChartDataPoint[];
  totalSearches: number;
}

const chartConfig = {
  count: {
    label: "Searches",
    color: "hsl(210, 100%, 50%)",
  },
};

export function StatsChart({ data, totalSearches }: StatsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Search Statistics</CardTitle>
        <CardDescription>
          {"Distribution of "}{totalSearches}{" search"}{totalSearches !== 1 ? "es" : ""}{" by category"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalSearches === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            Search for HTTP status codes to see statistics here.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  fill="hsl(210, 100%, 50%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
