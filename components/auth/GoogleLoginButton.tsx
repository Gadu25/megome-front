// components/auth/GoogleLoginButton.tsx

export function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    // trigger google oauth
    window.location.href = "http://localhost:8080/auth/google";
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