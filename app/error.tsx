"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center max-w-md px-6">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-base-content/60 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/dashboard" className="btn btn-ghost">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
