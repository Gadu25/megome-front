export function getErrorMessage(
  err: unknown,
  fallback = "Unexpected error"
): string {
  if (err && typeof err === "object") {
    const data = (err as { data?: { error?: string; message?: string } }).data;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    const message = (err as { message?: string }).message;
    if (message) return message;
  }
  return fallback;
}

export async function withRequest<TResponse>(
  request: () => Promise<TResponse>,
  showToast: (msg: string, type: "success" | "error") => void
): Promise<TResponse | null> {
  try {
    const res = await request();
    const message = (res as { message?: string }).message;
    if (message) {
      showToast(message, "success");
    }
    return res;
  } catch (err: unknown) {
    showToast(getErrorMessage(err), "error");
    return null;
  }
}
