"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassClient } from "@/lib/api/client/forgotpass";
import { withRequest } from "@/functions/withRequest";
import { useToast } from "@/components/toast/useToast";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { Card } from "@/components/common/Card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { showToast } = useToast();

  const isTokenValid = useMemo(() => {
    return !!token && token.length > 10;
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isTokenValid) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      
      const res = await withRequest(
        () => resetPassClient(password, token),
        showToast
      )

      if (res.success) {
        setSuccess(true);
      }

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8 shadow-lg">

          {/* Header */}
          {!success && (
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                Reset Password
              </h2>

              <p className="text-sm sm:text-base text-base-content/70">
                Enter your new password below.
              </p>
            </div>
          )}

          {/* Invalid token state */}
          {!isTokenValid && (
            <div className="mb-4 text-sm text-error bg-error/10 px-3 py-2 rounded-md">
              This reset link is invalid or missing.
            </div>
          )}

          {/* Success state */}
          {/* {success && ( */}
          {/*   <div className="mb-4 text-sm text-success bg-success/10 px-3 py-2 rounded-md"> */}
          {/*     Password updated successfully. Redirecting... */}
          {/*   </div> */}
          {/* )} */}

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-error bg-error/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
          
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">New Password</legend>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full"
                  required
                  disabled={!isTokenValid}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Confirm Password
                </legend>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input w-full"
                  required
                  disabled={!isTokenValid}
                />
              </fieldset>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">

                <Link
                  href="/auth"
                  className="text-sm text-accent hover:opacity-80 transition"
                >
                  Back to Sign In
                </Link>

                <button
                  type="submit"
                  disabled={loading || !isTokenValid}
                  className="
                    flex items-center justify-center gap-2
                    bg-primary text-primary-content
                    px-4 py-2 rounded-md font-bold
                    w-full sm:w-auto
                    disabled:opacity-60
                  "
                >
                  {loading ? "Updating..." : "Update Password"}
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          ):
          (
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-2xl font-semibold">Password Reset Successful</h2>
              <p className="text-muted-foreground max-w-md">
                Your password has been successfully updated. You can now sign in
                using your new password.
              </p>
              <Link href="/auth" className="text-accent">Sign In</Link>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
