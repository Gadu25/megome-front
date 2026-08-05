"use client";

import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getAiStatusClient } from "@/lib/api/client/assist";
import { useAiStatusStore } from "@/lib/store/ai-status-store";

export default function AiStatusBanner() {
  const available = useAiStatusStore((s) => s.available);
  const setStatus = useAiStatusStore((s) => s.setStatus);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getAiStatusClient()
      .then((res) =>
        setStatus(res.data.available, res.data.cooldownRemainingSeconds)
      )
      .catch(() => {});
  }, [setStatus]);

  useEffect(() => {
    setDismissed(false);
  }, [available]);

  if (available !== false || dismissed) return null;

  return (
    <div className="alert alert-warning rounded-none border-0 text-sm">
      <span>
        AI assist is temporarily unavailable due to quota. Try again later.
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="btn btn-ghost btn-xs btn-square"
        aria-label="Dismiss"
      >
        <XMarkIcon className="size-4" />
      </button>
    </div>
  );
}
