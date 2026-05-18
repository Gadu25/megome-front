"use client";

import { useMemo } from "react";

import { ClipboardIcon } from "@heroicons/react/24/outline";

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

const BASE_URL =
  "https://domain-sample.com/public/v1";

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
        description:
          "Returns all published projects.",
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
        description:
          "Returns a single project.",
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
        description:
          "Returns the user's public resume data.",
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

const METHOD_STYLES: Record<
  ApiEndpoint["method"],
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
    await navigator.clipboard.writeText(
      value
    );
  };

  return (
    <button
      className="btn btn-ghost btn-sm btn-square"
      onClick={handleCopy}
      aria-label="Copy"
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

function EndpointCollapse({
  endpoint,
}: {
  endpoint: ApiEndpoint;
}) {
  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-2xl">
      <input type="checkbox" />

      <div className="collapse-title">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`badge badge-sm ${
                METHOD_STYLES[
                  endpoint.method
                ]
              }`}
            >
              {endpoint.method}
            </div>

            <code className="font-medium">
              {endpoint.path}
            </code>

            {endpoint.authRequired && (
              <div className="badge badge-outline badge-sm">
                Auth Required
              </div>
            )}
          </div>

          <p className="text-sm text-base-content/70">
            {endpoint.description}
          </p>
        </div>
      </div>

      <div className="collapse-content space-y-5 border-t border-base-300 p-5">
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Example Request
          </p>

          <CodeBlock
            code={endpoint.requestExample}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">
            Example Response
          </p>

          <CodeBlock
            code={endpoint.responseExample}
          />
        </div>
      </div>
    </div>
  );
}

export default function ApiReferencePage() {
  const categories = useMemo(
    () => MOCK_API_REFERENCE,
    []
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-3xl border border-base-300 bg-base-100 p-5">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-base-content/50">
            Resources
          </p>

          <nav className="space-y-1">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="flex items-center rounded-xl px-3 py-2 text-sm transition hover:bg-base-200"
              >
                {category.name}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <div className="space-y-10">
        {/* Header */}
        <section className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            API Reference
          </h1>

          <p className="max-w-3xl text-sm text-base-content/70">
            Explore available endpoints,
            authentication requirements,
            request examples, and response
            structures.
          </p>
        </section>

        {/* Categories */}
        {categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="space-y-5 scroll-mt-24"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">
                {category.name}
              </h2>

              <div className="h-px flex-1 bg-base-300" />
            </div>

            <div className="space-y-4">
              {category.endpoints.map(
                (endpoint) => (
                  <EndpointCollapse
                    key={endpoint.id}
                    endpoint={endpoint}
                  />
                )
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}