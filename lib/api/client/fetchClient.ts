let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

async function attemptRefresh(): Promise<boolean> {
  if (isRefreshing) return refreshPromise!;

  isRefreshing = true;
  refreshPromise = fetch("/api/auth/refresh", {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchClient(
  input: string,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401) {
    // If middleware already refreshed recently, retry immediately
    const refreshedAt = getCookie("token_refreshed_at");
    if (refreshedAt && Date.now() - Number(refreshedAt) < 30_000) {
      return await fetch(input, {
        ...init,
        credentials: "include",
      });
    }

    const refreshed = await attemptRefresh();

    if (!refreshed) {
      await delay(1000);
      const retried = await attemptRefresh();
      if (!retried) {
        window.location.href = "/auth";
        return res;
      }
    }

    // Retry original request with fresh cookies
    return await fetch(input, {
      ...init,
      credentials: "include",
    });
  }

  return res;
}