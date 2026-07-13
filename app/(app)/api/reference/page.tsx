"use client";

import { useMemo, useState } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";

import { Card } from "@/components/ui/Card";

/* ---------------- Types ---------------- */

type ApiEndpoint = {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  authRequired: boolean;
  requestExample: string;
  responseExample: string;
};

type ApiCategory = {
  id: string;
  name: string;
  endpoints: ApiEndpoint[];
};

/* ---------------- Data ---------------- */

const BASE_URL = "https://domain-sample.com/public/v1";

const MOCK_API_REFERENCE: ApiCategory[] = [
  {
    id: "profile",
    name: "Profile",
    endpoints: [
      {
        id: "get-profile",
        method: "GET",
        path: "/profile",
        description:
          "Returns the authenticated user's public profile.",
        authRequired: true,
        requestExample: `curl ${BASE_URL}/profile \\
  -H "Authorization: Bearer YOUR_PAT"`,

        responseExample: `{
  "id": "usr_123",
  "name": "John Doe",
  "title": "Frontend Engineer",
  "location": "Philippines"
}`,
      },
    ],
  },

  {
    id: "projects",
    name: "Projects",
    endpoints: [
      {
        id: "get-projects",
        method: "GET",
        path: "/projects",
        description: "Returns all published projects.",
        authRequired: true,
        requestExample: `curl ${BASE_URL}/projects \\
  -H "Authorization: Bearer YOUR_PAT"`,

        responseExample: `[
  {
    "id": "proj_1",
    "title": "Portfolio CMS"
  }
]`,
      },

      {
        id: "get-project",
        method: "GET",
        path: "/projects/:id",
        description: "Returns a single project.",
        authRequired: true,
        requestExample: `curl ${BASE_URL}/projects/proj_1 \\
  -H "Authorization: Bearer YOUR_PAT"`,

        responseExample: `{
  "id": "proj_1",
  "title": "Portfolio CMS"
}`,
      },
    ],
  },

  {
    id: "resume",
    name: "Resume",
    endpoints: [
      {
        id: "get-resume",
        method: "GET",
        path: "/resume",
        description: "Returns the user's public resume data.",
        authRequired: true,
        requestExample: `curl ${BASE_URL}/resume \\
  -H "Authorization: Bearer YOUR_PAT"`,

        responseExample: `{
  "name": "John Doe",
  "experience": []
}`,
      },
    ],
  },
];

/* ---------------- Styles ---------------- */

const METHOD_STYLES: Record<ApiEndpoint["method"], string> = {
  GET: "badge-success",
  POST: "badge-info",
  PUT: "badge-warning",
  DELETE: "badge-error",
};

/* ---------------- Components ---------------- */

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
      <ClipboardIcon className="size-4" />
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <Card className="p-0">
      <div className="flex items-start justify-between gap-4 p-4">
        <pre className="overflow-x-auto text-sm leading-relaxed text-base-content/80">
          <code>{code}</code>
        </pre>

        <CopyButton value={code} />
      </div>
    </Card>
  );
}

/* ---------------- Endpoint Row ---------------- */

import { useId } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

function EndpointRow({ endpoint }: { endpoint: ApiEndpoint }) {
  const id = useId();

  return (
    <Card className="p-0 overflow-hidden">
      <div className="collapse bg-transparent">
        <input id={id} type="checkbox" className="peer hidden" />

        {/* Header */}
        <label
          htmlFor={id}
          className="collapse-title flex w-full items-start justify-between gap-4 p-5 text-left cursor-pointer"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className={`badge badge-sm ${METHOD_STYLES[endpoint.method]}`}>
                {endpoint.method}
              </div>

              <code className="font-medium text-base-content/90">
                {endpoint.path}
              </code>

              {endpoint.authRequired && (
                <span className="badge badge-outline badge-xs opacity-70">
                  Auth Required
                </span>
              )}
            </div>

            <p className="text-sm text-base-content/60">
              {endpoint.description}
            </p>
          </div>

          <div className="pt-1 opacity-60">
            <ChevronRightIcon
              className="
                size-5 transition-transform duration-200
                peer-checked:rotate-90
              "
            />
          </div>
        </label>

        {/* Body */}
        <div className="collapse-content border-t border-base-200/40 bg-base-100/40">
          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-base-content/70">
                Example Request
              </p>

              <CodeBlock code={endpoint.requestExample} />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-base-content/70">
                Example Response
              </p>

              <CodeBlock code={endpoint.responseExample} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- Page ---------------- */

export default function ApiReferencePage() {
  const categories = useMemo(() => MOCK_API_REFERENCE, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <Card className="p-5 sticky top-6">
          <p className="mb-4 text-xs uppercase tracking-wider text-base-content/40">
            Resources
          </p>

          <nav className="space-y-1">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="block rounded-xl px-3 py-2 text-sm text-base-content/70 hover:bg-base-200/40 hover:text-base-content transition"
              >
                {c.name}
              </a>
            ))}
          </nav>
        </Card>
      </aside>

      {/* Main */}
      <main className="space-y-12">
        {/* Header */}
        <section className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            API Reference
          </h1>

          <p className="max-w-3xl text-sm text-base-content/60">
            Explore available endpoints, authentication requirements,
            request examples, and response structures.
          </p>
        </section>

        {/* Categories */}
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="space-y-5 scroll-mt-24">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <div className="h-px flex-1 bg-base-200/40" />
            </div>

            <div className="space-y-4">
              {category.endpoints.map((endpoint) => (
                <EndpointRow key={endpoint.id} endpoint={endpoint} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}