"use client";

import type { DailyUsage } from "@/types/api";
import { useMemo } from "react";

export default function UsageChart({ data }: { data: DailyUsage[] }) {
  const maxCount = useMemo(
    () => Math.max(...data.map((d) => d.count), 1),
    [data]
  );

  if (data.length === 0) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-base-300">
        <p className="text-sm text-base-content/60">No usage data yet</p>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d) => {
        const height = Math.max((d.count / maxCount) * 100, 4);
        return (
          <div
            key={d.date}
            className="flex-1 flex flex-col items-center gap-1 min-w-0 group relative"
          >
            <span className="text-xs text-base-content/60 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
              {d.count}
            </span>
            <div
              className="w-full bg-primary rounded-t transition-all hover:opacity-80"
              style={{ height: `${height}%` }}
              title={`${d.date}: ${d.count} requests`}
            />
          </div>
        );
      })}
    </div>
  );
}
