"use client";

import { useMemo } from "react";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/lib/api-docs/components";
import { ENDPOINT_GROUPS } from "@/lib/api-docs/data";

function CopyButton({ value }: { value: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <button
      className="btn btn-ghost btn-sm btn-square opacity-60 hover:opacity-100 transition"
      onClick={handleCopy}
      aria-label="Copy"
    >
      <CodeBracketIcon className="size-4" />
    </button>
  );
}

export default function ApiReferencePage() {
  const categories = useMemo(() => ENDPOINT_GROUPS, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <Card className="p-5 sticky top-6">
          <p className="mb-4 text-xs uppercase tracking-wider text-base-content/40">
            Resources
          </p>
          <nav className="space-y-1">
            {categories.map((c) => (
              <a
                key={c.category}
                href={`#${c.category.toLowerCase()}`}
                className="block rounded-xl px-3 py-2 text-sm text-base-content/70 hover:bg-base-200/40 hover:text-base-content transition"
              >
                {c.category}
              </a>
            ))}
          </nav>
        </Card>
      </aside>

      <main className="space-y-12">
        <section className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">API Reference</h1>
          <p className="max-w-3xl text-sm text-base-content/60">
            Explore available endpoints, authentication requirements, request examples, and response structures.
          </p>
        </section>

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

        {categories.map((category) => (
          <section key={category.category} id={category.category.toLowerCase()} className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">{category.category}</h2>
              <div className="h-px flex-1 bg-base-200/40" />
            </div>

            <div className="space-y-4">
              {category.endpoints.map((endpoint) => (
                <Card key={`${endpoint.method}-${endpoint.path}`} className="p-5 shadow-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="badge badge-sm badge-success">{endpoint.method}</span>
                        <code className="font-medium text-base-content/90">{endpoint.path}</code>
                      </div>
                      <p className="text-sm text-base-content/60">{endpoint.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4 border-t border-base-200/40 pt-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-base-content/70">Example Request</p>
                      <CodeBlock
                        code={`curl ${process.env.NEXT_PUBLIC_API_URL!}/public/v1${endpoint.path} \\\n  -H "Authorization: Bearer YOUR_PAT"`}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-base-content/70">Example Response</p>
                      <CodeBlock code={endpoint.response} />
                    </div>
                  </div>

                  <button
                    onClick={() => navigator.clipboard.writeText(`curl ${process.env.NEXT_PUBLIC_API_URL!}/public/v1${endpoint.path} -H "Authorization: Bearer YOUR_PAT"`)}
                    className="btn btn-ghost btn-sm mt-4 opacity-60 hover:opacity-100"
                  >
                    <CopyButton value={`curl ${process.env.NEXT_PUBLIC_API_URL!}/public/v1${endpoint.path} -H "Authorization: Bearer YOUR_PAT"`} />
                  </button>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
