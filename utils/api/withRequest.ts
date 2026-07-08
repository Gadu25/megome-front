export async function withRequest<TResponse>(
  request: () => Promise<TResponse>,
  showToast: (msg: string, type: "success" | "error") => void
): Promise<TResponse | null> {
  try {
    const res = await request();
    if ((res as any)?.message) {
      showToast((res as any).message, "success");
    }
    return res;
  } catch (err: any) {
    showToast(
      err?.data?.error || 
      err?.data?.message ||
      err?.message || 
      "Unexpected error",
      "error"
    );
    return null;
  }
}
