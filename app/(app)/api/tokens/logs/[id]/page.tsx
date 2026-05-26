import { getTokenLogsServer } from "@/lib/api/server/apiLog";
import { humanizeDate } from "@/functions/humanitizeDate";

export default async function ApiUsageLogsPage({ params }: { params: { id: string }}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const res = await getTokenLogsServer(parseInt(id));
  const logs = res?.data.logs ?? [];

  const token = res?.data.token;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

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

      {/* FILTER BAR (UI-ready placeholder) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="input input-bordered w-full sm:max-w-xs"
          placeholder="Search endpoint..."
        />

        <select className="select select-bordered w-full sm:max-w-xs">
          <option>All methods</option>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>

        <select className="select select-bordered w-full sm:max-w-xs">
          <option>All statuses</option>
          <option>2xx</option>
          <option>4xx</option>
          <option>5xx</option>
        </select>
      </div>

      {/* LOGS TABLE */}
      <div className="overflow-x-auto rounded-lg border border-base-200">
        <table className="table table-zebra">
          <thead>
            <tr className="text-xs uppercase text-base-content/60">
              <th>Time</th>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Status</th>
              <th>Response</th>
              <th>IP</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-base-content/50">
                  No API usage recorded for this token
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="text-sm">
                    {humanizeDate(log.createdAt)}
                  </td>

                  <td>
                    <span className="badge badge-outline badge-sm">
                      {log.method}
                    </span>
                  </td>

                  <td className="font-mono text-xs">
                    {log.endpoint}
                  </td>

                  <td>
                    <span
                      className={`badge badge-sm ${
                        log.statusCode >= 500
                          ? "badge-error"
                          : log.statusCode >= 400
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {log.statusCode}
                    </span>
                  </td>

                  <td className="text-sm">
                    {log.responseTimeMs ? `${log.responseTimeMs}ms` : "-"}
                  </td>

                  <td className="text-xs text-base-content/60">
                    {log.ipAddress ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}