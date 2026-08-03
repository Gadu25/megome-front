"use client";

import { useId } from "react";
import { ClipboardIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
import { Endpoint, API_BASE_URL, METHOD_STYLES } from "./data";

export function CopyButton({ value }: { value: string }) {
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

export function CodeBlock({ code }: { code: string }) {
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

export function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const id = useId();

  return (
    <Card variant="interactive" className="shadow-xs overflow-hidden">
      <div className="collapse group bg-transparent">
        <input id={id} type="checkbox" className="hidden" />

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
            </div>
            <p className="text-sm text-base-content/60">
              {endpoint.description}
            </p>
          </div>

          <div className="pt-1 opacity-60">
            <ChevronRightIcon className="size-5 transition-transform duration-200 group-has-[:checked]:rotate-90" />
          </div>
        </label>

        <div className="collapse-content border-t border-base-200/40 bg-base-100/40 space-y-4">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-base-content/70">
                Example Request
              </p>
              <CodeBlock
                code={`curl ${API_BASE_URL}${endpoint.path} \\\n  -H "Authorization: Bearer YOUR_PAT"`}
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
