"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="rounded-2xl border border-error/30 bg-base-100 p-6 text-center">
          <h3 className="text-lg font-semibold text-error mb-2">Something went wrong</h3>
          <p className="text-sm text-base-content/60 mb-4">
            This section encountered an error and couldn&apos;t load.
          </p>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try again
          </button>
          {this.state.error && (
            <details className="mt-3 text-left">
              <summary className="text-xs text-base-content/40 cursor-pointer">Error details</summary>
              <pre className="mt-2 text-xs text-error bg-base-200 p-2 rounded overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
