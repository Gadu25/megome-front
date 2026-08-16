"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/toast/useToast";
import { resendOtpClient, verifyEmailClient } from "@/lib/api/client/auth";
import { getInitClient } from "@/lib/api/client/init";
import { withRequest } from "@/utils/api/withRequest";

const RESEND_COOLDOWN = 60;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [email, setEmail] = useState(searchParams?.get("email") || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const redirectAfterLogin = async () => {
    const initData = await getInitClient();

    if (!initData.profile) {
      router.push("/profile-setup");
      return;
    }

    router.push("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await withRequest(
        () => verifyEmailClient(email, otp),
        showToast
      );

      if (res?.success) {
        showToast("Email verified successfully", "success");
        await redirectAfterLogin();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);

      await withRequest(() => resendOtpClient(email), showToast);

      setCooldown(RESEND_COOLDOWN);
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8 shadow-lg">

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              Verify Your Email
            </h2>

            <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
              We sent a 6-digit code to your email. Enter it below to activate
              your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Verification code</legend>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="input w-full text-center tracking-[8px] font-bold"
                placeholder="000000"
                required
              />
            </fieldset>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">

              <Link
                href="/auth"
                className="text-sm text-accent hover:opacity-80 transition"
              >
                Back to Sign In
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="
                  flex items-center justify-center gap-2
                  bg-primary text-primary-content
                  px-4 py-2 rounded-md font-bold
                  w-full sm:w-auto
                  disabled:opacity-60
                "
              >
                {loading ? "Verifying..." : "Verify Email"}
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Resend */}
          <div className="mt-6 pt-4 border-t border-base-300 text-center">
            <p className="text-sm text-base-content/70 mb-2">
              Did not receive the code?
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0 || !email}
              className="text-sm text-accent hover:opacity-80 transition disabled:opacity-60"
            >
              {cooldown > 0
                ? `Resend code in ${cooldown}s`
                : resending
                ? "Sending..."
                : "Resend code"}
            </button>
          </div>

        </Card>
      </div>
    </main>
  );
}
