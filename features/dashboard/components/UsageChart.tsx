"use client";

import type { DailyUsage } from "@/types/api";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

function resolveColor(varName: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

export default function UsageChart({ data }: { data: DailyUsage[] }) {
  const [colors, setColors] = useState({ primary: "", base3: "", base1: "", content: "" });

  useEffect(() => {
    setColors({
      primary: resolveColor("--p"),
      base3: resolveColor("--b3"),
      base1: resolveColor("--b1"),
      content: resolveColor("--bc"),
    });
  }, []);

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

  if (!colors.primary) return null;

  return (
    <div className="space-y-3">
      <div className="text-sm text-base-content/50">
        <span className="font-semibold text-base-content">{totalRequests.toLocaleString()}</span> requests in the last {data.length} days
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
          <defs>
            <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={0.2} />
              <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.base3} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: colors.content }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: colors.content }}
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
            }}
          />
          <Area
            type="monotone"
            dataKey="requests"
            stroke="none"
            fill="url(#usageGradient)"
          />
          <Line
            type="monotone"
            dataKey="requests"
            stroke={colors.primary}
            strokeWidth={2}
            dot={{ r: 0 }}
            activeDot={{ r: 5, fill: colors.primary }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
