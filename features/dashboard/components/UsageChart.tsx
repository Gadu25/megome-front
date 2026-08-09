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
        <span className="font-semibold text-base-content">
          {totalRequests.toLocaleString()}
        </span>{" "}
        requests in the last {data.length} days
      </div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={28}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3, fill: "#2563eb" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
