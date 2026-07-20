import Link from "next/link";
import { getTokenLogsServer } from "@/lib/api/server/apiLog";
import { humanizeDate } from "@/utils/date/humanizeDate";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { LogsFilter } from "@/features/api/components/LogsFilter";

export default async function ApiUsageLogsPage({ params }: { params: { id: string }}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const res = await getTokenLogsServer(parseInt(id));
  const logs = res?.data.logs ?? [];

  const token = res?.data.token;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="mb-4">
        <Link
          href="/api/tokens"
          className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Tokens
        </Link>
      </div>

      {/* HEADER / CONTEXT */}
      <header className="space-y-3 border-b border-base-200 pb-4">
        <h1 className="text-xl font-semibold">API Usage Logs</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/60">
          <span className="font-medium text-base-content">
            {token?.name ?? "Unknown Token"}
          </span>

          <span className={`badge badge-sm ${token?.revokedAt ? "badge-error" : "badge-success"}`}>
            {token?.revokedAt ? "Revoked" : "Active"}
          </span>

          <span>•</span>
          <span>{logs.length} requests</span>
        </div>

        <div className="text-xs text-base-content/50">
          Last activity: {logs[0]?.createdAt ? humanizeDate(logs[0].createdAt) : "N/A"}
        </div>
      </header>

      <LogsFilter logs={logs} />
    </div>
  );
}