import { getAccessToken } from "@/lib/auth/cookies";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

async function buildHeaders(extra?: HeadersInit) {
  const accessToken = await getAccessToken();

  return {
    ...(extra || {}),
    ...(accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {}),
  };
}

export async function fetchWithAuth(
  input: string,
  init?: RequestInit,
) {
  if (!input.startsWith("/")) {
    throw new Error(`Invalid API path: ${input}`);
  }

  const response = await fetch(`${BACKEND_URL}${input}`, {
    ...init,
    headers: await buildHeaders(init?.headers),
    cache: "no-store",
  });

  /**
   * DO NOT REFRESH INSIDE SSR
   *
   * Redirect browser instead.
   */
  if (response.status === 401) {
    redirect("/auth/refresh");
  }

  return response;
}