"use client";

import { useState } from 'react';
import { BoltIcon, ShieldCheckIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'
import { LogoFull } from '@/components/common/logo';
import ThemeToggle from '@/components/themeToggle';
import SignInForm from '@/components/auth/signInForm';
import SignUpForm from '@/components/auth/signUpForm';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  return (
    <>
      <div className="flex h-screen w-screen flex-col xl:flex-row">
        <div className="flex-1 flex flex-col justify-between p-4 lg:p-16">
          {/* header */}
          <div className="flex items-center relative">
            <LogoFull/>
            <span className="border border-solid border-gray-800 text-xs flex justify-center items-center py-1 px-2 rounded-full ms-4">API-First Portfolio Platform</span>
            <div className="px-4 absolute right-0">
              <ThemeToggle/>
            </div>
          </div>

          {/* body */}
          <div className="mt-16 xl:mt-0 text-center xl:text-start">
            <h1 className="text-3xl lg:text-6xl mb-4 ">Your Portfolio.<br/>Powered by <span className="text-primary">API_</span></h1>
            <div className="hidden lg:block">
              <p className="text-xl">Store, Manage, Expose.</p>
              <p className="text-xl">Your career data, structured and developer ready.</p>
            </div>
            <div className="flex justify-center xl:justify-start">
              <div className="lg:my-4 border border-solid border-gray-800 rounded-xl lg:min-w-lg text-sm lg:text-lg">
                <div className="flex justify-between p-2 items-center text-accent-content bg-accent rounded-tl-xl rounded-tr-xl">
                  <div className="flex gap-4 items-center mx-4 font-semibold"><div className="size-2 rounded-full bg-success"></div>API Response</div>
                  <div className="tracking-[4px]">•••</div>
                </div>
                <div className="p-2 bg-neutral rounded-br-lg rounded-bl-lg">
                  <pre className="text-start text-neutral-content font-mono p-6 text-xs lg:text-sm font-semibold">
                    {"{"}
                      <div className="ms-4 mt-2 mb-2">
                        <span className="text-blue-400">"name"</span>: <span className="text-green-400">"John Doe"</span>,
                        <br />
                        <span className="text-blue-400">"role"</span>: <span className="text-green-400">"Full Stack Engineer"</span>,
                        <br />
                        <span className="text-blue-400">"skills"</span>: [
                          <span className="text-yellow-400">"Go"</span>, <span className="text-yellow-400">"Next.js"</span>, <span className="text-yellow-400">"AWS"</span>
                        ],
                        <br />
                        <span className="text-blue-400">"projects"</span>: <span className="text-purple-400">12</span>
                      </div>
                    {"}"}
                  </pre>
                </div>
              </div>
            </div>
            <div className="hidden xl:flex justify-center xl:justify-between max-w-lg my-8 text-base-content">
              <div className="p-2 flex gap-2 items-center">
                <BoltIcon className="size-8" />
                <span>Fast</span>
              </div>
              <div className="p-2 flex gap-2 items-center">
                <ShieldCheckIcon className="size-8" />
                <span>Secure</span>
              </div>
              <div className="p-2 flex gap-2 items-center">
                <PuzzlePieceIcon className="size-8" />
                <span>Plug & Play</span>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="hidden xl:block text-base-content">
            <span>© 2026 Megome • Built for developers.</span>
          </div>
        </div>

        <div className="flex-1 bg-base-300 p-2 lg:p-24 flex justify-center items-center w-full">
          <div className="card card-border bg-base-100 w-full lg:mx-16">
            <div className="card-body">
              <div className="flex relative pb-2 text-sm lg:text-xl text-base-content">
                <button 
                  className="flex-1 p-2 flex justify-center items-center cursor-pointer"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </button>
                <button 
                  className="flex-1 p-2 flex justify-center items-center cursor-pointer"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </button>
                <div 
                  className={`
                    absolute bottom-0 left-0 h-1 w-1/2 rounded-sm bg-primary
                    transition-transform duration-300 ease-in-out
                    ${isSignUp ? "translate-x-full" : "translate-x-0"}
                  `}
                />
              </div>
              <div className="min-h-[300px] py-2 lg:py-4">
                {isSignUp ? <SignUpForm/> : <SignInForm/>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}