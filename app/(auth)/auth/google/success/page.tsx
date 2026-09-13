"use client";

import { useEffect } from "react";

export default function GoogleSuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const accessTokenMaxAge = params.get("access_token_max_age");
    const refreshTokenMaxAge = params.get("refresh_token_max_age");

    if (!accessToken || !refreshToken) return;

    window.opener?.postMessage(
      {
        type: "GOOGLE_AUTH_SUCCESS",
        accessToken,
        refreshToken,
        accessTokenMaxAge: accessTokenMaxAge ? Number(accessTokenMaxAge) : undefined,
        refreshTokenMaxAge: refreshTokenMaxAge ? Number(refreshTokenMaxAge) : undefined,
      },
      window.location.origin
    );

    window.close();
  }, []);

  return <p>Signing you in...</p>;
}