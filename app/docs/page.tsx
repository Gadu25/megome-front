"use client";

import { CodeBracketIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LogoFull } from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { CodeBlock, EndpointCard } from "@/lib/api-docs/components";
import { API_BASE_URL, ENDPOINT_GROUPS } from "@/lib/api-docs/data";

export default function PublicDocsPage() {
  return (
    <main className="min-h-screen bg-base-100">
      {/* Navbar */}
      <nav className="border-b border-base-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <LogoFull />
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/auth" className="text-sm text-base-content/60 hover:text-base-content transition-colors">
              Sign in
            </Link>
            <Link href="/auth?mode=signup" className="btn btn-primary btn-sm rounded-xl">
              Get started
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:px-6 py-8">
        {/* Header */}
        <Card className="p-8 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary hidden lg:block">
                  <CodeBracketIcon className="size-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Developer API</h1>
                  <p className="mt-1 text-base-content/70">
                    Access portfolio content, projects, and developer data programmatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Start */}
        <Card className="p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Quick Start</h2>
            <p className="mt-1 text-sm text-base-content/60">
              Make your first authenticated API request.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-base-content/70">Base URL</p>
              <CodeBlock code={API_BASE_URL} />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-base-content/70">Authentication</p>
              <CodeBlock code="Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN" />
            </div>
          </div>
        </Card>

        {/* Endpoints */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">API Endpoints</h2>
            <p className="mt-1 text-sm text-base-content/60">
              Browse available public API resources.
            </p>
          </div>

          {ENDPOINT_GROUPS.map((group) => (
            <div key={group.category} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{group.category}</h3>
                <div className="h-px flex-1 bg-base-200/40" />
              </div>

              <div className="space-y-4">
                {group.endpoints.map((endpoint) => (
                  <EndpointCard
                    key={`${endpoint.method}-${endpoint.path}`}
                    endpoint={endpoint}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Login CTA */}
        <Card className="p-8 border-primary/10 bg-info/5" variant="default">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Ready to try it yourself?</h2>
              <p className="mt-1 text-sm text-base-content/60">
                Sign in or create an account to generate a personal access token and start making authenticated requests.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth" className="btn btn-primary">
                Sign in to your account
              </Link>
              <Link href="/auth?mode=signup" className="btn btn-outline">
                Create free account
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-base-300 px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-sm text-base-content/40">© 2026 Megome · Built for developers.</span>
        </div>
      </footer>
    </main>
  );
}
