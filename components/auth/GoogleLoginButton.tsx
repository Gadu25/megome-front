export function GoogleLoginButton() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

  const handleGoogleLogin = () => {
  const popup = window.open(
    `${BACKEND_URL}/api/v1/auth/google`,
    "google-oauth",
    "width=500,height=600"
  );

  const listener = async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) {
      return;
    }

    if (event.data?.type !== "GOOGLE_AUTH_SUCCESS") {
      return;
    }

    window.removeEventListener("message", listener);

    await fetch("/api/auth/oauth-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: event.data.accessToken,
        refreshToken: event.data.refreshToken,
      }),
    });

    window.location.href = "/dashboard";
  };

  window.addEventListener("message", listener);
};

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="btn btn-outline w-full"
    >
      <div className="size-5 overflow-hidden rounded-full">
        <img
          src="https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico"
          alt="Google"
          className="h-full w-full object-cover"
        />
      </div>
      Continue with Google
    </button>
  );
}