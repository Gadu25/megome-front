let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  // Prevent multiple simultaneous refresh calls
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

export async function fetchClient(
  input: string,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshed = await attemptRefresh();

    if (!refreshed) {
      window.location.href = "/auth";
      return res;
    }

    // Retry original request with fresh cookies
    return await fetch(input, {
      ...init,
      credentials: "include",
    });
  }

  return res;
}