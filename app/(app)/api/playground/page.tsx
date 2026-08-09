"use client";

import { useState } from "react";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type PlaygroundResponse = {
  status?: number;
  body?: unknown;
  error?: string;
  duration?: number;
};

export default function ApiPlaygroundPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

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
      const res = await fetch(`${BACKEND_URL}${url}`, {
        method,
        headers: {
          ...(accessToken && {
            Authorization: `Bearer ${accessToken}`,
          }),
          "Content-Type": "application/json",
        },
      });
      const duration = Math.round(performance.now() - start);
      const body = await res.json();
      setResponse({ status: res.status, duration, body });
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Card className="p-8 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary hidden lg:block">
            <BeakerIcon className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">API Playground</h1>
            <p className="mt-1 text-base-content/70">
              Test API endpoints live with your personal access token.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-xs">
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-base-content/60">Authentication</label>
              <span
                className={`badge badge-xs ${
                  accessToken ? "badge-success badge-outline" : "badge-ghost"
                }`}
              >
                {accessToken ? "Token configured" : "No token"}
              </span>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <span className="text-xs text-base-content/50 font-mono">Bearer</span>
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

          <div className="space-y-2">
            <label className="text-xs text-base-content/60">Endpoint</label>
            <div className="flex items-center gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
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

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-base-content/60">Response</label>
              {response?.status && !loading && (
                <span className="badge badge-outline badge-sm">
                  {response.status}
                  {response.duration ? ` • ${response.duration}ms` : ""}
                </span>
              )}
            </div>
            {loading && (
              <div className="mt-2 bg-base-200 rounded-xl p-4 text-xs font-mono animate-pulse">
                Sending request...
              </div>
            )}
            {!loading && (
              <pre className="mt-2 bg-base-200 rounded-xl p-4 text-xs font-mono overflow-auto max-h-80 whitespace-pre-wrap break-all">
                {response
                  ? JSON.stringify(response.error ?? response.body, null, 2)
                  : "// No response yet"}
              </pre>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
