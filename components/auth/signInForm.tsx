"use client";

import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

export default function SignInForm() {
  const [showPass, setShowPass] = useState<boolean>(false);

  return (
    <>
      <div>
        <div className="py-2 lg:py-4 text-center">
          <h2 className="text-3xl">Welcome Back</h2>
          <p className="text-gray-500">Access your dashboard</p>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group relative">
          <label htmlFor="password">Password</label>
          <input
            type={showPass ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPass(prev => !prev)}
            className="absolute right-3 top-[34px] text-gray-700 hover:text-gray-400 transition cursor-pointer"
          >
            {showPass ? (
              <EyeSlashIcon className="size-5" />
            ) : (
              <EyeIcon className="size-5" />
            )}
          </button>

          <div className="flex justify-between items-center mt-6 lg:mt-14">
            <a href="#" className="border-b text-gray-500">Forgot password?</a>
            <button className="border border-gray-600 py-2 px-4 bg-linear-to-r from-slate-900 to-gray-900 rounded-md font-bold flex items-center gap-2 cursor-pointer">
              Sign In <ArrowRightIcon className="size-5"/>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}