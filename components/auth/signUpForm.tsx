"use client";

import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

export default function SignUpForm() {
  const [showPass, setShowPass] = useState<boolean>(false);

  return (
    <>
      <div>
        <div className="py-4 text-center">
          <h2 className="text-3xl">Get Started</h2>
          <p className="text-gray-500">Create your account to continue.</p>
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

          <div className="flex justify-between items-center mt-14">
            <button className="border border-gray-600 py-2 px-4 bg-linear-to-r from-slate-900 to-gray-900 rounded-md font-bold flex items-center gap-2 cursor-pointer">
              Sign Up <ArrowRightIcon className="size-5"/>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}