"use client";

import { useState } from "react";

type SettingsTab =
  | "account"
  | "api"
  | "data"
  | "security"
  | "output"
  | "integrations";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

      {/* LEFT NAVIGATION */}
      <div className="lg:col-span-1">
        <div className="card bg-base-100 shadow p-4 sticky top-6 space-y-2">

          <h2 className="font-semibold text-lg mb-2">Settings</h2>

          <button
            onClick={() => setActiveTab("account")}
            className={`btn btn-sm w-full justify-start ${
              activeTab === "account" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Account
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`btn btn-sm w-full justify-start ${
              activeTab === "api" ? "btn-primary" : "btn-ghost"
            }`}
          >
            API Keys
          </button>

          <button
            onClick={() => setActiveTab("data")}
            className={`btn btn-sm w-full justify-start ${
              activeTab === "data" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Portfolio Data
          </button>

          <button
            onClick={() => setActiveTab("output")}
            className={`btn btn-sm w-full justify-start ${
              activeTab === "output" ? "btn-primary" : "btn-ghost"
            }`}
          >
            API Output
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`btn btn-sm w-full justify-start ${
              activeTab === "security" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Security
          </button>

          <button
            onClick={() => setActiveTab("integrations")}
            className={`btn btn-sm w-full justify-start ${
              activeTab === "integrations" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Integrations
          </button>

        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="lg:col-span-3 space-y-6">

        {/* ACCOUNT */}
        {activeTab === "account" && (
          <div className="space-y-4">

            <div className="card bg-base-100 shadow p-6 space-y-4">
              <h3 className="font-semibold text-lg">Account Identity</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="label">
                    <span className="label-text">Display Name</span>
                  </label>
                  <input className="input input-bordered w-full" />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input className="input input-bordered w-full" />
                </div>

              </div>

              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input className="input input-bordered w-full" disabled />
                <p className="text-xs text-base-content/60 mt-1">
                  Email changes require verification
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow p-6 space-y-3">
              <h3 className="font-semibold text-lg text-error">Danger Zone</h3>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-xs text-base-content/60">
                    Permanently remove all data and API access
                  </p>
                </div>
                <button className="btn btn-error btn-sm">Delete</button>
              </div>
            </div>

          </div>
        )}

        {/* API KEYS */}
        {activeTab === "api" && (
          <div className="space-y-4">

            <div className="card bg-base-100 shadow p-6">
              <h3 className="font-semibold text-lg">API Access</h3>

              <div className="mt-4 space-y-3">

                <div className="mockup-code text-xs">
                  <pre><code>Authorization: Bearer &lt;API_KEY&gt;</code></pre>
                </div>

                <div className="mockup-code text-xs">
                  <pre><code>GET https://api.megome.dev/v1/profile</code></pre>
                </div>

              </div>
            </div>

            <div className="card bg-base-100 shadow p-6 space-y-3">
              <h3 className="font-semibold">Active Keys</h3>

              <div className="divider" />

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">production-key</p>
                  <p className="text-xs text-base-content/60">
                    Last used: 2h ago
                  </p>
                </div>
                <div className="badge badge-success">Active</div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">dev-key</p>
                  <p className="text-xs text-base-content/60">
                    Last used: 5d ago
                  </p>
                </div>
                <div className="badge badge-warning">Idle</div>
              </div>

            </div>

          </div>
        )}

        {/* PORTFOLIO DATA */}
        {activeTab === "data" && (
          <div className="card bg-base-100 shadow p-6 space-y-4">
            <h3 className="font-semibold text-lg">Portfolio Structure</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {[
                "Profile",
                "Projects",
                "Experience",
                "Education",
                "Skills",
                "Certificates",
              ].map((item) => (
                <div
                  key={item}
                  className="border border-base-300 rounded-xl p-4"
                >
                  <p className="font-medium">{item}</p>
                  <p className="text-xs text-base-content/60">
                    Structured API entity
                  </p>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* OUTPUT */}
        {activeTab === "output" && (
          <div className="card bg-base-100 shadow p-6 space-y-4">
            <h3 className="font-semibold text-lg">API Output Configuration</h3>

            <div className="space-y-3">

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Response Mode</span>
                </label>
                <select className="select select-bordered w-full">
                  <option>Minimal</option>
                  <option>Expanded</option>
                </select>
              </div>

              <div className="mockup-code text-xs">
                <pre><code>{`{
  "profile": {},
  "projects": [],
  "skills": []
}`}</code></pre>
              </div>

            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <div className="card bg-base-100 shadow p-6 space-y-4">
            <h3 className="font-semibold text-lg">Security Controls</h3>

            <div className="stats shadow w-full">

              <div className="stat">
                <div className="stat-title">Active Sessions</div>
                <div className="stat-value text-sm">2</div>
              </div>

              <div className="stat">
                <div className="stat-title">API Requests</div>
                <div className="stat-value text-sm">1.2k</div>
              </div>

            </div>

            <p className="text-xs text-base-content/60">
              Security actions will appear here once backend is connected.
            </p>
          </div>
        )}

        {/* INTEGRATIONS */}
        {activeTab === "integrations" && (
          <div className="card bg-base-100 shadow p-6 space-y-4">
            <h3 className="font-semibold text-lg">Integrations</h3>

            <div className="space-y-3">

              {["Vercel", "GitHub", "Webhook API"].map((name) => (
                <div
                  key={name}
                  className="flex justify-between items-center border border-base-300 p-4 rounded-xl"
                >
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-xs text-base-content/60">
                      Not connected
                    </p>
                  </div>

                  <button className="btn btn-sm btn-outline">
                    Connect
                  </button>
                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}