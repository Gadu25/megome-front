"use client";

import { useState } from "react";

type SettingsTab =
  | "account"
  | "api"
  | "data"
  | "security"
  | "output"
  | "integrations";

const tabs: {
  id: SettingsTab;
  label: string;
}[] = [
  { id: "account", label: "Account" },
  { id: "api", label: "API Keys" },
  { id: "data", label: "Portfolio Data" },
  { id: "output", label: "API Output" },
  { id: "security", label: "Security" },
  { id: "integrations", label: "Integrations" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        
        {/* SIDEBAR */}
        <aside className="lg:col-span-1">
          <div className="card border border-base-200 bg-base-100 shadow-sm lg:sticky lg:top-6">
            <div className="card-body p-3">
              
              <div className="px-2 pb-2">
                <h1 className="text-lg font-semibold">Settings</h1>
                <p className="text-sm text-base-content/60">
                  Manage your account configuration.
                </p>
              </div>

              {/* MOBILE */}
              <div
                role="tablist"
                className="flex gap-2 overflow-x-auto pb-1 lg:hidden"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn btn-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* DESKTOP */}
              <div
                role="tablist"
                className="hidden space-y-1 lg:flex lg:flex-col"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn btn-sm justify-start ${
                      activeTab === tab.id
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="space-y-6 lg:col-span-3">

          {/* ACCOUNT */}
          {activeTab === "account" && (
            <>
              <section className="card border border-base-200 bg-base-100 shadow-sm">
                <div className="card-body space-y-6">
                  
                  <div>
                    <h2 className="text-lg font-semibold">
                      Account Identity
                    </h2>
                    <p className="text-sm text-base-content/60">
                      Update your public profile information.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    
                    <div className="form-control">
                      <label
                        htmlFor="displayName"
                        className="label"
                      >
                        <span className="label-text">
                          Display Name
                        </span>
                      </label>

                      <input
                        id="displayName"
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label
                        htmlFor="username"
                        className="label"
                      >
                        <span className="label-text">
                          Username
                        </span>
                      </label>

                      <input
                        id="username"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label htmlFor="email" className="label">
                      <span className="label-text">Email</span>
                    </label>

                    <input
                      id="email"
                      disabled
                      className="input input-bordered w-full"
                    />

                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        Email changes require verification.
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              <section className="card border border-error/20 bg-error/5 shadow-sm">
                <div className="card-body">
                  
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-error">
                        Danger Zone
                      </h2>

                      <p className="mt-1 text-sm text-base-content/70">
                        Permanently remove your account and API access.
                      </p>
                    </div>

                    <button className="btn btn-error btn-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* API */}
          {activeTab === "api" && (
            <div className="space-y-6">

              {/* CREATE TOKEN */}
              <section className="card border border-base-200 bg-base-100 shadow-sm">
                <div className="card-body space-y-6">

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">
                          Personal Access Tokens
                        </h2>

                        <p className="text-sm text-base-content/60">
                          Generate tokens for external applications and API access.
                        </p>
                      </div>

                      <div className="badge badge-success badge-outline gap-1">
                        Secure Storage
                      </div>
                    </div>

                    <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
                      <p className="text-sm leading-relaxed text-base-content/80">
                        Tokens are securely hashed before storage and cannot
                        be viewed again after creation. Store your token safely
                        once generated.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Token Name
                        </span>
                      </label>

                      <input
                        type="text"
                        placeholder="Production App"
                        className="input input-bordered w-full"
                      />

                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Used to identify this token later.
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Project
                        </span>
                      </label>

                      <select className="select select-bordered w-full">
                        <option>Portfolio Website</option>
                        <option>Internal Dashboard</option>
                        <option>Mobile App</option>
                      </select>

                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Associate this token with a project.
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-2xl border border-base-200 bg-base-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="font-medium">
                        Token Permissions
                      </p>

                      <p className="text-sm text-base-content/60">
                        Full API access will be granted to this token.
                      </p>
                    </div>

                    <button className="btn btn-primary">
                      Generate Token
                    </button>
                  </div>
                </div>
              </section>

              {/* ACTIVE TOKENS */}
              <section className="card border border-base-200 bg-base-100 shadow-sm">
                <div className="card-body space-y-6">

                  <div>
                    <h2 className="text-lg font-semibold">
                      Active Tokens
                    </h2>

                    <p className="text-sm text-base-content/60">
                      Monitor and revoke active access tokens.
                    </p>
                  </div>

                  <div className="space-y-3">

                    {/* TOKEN */}
                    <div className="rounded-2xl border border-base-200 p-5 transition hover:border-base-300">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-medium">
                              Production App
                            </p>

                            <div className="badge badge-success badge-sm">
                              Active
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-base-content/60 sm:grid-cols-2">

                            <p>
                              Project: Portfolio Website
                            </p>

                            <p>
                              Last used: 2 hours ago
                            </p>

                            <p>
                              Created: May 10, 2026
                            </p>

                            <p>
                              Prefix: mgm_live_****
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="btn btn-ghost btn-sm">
                            View Logs
                          </button>

                          <button className="btn btn-outline btn-error btn-sm">
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* TOKEN */}
                    <div className="rounded-2xl border border-base-200 p-5 transition hover:border-base-300">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-medium">
                              Mobile Client
                            </p>

                            <div className="badge badge-warning badge-sm">
                              Idle
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-base-content/60 sm:grid-cols-2">

                            <p>
                              Project: Mobile App
                            </p>

                            <p>
                              Last used: 5 days ago
                            </p>

                            <p>
                              Created: Apr 18, 2026
                            </p>

                            <p>
                              Prefix: mgm_live_****
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="btn btn-ghost btn-sm">
                            View Logs
                          </button>

                          <button className="btn btn-outline btn-error btn-sm">
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* API EXAMPLE */}
              <section className="card border border-base-200 bg-base-100 shadow-sm">
                <div className="card-body space-y-4">

                  <div>
                    <h2 className="text-lg font-semibold">
                      Authentication Example
                    </h2>

                    <p className="text-sm text-base-content/60">
                      Include your token in the Authorization header.
                    </p>
                  </div>

                  <div className="mockup-code text-xs">
                    <pre>
                      <code>
          {`Authorization: Bearer mgm_live_xxxxxxxxx

          GET https://api.megome.dev/v1/profile`}
                      </code>
                    </pre>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* DATA */}
          {activeTab === "data" && (
            <section className="card border border-base-200 bg-base-100 shadow-sm">
              <div className="card-body space-y-6">
                
                <div>
                  <h2 className="text-lg font-semibold">
                    Portfolio Structure
                  </h2>

                  <p className="text-sm text-base-content/60">
                    Structured entities exposed through the API.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      className="rounded-2xl border border-base-200 bg-base-50 p-5 transition hover:border-base-300"
                    >
                      <p className="font-medium">{item}</p>

                      <p className="mt-1 text-sm text-base-content/60">
                        Structured API entity
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* OUTPUT */}
          {activeTab === "output" && (
            <section className="card border border-base-200 bg-base-100 shadow-sm">
              <div className="card-body space-y-6">
                
                <div>
                  <h2 className="text-lg font-semibold">
                    API Output Configuration
                  </h2>

                  <p className="text-sm text-base-content/60">
                    Configure API response formatting.
                  </p>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Response Mode
                    </span>
                  </label>

                  <select className="select select-bordered w-full">
                    <option>Minimal</option>
                    <option>Expanded</option>
                  </select>
                </div>

                <div className="mockup-code text-xs">
                  <pre>
                    <code>{`{
  "profile": {},
  "projects": [],
  "skills": []
}`}</code>
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <section className="card border border-base-200 bg-base-100 shadow-sm">
              <div className="card-body space-y-6">
                
                <div>
                  <h2 className="text-lg font-semibold">
                    Security Controls
                  </h2>

                  <p className="text-sm text-base-content/60">
                    Monitor sessions and API activity.
                  </p>
                </div>

                <div className="stats stats-vertical w-full border border-base-200 shadow-none md:stats-horizontal">
                  <div className="stat">
                    <div className="stat-title">
                      Active Sessions
                    </div>

                    <div className="stat-value text-2xl">
                      2
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">
                      API Requests
                    </div>

                    <div className="stat-value text-2xl">
                      1.2k
                    </div>
                  </div>
                </div>

                <div className="alert">
                  <span className="text-sm">
                    Security actions will appear here once the
                    backend is connected.
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* INTEGRATIONS */}
          {activeTab === "integrations" && (
            <section className="card border border-base-200 bg-base-100 shadow-sm">
              <div className="card-body space-y-6">
                
                <div>
                  <h2 className="text-lg font-semibold">
                    Integrations
                  </h2>

                  <p className="text-sm text-base-content/60">
                    Connect external services and deployment tools.
                  </p>
                </div>

                <div className="space-y-3">
                  {["Vercel", "GitHub", "Webhook API"].map(
                    (name) => (
                      <div
                        key={name}
                        className="flex flex-col gap-4 rounded-2xl border border-base-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium">{name}</p>

                          <p className="text-sm text-base-content/60">
                            Not connected
                          </p>
                        </div>

                        <button className="btn btn-outline btn-sm">
                          Connect
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}