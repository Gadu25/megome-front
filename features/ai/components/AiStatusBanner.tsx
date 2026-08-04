"use client";

import { useEffect } from "react";
import { getAiStatusClient } from "@/lib/api/client/assist";
import { useAiStatusStore } from "@/lib/store/ai-status-store";

export default function AiStatusBanner() {
  const available = useAiStatusStore((s) => s.available);
  const setStatus = useAiStatusStore((s) => s.setStatus);

  useEffect(() => {
    getAiStatusClient()
      .then((res) =>
        setStatus(res.data.available, res.data.cooldownRemainingSeconds)
      )
      .catch(() => {});
  }, [setStatus]);

  if (available !== false) return null;

  return (
    <div className="alert alert-warning rounded-none border-0 text-sm">
      <span>
        AI assist is temporarily unavailable due to quota. Try again later.
      </span>
    </div>
  );
}
