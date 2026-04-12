"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { authApi } from "@/lib/api/authApi";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { InitApi } from "@/lib/api/initApi";

const SIGNUP = "signup";
const SIGNIN = "signin";

type MODE = typeof SIGNUP | typeof SIGNIN;

export default function AuthForm({ mode }: { mode: MODE }) {
  const router = useRouter();

  const { login } = authApi();
  const { register } = authApi();
  const { getInit } = InitApi();

  const [showPass, setShowPass] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleLogin = async () => {
    await login(email, password)
    const initData = await getInit();

    if (!initData.data.profile) {
      router.push("/profile-setup")
    }
    router.push("/dashboard");
  }

  const handleRegister = async () => {
    await register(email, password)
    const initData = await getInit();

    if (!initData.data.profile) {
      router.push("/profile-setup")
    }
    router.push("/dashboard");
  }

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <form onSubmit={handleAction} className="space-y-6">
        {/* Email */}
        <div className="form-group flex flex-col">
          <label htmlFor="email" className="text-base-content font-medium mb-1">
            Email
          </label>
          <input 
            id="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            className="input w-full"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="form-group relative flex flex-col">
          <label htmlFor="password" className="text-base-content font-medium mb-1">
            Password
          </label>
          <input 
            id="password"
            type={showPass ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="input w-full relative"
            required
          />
          <button
            type="button"
            onClick={() => setShowPass((prev) => !prev)}
            className="absolute right-3 top-[50%] -translate-y-[-2px] text-base-content hover:text-secondary transition cursor-pointer"
          >
            {showPass ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

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