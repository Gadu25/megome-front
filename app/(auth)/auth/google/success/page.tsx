"use client";

import { useEffect } from "react";

export default function GoogleSuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) return;

    window.opener?.postMessage(
      {
        type: "GOOGLE_AUTH_SUCCESS",
        accessToken,
        refreshToken,
      },
      window.location.origin
    );

    window.close();
  }, []);

  return <p>Signing you in...</p>;
}