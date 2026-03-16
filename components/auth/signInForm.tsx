"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { login } from "@/lib/api/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

export default function SignInForm() {
  const router = useRouter();

  const [showPass, setShowPass] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login({ email, password });
      console.log(data, 'data')
      setAccessToken(data['access-token']);
      router.push("/dashboard"); // redirect to dashboard on success
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 lg:p-12 bg-surface-elevated rounded-xl shadow-subtle">
      {/* Header */}
      <div className="py-4 text-center">
        <h2 className="text-3xl font-bold text-text-primary">Welcome Back</h2>
        <p className="text-gray-400 mt-2">Access your dashboard</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-error/10 text-error px-4 py-2 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email */}
        <div className="form-group flex flex-col">
          <label htmlFor="email" className="text-text-secondary font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="bg-background-subtle border border-border-DEFAULT rounded-md px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent hover:border-accent transition"
          />
        </div>

        {/* Password */}
        <div className="form-group relative flex flex-col">
          <label htmlFor="password" className="text-text-secondary font-medium mb-1">
            Password
          </label>
          <input
            type={showPass ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="bg-background-subtle border border-border-DEFAULT rounded-md px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent hover:border-accent transition"
          />
          <button
            type="button"
            onClick={() => setShowPass((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
          >
            {showPass ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Forgot / Submit */}
        <div className="flex justify-between items-center mt-2">
          <a href="#" className="text-gray-400 text-sm border-b border-gray-500">
            Forgot password?
          </a>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-background py-2 px-4 rounded-md font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}