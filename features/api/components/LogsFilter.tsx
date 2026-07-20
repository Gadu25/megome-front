"use client";

import { useMemo, useState } from "react";
import { humanizeDate } from "@/utils/date/humanizeDate";
import type { ApiUsageLog } from "@/types/domain";

interface LogsFilterProps {
  logs: ApiUsageLog[];
}

export function LogsFilter({ logs }: LogsFilterProps) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredLogs = useMemo(() => {
    let result = logs;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((log) => log.endpoint.toLowerCase().includes(q));
    }

    if (methodFilter) {
      result = result.filter((log) => log.method === methodFilter);
    }

    if (statusFilter === "2xx") {
      result = result.filter((log) => log.statusCode >= 200 && log.statusCode < 300);
    } else if (statusFilter === "4xx") {
      result = result.filter((log) => log.statusCode >= 400 && log.statusCode < 500);
    } else if (statusFilter === "5xx") {
      result = result.filter((log) => log.statusCode >= 500 && log.statusCode < 600);
    }

    return result;
  }, [logs, search, methodFilter, statusFilter]);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="input input-bordered w-full sm:max-w-xs"
          placeholder="Search endpoint..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered w-full sm:max-w-xs"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="">All methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <select
          className="select select-bordered w-full sm:max-w-xs"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="2xx">2xx</option>
          <option value="4xx">4xx</option>
          <option value="5xx">5xx</option>
        </select>
      </div>

      <div className="text-sm text-base-content/50">
        {filteredLogs.length === logs.length
          ? `${logs.length} requests`
          : `${filteredLogs.length} of ${logs.length} requests`}
      </div>

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
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-base-content/50">
                  {logs.length === 0
                    ? "No API usage recorded for this token"
                    : "No results match your filters"}
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
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
    </>
  );
}
