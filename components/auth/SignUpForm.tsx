"use client";

import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

export default function SignUpForm() {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <div>
        <div className="py-4 text-center">
          <h2 className="text-3xl font-bold text-primary">Get Started</h2>
          <p className="mt-2 text-base-content">Create your account to continue.</p>
        </div>

        <form className="space-y-6">
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
            {loading ? "Signing up..." : "Sign Up"}
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
      </div>
    </>
  )
}