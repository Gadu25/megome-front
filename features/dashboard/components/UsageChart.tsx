"use client";

import type { DailyUsage } from "@/types/api";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function UsageChart({ data }: { data: DailyUsage[] }) {
  const totalRequests = useMemo(
    () => data.reduce((sum, d) => sum + d.count, 0),
    [data]
  );

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        requests: d.count,
      })),
    [data]
  );

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-4xl font-bold text-base-content/20 mb-2">0</p>
        <p className="text-sm text-base-content/40">
          No API requests recorded yet. Make a request to your public API to see data here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-base-content/50">
        <span className="font-semibold text-base-content">{totalRequests.toLocaleString()}</span> requests in the last {data.length} days
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-base-300" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "oklch(var(--bc) / 0.4)" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "oklch(var(--bc) / 0.4)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={24}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid oklch(var(--b3))",
              background: "oklch(var(--b1))",
              fontSize: 12,
              color: "oklch(var(--bc))",
            }}
            labelStyle={{ fontWeight: 600, marginBottom: 2 }}
          />
          <Line
            type="monotone"
            dataKey="requests"
            stroke="oklch(var(--p))"
            strokeWidth={2}
            dot={{ r: 0 }}
            activeDot={{ r: 4, fill: "oklch(var(--p))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
