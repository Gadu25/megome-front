"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";

type AiAssistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (extra: string) => Promise<void>;
  loading: boolean;
  placeholder?: string;
};

export default function AiAssistModal({
  isOpen,
  onClose,
  onGenerate,
  loading,
  placeholder = "Add extra details for the AI (optional)",
}: AiAssistModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [extra, setExtra] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setMounted(true);
      setExtra("");
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      timeout = setTimeout(() => setMounted(false), 200);
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async () => {
    await onGenerate(extra);
  }, [extra, onGenerate]);

  const hasExtra = extra.trim().length > 0;

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={[
          "w-full max-w-md rounded-box bg-base-100 p-6 shadow-xl",
          "transform transition-all duration-200 ease-out",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        ].join(" ")}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <SparklesIcon className="size-5 text-primary" />
            AI Assist
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Close"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <div className="alert alert-soft text-sm mb-4">
          <span>
            For more accurate results, fill out the other fields (title, company,
            dates, etc.) before generating.
          </span>
        </div>

        <textarea
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder={placeholder}
          className="textarea textarea-bordered w-full mb-4"
          rows={4}
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading}
            className="btn btn-primary rounded-lg disabled:opacity-50"
          >
            {loading
              ? "Generating..."
              : hasExtra
                ? "Submit"
                : "Skip"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
