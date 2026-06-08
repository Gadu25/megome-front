export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;

    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      "http://localhost:8080/api/v1/auth/google",
      "google-oauth",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        return;
      }

      try {
        const url = popup.location.href;

        if (url.includes("/auth/callback")) {
          const params = new URL(url).searchParams;

          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            popup.close();
            window.location.href = "/dashboard";
          }
        }
      } catch (e) {
        // ignore cross-origin until redirect back to your domain
      }
    }, 500);
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