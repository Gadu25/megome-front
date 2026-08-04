"use client";

import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/components/ui/toast/useToast";
import { assistClient, type AssistTask } from "@/lib/api/client/assist";
import { useAiStatusStore } from "@/lib/store/ai-status-store";

type Props = {
  task: AssistTask;
  context: Record<string, string>;
  placeholder?: string;
  onResult: (fields: Record<string, string>) => void;
};

export default function AiAssistButton({
  task,
  context,
  placeholder = "Add extra details for the AI (optional)",
  onResult,
}: Props) {
  const { showToast } = useToast();
  const available = useAiStatusStore((s) => s.available);
  const markUnavailable = useAiStatusStore((s) => s.markUnavailable);
  const [open, setOpen] = useState(false);
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await assistClient(task, context, extra);
      onResult(res.data.fields);
      showToast(res.message, "success");
      setOpen(false);
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e?.status === 429) {
        markUnavailable();
        showToast("AI assist is temporarily unavailable due to quota", "error");
      } else {
        showToast(e?.message || "AI generation failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const disabled = available === false || loading;

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="btn btn-ghost btn-xs rounded-lg border border-base-300 disabled:opacity-50"
      >
        <SparklesIcon className="size-4" />
        Generate with AI
      </button>
      {open && (
        <div className="w-full space-y-2">
          <textarea
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder={placeholder}
            className="textarea textarea-bordered textarea-sm w-full"
          />
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="btn btn-primary btn-sm rounded-lg disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      )}
    </div>
  );
}
