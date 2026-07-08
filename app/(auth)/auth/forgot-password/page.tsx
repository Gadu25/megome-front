"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/toast/useToast";
import { forgotPassClient } from "@/lib/api/client/forgotpass";

import { withRequest } from "@/utils/api/withRequest";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await withRequest(
        () => forgotPassClient(email),
        showToast
      )

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8 shadow-lg">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              Forgot Password
            </h2>

            <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
              Enter your email and we’ll send you a password reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Email
              </legend>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
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
                {loading ? "Sending..." : "Send Reset Link"}
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

        </Card>
      </div>
    </main>
  );
}
