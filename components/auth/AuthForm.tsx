"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { authApi } from "@/lib/api/authApi";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { InitApi } from "@/lib/api/initApi";
import { authSchema } from "@/features/auth/schema";
import { useToast } from "../toast/useToast";

const SIGNUP = "signup";
const SIGNIN = "signin";

type MODE = typeof SIGNUP | typeof SIGNIN;

export default function AuthForm({ mode }: { mode: MODE }) {
  const router = useRouter();
  const { showToast } = useToast();

  const { login, register } = authApi();
  const { getInit } = InitApi();

  const [showPass, setShowPass] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      showToast(res.data.message, "success");

      const initData = await getInit();

      if (!initData.data.profile) {
        router.push("/profile-setup");
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      showToast(err.response?.data?.error, "error");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await register(email, password);
      showToast(res.data.message, "success");
      
      const initData = await getInit();
  
      if (!initData.data.profile) {
        router.push("/profile-setup")
      }
      router.push("/dashboard");
    } catch (err: any) {
      showToast(err.response?.data?.error, "error");
    }
  }

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});
    setLoading(true);

    try {
      const result = authSchema.safeParse({ email, password });
  
      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        setLoading(false);
        return;
      }
  
      switch (mode) {
        case SIGNIN:
          handleLogin();
          break;
        case SIGNUP:
          handleRegister();
          break;
        default:
          console.error("Invalid action");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

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
      {/* Header */}
      <div className="py-4 text-center">
        <h2 className="text-3xl font-bold text-primary">{formDisplay.title}</h2>
        <p className="mt-2 text-base-content">{formDisplay.subtitle}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-error/10 text-error px-4 py-2 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleAction} className="space-y-3 mx-auto">
        {/* Email */}
        <fieldset className="fieldset relative">
          <legend className="fieldset-legend">Email</legend>
          <input id="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            className={`input w-full ${errors.email ? "input-error" : ""}`}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <span className="text-error text-sm absolute bottom-[-1rem] left-0">
              {errors.email[0]}
            </span>
          )}
        </fieldset>

        {/* Password */}
        <fieldset className="fieldset relative">
          <legend className="fieldset-legend">Password</legend>
          <input id="password"
            type={showPass ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={`input w-full ${errors.password ? "input-error" : ""}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPass((prev) => !prev)}
            className="absolute right-3 top-[50%] -translate-y-[50%] text-base-content hover:text-secondary transition cursor-pointer"
          >
            {showPass ? <EyeSlashIcon className="h-4 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
          {errors.password && (
            <span className="text-error text-sm absolute bottom-[-1rem] left-0">
              {errors.password[0]}
            </span>
          )}
        </fieldset>


        {/* Forgot / Submit */}
        <div className="flex justify-between items-center mt-10">
          <a href="#" className="text-sm text-accent">
            Forgot password?
          </a>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-content py-2 px-4 rounded-md font-bold transition cursor-pointer"
          >
            {loading ? "Signing in..." : formDisplay.buttonLabel }
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}