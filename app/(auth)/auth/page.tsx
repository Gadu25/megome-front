"use client";
import { useState } from "react";
import { BoltIcon, PuzzlePieceIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { LogoFull } from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import AuthForm from "@/components/auth/AuthForm";

type FeatureProps = {
  icon: React.ReactNode;
  label: string;
};

function Feature({ icon, label }: FeatureProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-base-content/70">
      <div className="text-primary">
        {icon}
      </div>

      <span>{label}</span>
    </div>
  );
}

type AuthTabProps = {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

function AuthTab({
  children,
  active,
  onClick,
}: AuthTabProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative z-10 flex-1 py-3 text-center text-sm font-medium
        transition-colors duration-200 focus:outline-none
        ${
          active
            ? "text-primary"
            : "text-base-content/60 hover:text-base-content"
        }
      `}
    >
      {children}
    </button>
  );
}

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <main className="min-h-screen bg-base-100">
      <div className="flex min-h-screen flex-col xl:grid xl:grid-cols-2">

        {/* Marketing Section */}
        <section className="flex flex-col px-4 pb-8 pt-4 sm:px-6 lg:px-12 lg:pb-10 lg:pt-8 xl:order-1 xl:py-10">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogoFull />

              <span className=" hidden rounded-full border border-base-300 px-3 py-1 text-xs text-base-content/70 lg:inline-flex">
                API-First Portfolio Platform
              </span>
            </div>

            <ThemeToggle />
          </header>

          {/* Hero */}
          <div className="mx-auto md:flex hidden w-full max-w-2xl flex-1 flex-col justify-center py-8 lg:py-12 xl:py-0">
            <div className="space-y-4 lg:space-y-6">

              {/* Heading */}
              <div className="space-y-3 text-center xl:text-left">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Your Portfolio.
                  <br />
                  Powered by{" "}
                  <span className="text-primary">
                    API_
                  </span>
                </h1>

                <div className="space-y-1 text-base-content/70">
                  <p className="text-sm sm:text-base lg:text-lg">
                    Store, manage, and expose your developer portfolio through structured APIs.
                  </p>

                  <p className="hidden lg:block text-base lg:text-lg">
                    Built for developers who want reusable career data.
                  </p>
                </div>
              </div>

              {/* API Preview */}
              <div className=" overflow-hidden rounded-2xl border border-base-300 bg-neutral shadow-sm lg:shadow-md">
                {/* Top Bar */}
                <div className=" flex items-center justify-between border-b border-white/10 bg-neutral px-4 py-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-neutral-content">
                    <div className="size-2 rounded-full bg-success" />
                    API Response
                  </div>

                  <div className="tracking-[3px] text-neutral-content/50">
                    •••
                  </div>
                </div>

                {/* Code Block */}
                <div className="overflow-x-auto p-3 lg:p-4">
                  <pre
                    className="text-[11px] leading-5 text-neutral-content sm:text-xs sm:leading-6 lg:text-sm"
                  >
                    {`{
  "name": "John Doe",
  "role": "Full Stack Engineer",
  "skills": ["Go", "Next.js", "AWS"],
  "projects": 12
}`}
                  </pre>
                </div>
              </div>

              {/* Features */}
              <div className="hidden gap-6 pt-2 xl:flex">
                <Feature
                  icon={<BoltIcon className="size-5" />}
                  label="Fast"
                />

                <Feature
                  icon={<ShieldCheckIcon className="size-5" />}
                  label="Secure"
                />

                <Feature
                  icon={<PuzzlePieceIcon className="size-5" />}
                  label="Plug & Play"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="hidden text-sm text-base-content/60 xl:block">
            © 2026 Megome • Built for developers.
          </footer>
        </section>

        {/* Auth Section */}
        <section className="order-1 flex items-center justify-center bg-base-200 px-4 pb-6 pt-3 sm:px-6 lg:px-10 lg:py-10 xl:order-2">
          <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 shadow-lg xl:shadow-xl">
            <div className="p-5 sm:p-6 lg:p-8">
              {/* Tabs */}
              <div
                role="tablist"
                aria-label="Authentication mode"
                className="relative mb-6 flex border-b border-base-300"
              >
                <AuthTab
                  active={!isSignUp}
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </AuthTab>

                <AuthTab
                  active={isSignUp}
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </AuthTab>

                {/* Active Indicator */}
                <div className={`absolute bottom-0 left-0 h-0.5 w-1/2 bg-primary transition-transform duration-300 ease-in-out
                    ${isSignUp ? "translate-x-full" : ""}
                  `}
                />
              </div>

              {/* Form */}
              <div className="min-h-[320px]">
                <AuthForm
                  mode={isSignUp ? "signup" : "signin"}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}