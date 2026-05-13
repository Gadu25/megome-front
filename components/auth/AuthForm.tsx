"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { authSchema } from "@/features/auth/schema";
import { useToast } from "../toast/useToast";
import { getInitClient } from "@/lib/api/client/init";
import { loginClient, registerClient } from "@/lib/api/client/auth";

const SIGNUP = "signup";
const SIGNIN = "signin";

type MODE = typeof SIGNUP | typeof SIGNIN;

export default function AuthForm({ mode }: { mode: MODE }) {
  const router = useRouter();
  const { showToast } = useToast();


  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleLogin = async () => {
    const res = await loginClient(email, password);

    const initData = await getInitClient();

    if (!initData.profile) {
      router.push("/profile-setup");
      return;
    }

    router.push("/dashboard");
  };

  const handleRegister = async () => {
    const res = await registerClient(email, password);

    // showToast(res.message, "success");

    const initData = await getInitClient();

    if (!initData.profile) {
      router.push("/profile-setup");
      return;
    }

    router.push("/dashboard");
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});
    setLoading(true);

    try {
      const result = authSchema.safeParse({ email, password });

      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      if (mode === SIGNIN) {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formDisplay = useMemo(() => {
    const isSignin = mode === SIGNIN;

    return {
      title: isSignin ? "Welcome Back" : "Create an Account",
      subtitle: isSignin ? "Access your dashboard" : "Start your journey",
      buttonLabel: isSignin ? "Sign In" : "Sign Up",
    };
  }, [mode]);

  return (
    <div>
      <div className="py-4 text-center">
        <h2 className="text-3xl font-bold text-primary">
          {formDisplay.title}
        </h2>
        <p className="mt-2 text-base-content">
          {formDisplay.subtitle}
        </p>
      </div>

      {error && (
        <div className="bg-error/10 text-error px-4 py-2 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAction} className="space-y-3 mx-auto">
        <fieldset className="fieldset relative">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="email"
            value={email}
            className={`input w-full ${errors.email ? "input-error" : ""}`}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </fieldset>

        <fieldset className="fieldset relative">
          <legend className="fieldset-legend">Password</legend>
          <input
            type={showPass ? "text" : "password"}
            value={password}
            className={`input w-full ${errors.password ? "input-error" : ""}`}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-[50%] -translate-y-[50%]"
          >
            {showPass ? (
              <EyeSlashIcon className="h-4 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </fieldset>

        <div className="flex justify-between items-center mt-10">
          <a href="#" className="text-sm text-accent">
            Forgot password?
          </a>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-content py-2 px-4 rounded-md font-bold"
          >
            {loading ? "Loading..." : formDisplay.buttonLabel}
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}