"use client";

import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/components/ui/toast/useToast";
import { assistClient, type AssistTask } from "@/lib/api/client/assist";
import { useAiStatusStore } from "@/lib/store/ai-status-store";
import AiAssistModal from "./AiAssistModal";

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
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (extra: string) => {
    setLoading(true);
    try {
      const res = await assistClient(task, context, extra);
      onResult(res.data.fields);
      showToast(res.message, "success");
      setOpen(false);
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string; data?: { message?: string } };
      if (e?.status === 429 && e?.data?.message === "ai_unavailable") {
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
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="btn btn-ghost btn-xs rounded-lg border border-base-300 disabled:opacity-50"
      >
        <SparklesIcon className="size-4" />
        Generate with AI
      </button>
      <AiAssistModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onGenerate={handleGenerate}
        loading={loading}
        placeholder={placeholder}
      />
    </>
  );
}
