"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { registerSchema, loginSchema } from "@/features/auth/schema";
import { useToast } from "../toast/useToast";
import { getInitClient } from "@/lib/api/client/init";
import { loginClient, registerClient } from "@/lib/api/client/auth";
import { GoogleLoginButton } from "./GoogleLoginButton";
import Link from "next/link";

const SIGNUP = "signup";
const SIGNIN = "signin";

type MODE = typeof SIGNUP | typeof SIGNIN;

export default function AuthForm({ mode }: { mode: MODE }) {
  const router = useRouter();
  const { showToast } = useToast();


  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleLogin = async () => {
    const res = await loginClient(emailOrUsername, password);

    const initData = await getInitClient();

    if (!initData.profile) {
      router.push("/profile-setup");
      return;
    }

    router.push("/dashboard");
  };

  const handleRegister = async () => {
    const res = await registerClient(username, email, password);

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

    const isSignIn = mode === SIGNIN;

    try {
      const schema = isSignIn ? loginSchema : registerSchema;
      const action = isSignIn ? handleLogin : handleRegister;

      if (!schema) {
        throw new Error("Schema not defined");
      }

      const data = isSignIn ? {
        emailOrUsername,
        password,
      }
      : {
        username,
        email,
        password,
      };

      const result = schema.safeParse(data);

      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        console.log("ERRORS", errors)
        return;
      }

      await action();
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
        {mode === SIGNIN && (
          <>
            <GoogleLoginButton />

            <div className="divider">
              OR
            </div>
          </>
        )}
        {mode === SIGNUP && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Username
            </legend>

            <input
              type="text"
              value={username}
              className={`input w-full ${
                errors.username ? "input-error" : ""
              }`}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </fieldset>
        )}
        <fieldset className="fieldset relative">
            {mode === SIGNUP ? 
              (
              <legend className="fieldset-legend">
                Email
              </legend>
              ) :
              <legend className="fieldset-legend">
                Email or Username
              </legend>
            }
          <input
            type="text"
            value={mode === SIGNUP ? email : emailOrUsername}
            className={`input w-full ${errors.email ? "input-error" : ""}`}
            onChange={mode === SIGNUP ? (e) => setEmail(e.target.value) : (e) => setEmailOrUsername(e.target.value)}
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
          {mode === SIGNIN ?
            <Link href="/auth/forgot-password" className="text-sm text-accent">
              Forgot password?
            </Link>
          : <div></div> }

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