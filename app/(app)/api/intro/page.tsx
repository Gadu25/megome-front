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

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/public/v1`;

const MOCK_ENDPOINTS: EndpointGroup[] = [
  {
    category: "Profile",
    endpoints: [
      {
        method: "GET",
        path: "/profile",
        description:
          "Returns the public profile information of the portfolio owner.",
        response: `{
  "message": "profile retrieved successfully",
  "data": {
    "id": 12,
    "userId": 7,
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "title": "Full Stack Engineer",
    "birthday": "1998-03-14T00:00:00Z",
    "bio": "Passionate about building scalable web applications and clean user experiences.",
    "phone": "+63 917 555 1023",
    "website": "https://juandelacruz.dev",
    "location": "Cebu City, Philippines",
    "profileImage": "https://cdn.example.com/profile/avatar.webp",
    "createdAt": "2026-01-08T09:12:44Z",
    "updatedAt": "2026-05-18T11:45:21Z"
  }
}`,
      },
    ],
  },

  {
    category: "Skills",
    endpoints: [
      {
        method: "GET",
        path: "/skill",
        description:
          "Returns all technical skills with proficiency levels.",
        response: `{
  "message": "skills retrieved successfully",
  "skills": [
    {
      "id": 1,
      "userId": 7,
      "skillName": "TypeScript",
      "proficiency": "Advanced",
      "createdAt": "2026-02-10T07:21:15Z",
      "updatedAt": "2026-04-01T10:18:42Z"
    },
    {
      "id": 2,
      "userId": 7,
      "skillName": "Go",
      "proficiency": "Intermediate",
      "createdAt": "2026-02-10T07:22:10Z",
      "updatedAt": "2026-04-01T10:19:01Z"
    },
    {
      "id": 3,
      "userId": 7,
      "skillName": "PostgreSQL",
      "proficiency": "Advanced",
      "createdAt": "2026-02-10T07:23:54Z",
      "updatedAt": "2026-04-01T10:19:26Z"
    }
  ]
}`,
      },
    ],
  },

  {
    category: "Education",
    endpoints: [
      {
        method: "GET",
        path: "/education",
        description:
          "Returns the academic background and educational history.",
        response: `{
  "message": "education retrieved successfully",
  "educations": [
    {
      "id": 4,
      "userId": 7,
      "school": "University of San Carlos",
      "degree": "Bachelor of Science",
      "fieldOfStudy": "Computer Science",
      "startDate": "2016-06-01T00:00:00Z",
      "endDate": "2020-04-15T00:00:00Z",
      "createdAt": "2026-01-12T08:44:11Z",
      "updatedAt": "2026-03-20T09:33:02Z"
    }
  ]
}`,
      },
    ],
  },

  {
    category: "Projects",
    endpoints: [
      {
        method: "GET",
        path: "/project",
        description:
          "Returns all published and featured portfolio projects.",
        response: `{
  "message": "projects retrieved successfully",
  "projects": [
    {
      "id": 21,
      "userId": 7,
      "title": "TaskFlow",
      "description": "A collaborative productivity platform for remote engineering teams.",
      "link": "https://taskflow.app",
      "githubLink": "https://github.com/example/taskflow",
      "status": "completed",
      "isDraft": false,
      "createdAt": "2026-02-01T05:12:18Z",
      "updatedAt": "2026-05-02T10:41:55Z",
      "images": {
        "cover": "https://cdn.example.com/projects/taskflow/cover.webp",
        "screenshots": [
          "https://cdn.example.com/projects/taskflow/screen-1.webp",
          "https://cdn.example.com/projects/taskflow/screen-2.webp"
        ]
      },
      "technologies": [
        {
          "id": 1,
          "name": "Next.js",
          "slug": "nextjs",
          "category": "frontend"
        },
        {
          "id": 2,
          "name": "Tailwind CSS",
          "slug": "tailwindcss",
          "category": "frontend"
        },
        {
          "id": 3,
          "name": "PostgreSQL",
          "slug": "postgresql",
          "category": "backend"
        }
      ]
    },
    {
      "id": 22,
      "userId": 7,
      "title": "Pulse Analytics",
      "description": "A real-time analytics dashboard for monitoring SaaS performance metrics.",
      "link": "https://pulse.example.dev",
      "githubLink": "https://github.com/example/pulse-analytics",
      "status": "in-progress",
      "isDraft": false,
      "createdAt": "2026-03-11T06:28:31Z",
      "updatedAt": "2026-05-10T13:19:40Z",
      "images": {
        "cover": null,
        "screenshots": null
      },
      "technologies": [
        {
          "id": 4,
          "name": "React",
          "slug": "react",
          "category": "frontend"
        },
        {
          "id": 5,
          "name": "Node.js",
          "slug": "nodejs",
          "category": "backend"
        }
      ]
    }
  ]
}`,
      },

      {
        method: "GET",
        path: "/project/:id",
        description:
          "Returns a single project by its unique identifier.",
        response: `{
  "message": "project retrieved successfully",
  "project": {
    "id": 21,
    "userId": 7,
    "title": "TaskFlow",
    "description": "A collaborative productivity platform for remote engineering teams.",
    "link": "https://taskflow.app",
    "githubLink": "https://github.com/example/taskflow",
    "status": "completed",
    "isDraft": false,
    "createdAt": "2026-02-01T05:12:18Z",
    "updatedAt": "2026-05-02T10:41:55Z"
  }
}`,
      },
    ],
  },

  {
    category: "Experience",
    endpoints: [
      {
        method: "GET",
        path: "/experience",
        description:
          "Returns professional work experiences and roles.",
        response: `{
  "message": "experiences retrieved successfully",
  "experiences": [
    {
      "id": 1,
      "userId": 7,
      "title": "Frontend Engineer",
      "company": "CloudCore Solutions",
      "startDate": "2022-01-10T00:00:00Z",
      "endDate": "2024-06-30T00:00:00Z",
      "description": "Developed scalable internal tools and optimized frontend performance across multiple client platforms.",
      "createdAt": "2026-03-01T09:10:11Z",
      "updatedAt": "2026-05-14T07:55:42Z"
    }
  ]
}`,
      },
    ],
  },

  {
    category: "Certificates",
    endpoints: [
      {
        method: "GET",
        path: "/certificate",
        description:
          "Returns earned certifications and credentials.",
        response: `{
  "message": "certificates retrieved successfully",
  "certificates": [
    {
      "id": 1,
      "userId": 7,
      "title": "AWS Certified Developer – Associate",
      "issuer": "Amazon Web Services",
      "issueDate": "2025-09-18T00:00:00Z",
      "expirationDate": "2028-09-18T00:00:00Z",
      "credentialId": "AWS-DEV-938221",
      "credentialUrl": "https://verify.aws.example/certificate/938221",
      "createdAt": "2026-04-04T10:11:29Z",
      "updatedAt": "2026-04-04T10:11:29Z"
    }
  ]
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
    <Card variant="default">
      <div className="flex items-start justify-between gap-4 p-4 bg-base-300 rounded">
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
    <Card variant="interactive" className="shadow-xs overflow-hidden">
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
                code={`curl ${API_BASE_URL}${endpoint.path} \\ -H "Authorization: Bearer YOUR_PAT"`}
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Header */}
      <Card className="p-8 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary hidden lg:block">
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

          {/* <div className="badge badge-success badge-lg gap-2 opacity-90">
            <span className="size-2 rounded-full bg-current" />
            API Online
          </div> */}
        </div>
      </Card>

      {/* Quick Start */}
      <Card className="p-8 shadow-xs">
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
            <CodeBlock code={API_BASE_URL} />
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

      {/* CTA */}
      <Card
        className="p-8 border-primary/10 bg-info/5"
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
    </div>
  );
}