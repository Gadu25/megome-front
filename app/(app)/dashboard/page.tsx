"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BoltIcon,
  KeyIcon,
  ChartBarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { FeatureInProgressOverlay } from "@/components/ui/FeatureInProgress";
import { getDashboardOverview } from "@/lib/api/client/dashboard";
import { DashboardOverview } from "@/types/api";
import Link from "next/link";

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
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

  type PlaygroundResponse = {
    status?: number;
    body?: unknown;
    error?: string;
    duration?: number;
  };

  type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<PlaygroundResponse | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [url, setUrl] = useState("/public/v1/profile");
  const [method, setMethod] = useState<HttpMethod>("GET");

  async function handleRequest() {
    setLoading(true);

    try {
      const start = performance.now();

      console.log(`${BACKEND_URL}${url}`)

      const res = await fetch(`${BACKEND_URL}${url}`, {
        method,
        headers: {
          ...(accessToken && {
            Authorization: `Bearer ${accessToken}`,
          }),
          "Content-Type": "application/json",
        },
      });

      const duration = Math.round(
        performance.now() - start
      );

      const body = await res.json();

      setResponse({
        status: res.status,
        duration,
        body,
      });
    } catch (error) {
      setResponse({
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">API Playground</h2>
        <span className="text-xs text-base-content/40">
          Live test environment
        </span>
      </div>

      {/* Authentication */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-base-content/60">
            Authentication
          </label>

          <span
            className={`badge badge-xs ${
              accessToken
                ? "badge-success badge-outline"
                : "badge-ghost"
            }`}
          >
            {accessToken ? "Token configured" : "No token"}
          </span>
        </div>

        <label className="input input-bordered flex items-center gap-2">
          <span className="text-xs text-base-content/50 font-mono">
            Bearer
          </span>

          <input
            type={showToken ? "text" : "password"}
            placeholder="Paste access token..."
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="grow font-mono text-xs"
          />

          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="btn btn-ghost btn-xs"
          >
            {showToken ? "Hide" : "Show"}
          </button>
        </label>
      </div>

      {/* Endpoint */}
      <div className="space-y-2">
        <label className="text-xs text-base-content/60">
          Endpoint
        </label>

        <div className="flex items-center gap-2">
          <select value={method} onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="select select-sm select-bordered w-28"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            className="input input-sm input-bordered flex-1 font-mono text-xs"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={handleRequest}
            disabled={loading}
            className="btn btn-primary btn-sm min-w-24"
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>

      {/* Response */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs text-base-content/60">
            Response
          </label>

          {response?.status && !loading && (
            <span className="badge badge-outline badge-sm">
              {response.status}
              {response.duration ? ` • ${response.duration}ms` : ""}
            </span>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mt-2 bg-base-200 rounded-xl p-4 text-xs font-mono animate-pulse">
            sending request...
          </div>
        )}

        {/* Response / Error */}
        {!loading && (
          <pre className="mt-2 bg-base-200 rounded-xl p-4 text-xs font-mono overflow-auto max-h-80">
            {response
              ? JSON.stringify(
                  response.error ?? response.body,
                  null,
                  2
                )
              : "// No response yet"}
          </pre>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────
   PAGE
───────────────────────────── */

export default function DashboardPage() {
  const completion = useMemo(() => mockProfileCompletion, []);
  const [dashboardOverview, setDashboardOverview] = useState<DashboardOverview | null>(null)
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