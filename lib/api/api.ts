import { useAuthStore } from "../store/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
let refreshPromise: Promise<boolean> | null = null;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  });

  // Access token expired
  if (res.status === 401 && retry) {
    const refreshed = await handleRefresh();
    
    if (!refreshed) {
      // logout();
      throw new Error("Session expired");
    }

    // retry original request
    return apiFetch<T>(path, options, false);
  }

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json();
}

async function handleRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return false;

        const data = await res.json();
        useAuthStore.getState().setAccessToken(data["access-token"]);

        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function logout() {
  useAuthStore.getState().setAccessToken(null);
  window.location.href = "/auth";
}