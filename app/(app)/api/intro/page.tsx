"use client";

import { CodeBracketIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CodeBlock, EndpointCard } from "@/lib/api-docs/components";
import { API_BASE_URL, ENDPOINT_GROUPS } from "@/lib/api-docs/data";

export default function ApiPage() {
  return (
    <div className="flex w-full flex-col gap-6">
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

      <Card className="p-8 border-primary/10 bg-info/5" variant="default">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Need API Access?</h2>
            <p className="mt-1 text-sm text-base-content/60">
              Generate a personal access token to authenticate requests.
            </p>
          </div>

          <Link href="/api/tokens" className="btn btn-primary">
            Manage Tokens
          </Link>
        </div>
      </Card>

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
    </div>
  );
}
