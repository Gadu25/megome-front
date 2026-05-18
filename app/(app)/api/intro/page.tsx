"use client";

import { useState } from "react";
import {
  ClipboardIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline";

type Endpoint = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  response: string;
};

type EndpointGroup = {
  category: string;
  endpoints: Endpoint[];
};

const MOCK_BASE_URL =
  "https://domain-sample.com/public/v1";

const MOCK_ENDPOINTS: EndpointGroup[] = [
  {
    category: "Profile",
    endpoints: [
      {
        method: "GET",
        path: "/profile",
        description:
          "Returns the authenticated user's public profile.",
        response: `{
  "id": "usr_123",
  "name": "John Doe",
  "title": "Frontend Engineer",
  "location": "Philippines"
}`,
      },
    ],
  },
  {
    category: "Projects",
    endpoints: [
      {
        method: "GET",
        path: "/projects",
        description:
          "Returns all published portfolio projects.",
        response: `[
  {
    "id": "proj_1",
    "title": "Developer Portfolio",
    "stack": ["Next.js", "TailwindCSS"]
  }
]`,
      },
      {
        method: "GET",
        path: "/projects/:id",
        description:
          "Returns a single project by ID.",
        response: `{
  "id": "proj_1",
  "title": "Developer Portfolio"
}`,
      },
    ],
  },
];

const methodStyles: Record<
  Endpoint["method"],
  string
> = {
  GET: "badge-success",
  POST: "badge-info",
  PUT: "badge-warning",
  DELETE: "badge-error",
};

function CopyButton({
  value,
}: {
  value: string;
}) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <button
      className="btn btn-ghost btn-sm btn-square"
      onClick={handleCopy}
      aria-label="Copy to clipboard"
    >
      <ClipboardIcon className="size-4" />
    </button>
  );
}

function CodeBlock({
  code,
}: {
  code: string;
}) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-200/40">
      <div className="flex items-start justify-between gap-4 p-4">
        <pre className="overflow-x-auto text-sm leading-relaxed">
          <code>{code}</code>
        </pre>

        <CopyButton value={code} />
      </div>
    </div>
  );
}

function EndpointCard({
  endpoint,
}: {
  endpoint: Endpoint;
}) {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100">
      <button
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`badge badge-sm ${methodStyles[endpoint.method]}`}
            >
              {endpoint.method}
            </div>

            <code className="font-medium">
              {endpoint.path}
            </code>
          </div>

          <p className="text-sm text-base-content/70">
            {endpoint.description}
          </p>
        </div>

        <div className="pt-1">
          {expanded ? (
            <ChevronDownIcon className="size-5" />
          ) : (
            <ChevronRightIcon className="size-5" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-base-300 p-5">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Example Request
            </p>

            <CodeBlock
              code={`curl ${MOCK_BASE_URL}${endpoint.path} \\
  -H "Authorization: Bearer YOUR_PAT"`}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Example Response
            </p>

            <CodeBlock code={endpoint.response} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      {/* Header */}
      <section className="flex flex-col gap-5 rounded-3xl border border-base-300 bg-base-100 p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <CodeBracketIcon className="size-6" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Developer API
                </h1>

                <p className="mt-1 text-base-content/70">
                  Access portfolio content,
                  projects, and developer data
                  programmatically.
                </p>
              </div>
            </div>
          </div>

          <div className="badge badge-success badge-lg gap-2">
            <span className="size-2 rounded-full bg-current" />
            API Online
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-base-300 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="size-5 text-success" />
              <div>
                <p className="text-sm text-base-content/60">
                  Authentication
                </p>
                <p className="font-medium">
                  Bearer Token
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-base-300 p-5">
            <div className="flex items-center gap-3">
              <ServerStackIcon className="size-5 text-primary" />
              <div>
                <p className="text-sm text-base-content/60">
                  Version
                </p>
                <p className="font-medium">
                  v1
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-base-300 p-5">
            <div>
              <p className="text-sm text-base-content/60">
                Rate Limit
              </p>
              <p className="font-medium">
                100 req/min
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="rounded-3xl border border-base-300 bg-base-100 p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Quick Start
          </h2>

          <p className="mt-1 text-sm text-base-content/70">
            Make your first authenticated API
            request.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Base URL
            </p>

            <CodeBlock code={MOCK_BASE_URL} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Authentication
            </p>

            <CodeBlock
              code={`Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN`}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Example Request
            </p>

            <CodeBlock
              code={`curl ${MOCK_BASE_URL}/profile \\
  -H "Authorization: Bearer YOUR_PAT"`}
            />
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            API Endpoints
          </h2>

          <p className="mt-1 text-sm text-base-content/70">
            Browse available public API
            resources.
          </p>
        </div>

        {MOCK_ENDPOINTS.map((group) => (
          <div
            key={group.category}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                {group.category}
              </h3>

              <div className="h-px flex-1 bg-base-300" />
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

      {/* CTA */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Need API Access?
            </h2>

            <p className="mt-1 text-sm text-base-content/70">
              Generate a personal access token to
              authenticate requests.
            </p>
          </div>

          <button className="btn btn-primary">
            Manage Tokens
          </button>
        </div>
      </section>
    </div>
  );
}