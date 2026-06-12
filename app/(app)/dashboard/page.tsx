"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BoltIcon,
  KeyIcon,
  ChartBarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { FeatureInProgressOverlay } from "@/components/common/FeatureInProgress";
import { getDashboardOverview } from "@/lib/api/client/dashboard";
import { DasboardOverview } from "@/types/types";

/* ─────────────────────────────
   MOCK DATA
───────────────────────────── */

const mockProfileCompletion = 72;

const mockSections = [
  { name: "Profile", value: 90 },
  { name: "Experience", value: 60 },
  { name: "Projects", value: 80 },
  { name: "Skills", value: 50 },
  { name: "API Setup", value: 100 },
];

const mockApiStats = {
  requests: 12458,
  keys: 2,
  latency: "120ms",
};

const mockActivity = [
  { action: "Profile updated", time: "2h ago" },
  { action: "New API key generated", time: "1d ago" },
  { action: "Project added: CLI Toolkit", time: "2d ago" },
];

const mockProjects = [
  {
    title: "Portfolio API",
    stack: "Go · PostgreSQL",
    status: "active",
  },
  {
    title: "Distributed Cache Layer",
    stack: "Go · Redis · gRPC",
    status: "maintenance",
  },
  {
    title: "CLI Toolkit",
    stack: "Go · Cobra",
    status: "active",
  },
];

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

/* ─────────────────────────────
   API PLAYGROUND (NEW)
───────────────────────────── */

function ApiPlayground() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  async function handleRequest() {
    setLoading(true);

    // MOCK API CALL
    setTimeout(() => {
      setResponse({
        message: "profile retrieved successfully",
        data: {
          id: 12,
          firstName: "Juan",
          lastName: "Dela Cruz",
          role: "Full Stack Engineer",
        },
      });
      setLoading(false);
    }, 900);
  }

  return (
      <div className="relative">
        <div className="rounded-2xl border border-base-300 p-5 bg-base-100 space-y-4">

          <div className="flex items-center justify-between">
            <h2 className="font-semibold">API Playground</h2>
            <span className="text-xs text-base-content/40">Live test environment</span>
          </div>

          {/* Endpoint */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-base-content/60">Endpoint</label>
            <div className="flex items-center gap-2">
              <select className="select select-sm select-bordered w-32">
                <option>GET</option>
              </select>

              <input
                className="input input-sm input-bordered flex-1 font-mono text-xs"
                value="/public/v1/profile"
                readOnly
              />

              <button
                onClick={handleRequest}
                className="btn btn-primary btn-sm"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>

          {/* Response */}
          <div>
            <label className="text-xs text-base-content/60">Response</label>

            <pre className="mt-2 text-xs bg-base-200 p-3 rounded-xl overflow-auto max-h-60">
              {response
                ? JSON.stringify(response, null, 2)
                : "// No response yet"}
            </pre>
          </div>
        </div>
        <FeatureInProgressOverlay title="API Playground"/>
      </div>
  );
}

/* ─────────────────────────────
   PAGE
───────────────────────────── */

export default function DashboardPage() {
  const completion = useMemo(() => mockProfileCompletion, []);
  const [dashboardOverview, setDashboardOverview] = useState<DasboardOverview | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardOverview = async () => {
      try {
        setLoading(true);
        const res = await getDashboardOverview();
        setDashboardOverview(res.data)
      } catch (error) {
        console.error("Failed to fetch dashboard overview: ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardOverview();
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Card
              title="Profile Completion"
              value={`${completion}%`}
              icon={<UserCircleIcon className="w-5 h-5" />}
            />
            <FeatureInProgressOverlay title="Profile completion" description="under development"/>
          </div>
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

        {/* ✅ API PLAYGROUND (BEST POSITION) */}
        <ApiPlayground />

        {/* LOWER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Progress */}
          <div className="relative">
            <div className="rounded-2xl border border-base-300 p-5">
              <h2 className="font-semibold mb-4">Completion Breakdown</h2>
              <div className="space-y-4">
                {mockSections.map((s) => (
                  <ProgressRow key={s.name} {...s} />
                ))}
              </div>
            </div>
            <FeatureInProgressOverlay title="Completion Breakdown"/>
          </div>

          {/* Activity */}
          <div className="relative">
            <div className="rounded-2xl border border-base-300 p-5">
              <h2 className="font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {mockActivity.map((a, i) => (
                  <div key={i} className="text-sm">
                    <div>{a.action}</div>
                    <div className="text-xs text-base-content/40">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
            <FeatureInProgressOverlay title="Recent Activity"/>
          </div>

          {/* Quick Actions */}
          <div className="relative">
            <div className="rounded-2xl border border-base-300 p-5">
              <h2 className="font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                <button className="btn btn-primary btn-sm">
                  Update Profile
                </button>
                <button className="btn btn-ghost btn-sm">
                  Generate API Key
                </button>
                <button className="btn btn-ghost btn-sm">
                  View API Docs
                </button>
              </div>
            </div>
            <FeatureInProgressOverlay title="Quick Actions"/>
          </div>
        </div>

        {/* PROJECTS */}
        {/* <div className="rounded-2xl border border-base-300 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Projects</h2>
            <button className="btn btn-ghost btn-sm">+ Add</button>
          </div>

          <div className="grid gap-3">
            {mockProjects.map((p) => (
              <div
                key={p.title}
                className="flex justify-between items-center border border-base-300 rounded-xl p-4"
              >
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-base-content/50">
                    {p.stack}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-base-200">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div> */}

      </main>
    </div>
  );
}