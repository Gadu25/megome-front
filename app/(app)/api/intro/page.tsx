"use client";

import { useId } from "react";
import {
  ClipboardIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

import { Card } from "@/components/common/Card";

/* ---------------- Types ---------------- */

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

/* ---------------- Data ---------------- */

const MOCK_BASE_URL = "https://domain-sample.com/public/v1";

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

/* ---------------- Styles ---------------- */

const methodStyles: Record<Endpoint["method"], string> = {
  GET: "badge-success",
  POST: "badge-info",
  PUT: "badge-warning",
  DELETE: "badge-error",
};

/* ---------------- UI Components ---------------- */

function CopyButton({ value }: { value: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <button
      className="btn btn-ghost btn-sm btn-square opacity-70 hover:opacity-100 transition"
      onClick={handleCopy}
      aria-label="Copy to clipboard"
    >
      <ClipboardIcon className="size-4" />
    </button>
  );
}

/* ---- Code Block (light surface) ---- */

function CodeBlock({ code }: { code: string }) {
  return (
    <Card className="p-0" variant="default">
      <div className="flex items-start justify-between gap-4 p-4">
        <pre className="overflow-x-auto text-sm leading-relaxed text-base-content/80">
          <code>{code}</code>
        </pre>

        <CopyButton value={code} />
      </div>
    </Card>
  );
}

/* ---- Endpoint Card (clean SaaS style) ---- */

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const id = useId();

  return (
    <Card variant="interactive" className="p-0 overflow-hidden">
      <div className="collapse group bg-transparent">
        <input id={id} type="checkbox" className="hidden" />

        {/* Header */}
        <label
          htmlFor={id}
          className="collapse-title flex w-full items-start justify-between gap-4 p-5 text-left cursor-pointer"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className={`badge badge-sm ${methodStyles[endpoint.method]}`}>
                {endpoint.method}
              </div>

              <code className="font-medium text-base-content/90">
                {endpoint.path}
              </code>
            </div>

            <p className="text-sm text-base-content/60">
              {endpoint.description}
            </p>
          </div>

          <div className="pt-1 opacity-60">
            <ChevronRightIcon
              className="
                size-5 transition-transform duration-200
                group-has-[:checked]:rotate-90
              "
            />
          </div>
        </label>

        {/* Body */}
        <div className="collapse-content border-t border-base-200/40 bg-base-100/40 space-y-4">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-base-content/70">
                Example Request
              </p>

              <CodeBlock
                code={`curl ${MOCK_BASE_URL}${endpoint.path} \\
-H "Authorization: Bearer YOUR_PAT"`}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-base-content/70">
                Example Response
              </p>

              <CodeBlock code={endpoint.response} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- Page ---------------- */

export default function ApiPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      {/* Header */}
      <Card className="p-8">
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
                  Access portfolio content, projects, and developer data programmatically.
                </p>
              </div>
            </div>
          </div>

          <div className="badge badge-success badge-lg gap-2 opacity-90">
            <span className="size-2 rounded-full bg-current" />
            API Online
          </div>
        </div>
      </Card>

      {/* Quick Start */}
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Quick Start
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            Make your first authenticated API request.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-base-content/70">
              Base URL
            </p>
            <CodeBlock code={MOCK_BASE_URL} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-base-content/70">
              Authentication
            </p>
            <CodeBlock
              code="Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN"
            />
          </div>
        </div>
      </Card>

      {/* Endpoints */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            API Endpoints
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            Browse available public API resources.
          </p>
        </div>

        {MOCK_ENDPOINTS.map((group) => (
          <div key={group.category} className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                {group.category}
              </h3>

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

      {/* CTA */}
      <Card
        className="p-8 border-primary/10 bg-primary/5"
        variant="default"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Need API Access?
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Generate a personal access token to authenticate requests.
            </p>
          </div>

          <button className="btn btn-primary">
            Manage Tokens
          </button>
        </div>
      </Card>
    </div>
  );
}