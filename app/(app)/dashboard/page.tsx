"use client";

import { useEffect, useState } from "react";
import {
  BoltIcon,
  KeyIcon,
  ChartBarIcon,
  UserCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { getCompletion, getDashboardActivity, getDashboardOverview, getDashboardUsageStats } from "@/lib/api/client/dashboard";
import type { ActivityItem, CompletionStatus, DailyUsage, DashboardOverview } from "@/types/api";
import Link from "next/link";
import ActivityTimeline from "@/features/dashboard/components/ActivityTimeline";
import UsageChart from "@/features/dashboard/components/UsageChart";

/* ─────────────────────────────
   UI COMPONENTS
───────────────────────────── */

function Card({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-base-content/60">{title}</div>
        <div className="text-primary">{icon}</div>
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
      {subtitle && (
        <div className="text-xs text-base-content/40 mt-1">{subtitle}</div>
      )}
    </div>
  );
}

function ProgressRow({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-base-content/60">
        <span>{name}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-base-300 rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

const sectionLinks: Record<string, string> = {
  skills: "/profile",
  education: "/profile",
  experience: "/profile",
  certification: "/profile",
  projects: "/projects",
};

function SectionRow({ name, filled }: { name: string; filled: boolean }) {
  const href = sectionLinks[name] ?? "/profile";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm capitalize">{name}</span>
        {filled && <CheckCircleIcon className="w-4 h-4 text-success" />}
      </div>
      {filled ? (
        <span className="text-xs text-success">Completed</span>
      ) : (
        <Link href={href} className="btn btn-ghost btn-xs">
          Add
        </Link>
      )}
    </div>
  );
}

/* ─────────────────────────────
   PAGE
───────────────────────────── */

export default function DashboardPage() {
  const [dashboardOverview, setDashboardOverview] = useState<DashboardOverview | null>(null)
  const [completion, setCompletion] = useState<CompletionStatus | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [usageStats, setUsageStats] = useState<DailyUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const overviewRes = await getDashboardOverview().catch((err) => { console.error("Overview failed:", err); return null; });
        const completionRes = await getCompletion().catch((err) => { console.error("Completion failed:", err); return null; });
        const activityRes = await getDashboardActivity().catch((err) => { console.error("Activity failed:", err); return null; });
        const usageRes = await getDashboardUsageStats().catch((err) => { console.error("Usage stats failed:", err); return null; });
        setDashboardOverview(overviewRes?.data ?? null);
        setCompletion(completionRes?.data ?? null);
        setActivity(activityRes?.data ?? []);
        setUsageStats(usageRes?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch dashboard data: ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData();
  }, [])

  return (
    <div className="bg-base-100 flex">

      {/* MAIN */}
      <main className="flex-1 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-base-content/60">
            Manage your structured portfolio data and API usage.
          </p>
        </div>

        {/* KPI */}
        <div className={`grid gap-4 ${completion?.overall === 100 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-4"}`}>
          {completion?.overall !== 100 && (
            <Card
              title="Profile Completion"
              value={`${completion?.overall ?? 0}%`}
              icon={<UserCircleIcon className="w-5 h-5" />}
            />
          )}
          <Card
            title="API Requests"
            value={dashboardOverview ? dashboardOverview?.apiUsage.requestCount.toLocaleString(): 0}
            icon={<BoltIcon className="w-5 h-5" />}
          />
          <Card
            title="API Keys"
            value={dashboardOverview ? dashboardOverview?.patCount.toLocaleString(): 0}
            icon={<KeyIcon className="w-5 h-5" />}
          />
          <Card
            title="Avg Latency"
            value={dashboardOverview ? dashboardOverview?.apiUsage.averageResponseMs.toLocaleString()+ "ms": 0+ "ms"}
            icon={<ChartBarIcon className="w-5 h-5" />}
          />
        </div>

        {/* LOWER GRID */}
        <div className={`grid gap-6 ${completion?.overall === 100 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}>

          {/* Completion Breakdown */}
          {completion?.overall !== 100 && (
            <div className="rounded-2xl border border-base-300 p-5 lg:col-span-2">
              <h2 className="font-semibold mb-4">Completion Breakdown</h2>
              <div className="space-y-4">
                {completion && (
                  <ProgressRow
                    name="Profile"
                    value={Math.round((completion.profile.filter(p => p.filled).length / completion.profile.length) * 100)}
                  />
                )}
                {completion && completion.sections.length > 0 && (
                  <div className="border-t border-base-300 pt-4" />
                )}
                {completion?.sections.map((item) => (
                  <SectionRow key={item.name} name={item.name} filled={item.filled} />
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rounded-2xl border border-base-300 p-5">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link href="/profile?tab=profile-setup" className="btn btn-primary btn-sm">
                Update Profile
              </Link>
              <Link href="/api/tokens" className="btn btn-ghost btn-sm">
                Generate API Key
              </Link>
              <Link href="/api/intro" className="btn btn-ghost btn-sm">
                View API Docs
              </Link>
            </div>
          </div>
        </div>

        {/* Activity & Usage */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="rounded-2xl border border-base-300 p-5">
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            <ActivityTimeline items={activity} />
          </div>
          <div className="rounded-2xl border border-base-300 p-5">
            <h2 className="font-semibold mb-4">API Usage</h2>
            <UsageChart data={usageStats} />
          </div>
        </div>

      </main>
    </div>
  );
}
