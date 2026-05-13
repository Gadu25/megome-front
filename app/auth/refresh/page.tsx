"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RefreshPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams?.get("redirect") ?? "/dashboard";

  useEffect(() => {
    async function refresh() {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          router.replace("/login");
          return;
        }
        
        router.replace(redirectTo);
      } catch {
        router.replace("/login");
      }
    }

    refresh();
  }, [router, redirectTo]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      Restoring session...
    </div>
  );
}