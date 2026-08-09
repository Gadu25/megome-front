"use client";

import { useEffect, useCallback, useRef } from "react";

export function useDirtyGuard(dirty: boolean) {
  const dirtyRef = useRef(dirty);

  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const confirmNavigation = useCallback((): Promise<boolean> => {
    if (!dirtyRef.current) return Promise.resolve(true);
    return new Promise((resolve) => {
      const ok = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      resolve(ok);
    });
  }, []);

  return { confirmNavigation };
}
