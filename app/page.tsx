"use client";

import { useState, useEffect } from "react";
import { BoltIcon, CircleStackIcon, KeyIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { LogoFull } from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type CodeTab = "json" | "curl" | "fetch";

type FeatureItem = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

type StepItem = {
  num: string;
  title: string;
  desc: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CODE_EXAMPLES: Record<CodeTab, string> = {
  json: `{
  "id": "usr_k8x2m9p",
  "username": "jdoe",
  "profile": {
    "name": "Jane Doe",
    "title": "Senior Software Engineer",
    "bio": "Building resilient systems at scale."
  },
  "experience": [
    {
      "company": "Acme Corp",
      "role": "Lead Engineer",
      "start": "2021-03",
      "current": true
    }
  ],
  "projects": [
    {
      "title": "Distributed Cache Layer",
      "stack": ["Go", "Redis", "gRPC"],
      "url": "https://github.com/jdoe/cache"
    }
  ],
  "skills": ["Go", "Kubernetes", "PostgreSQL"]
}`,
  curl: `curl -X GET \\
  https://api.megome.dev/v1/jdoe \\
  -H "Authorization: Bearer mgm_live_••••••••"`,
  fetch: `const res = await fetch(
  "https://api.megome.dev/v1/jdoe",
  {
    headers: {
      Authorization: \`Bearer \${process.env.MEGOME_API_KEY}\`
    }
  }
);
const portfolio = await res.json();`,
};

const CODE_TAB_LABELS: Record<CodeTab, string> = {
  json: "Response",
  curl: "cURL",
  fetch: "fetch",
};

const FEATURES: FeatureItem[] = [
  {
    icon: <CircleStackIcon className="size-5" />,
    title: "Structured by design",
    desc: "Your career data lives in a strict, typed schema. No freeform blobs — just clean, predictable JSON every time.",
  },
  {
    icon: <BoltIcon className="size-5" />,
    title: "REST API, first class",
    desc: "One endpoint per user. Hit it from any portfolio site, static generator, or CLI. Works with fetch, curl, Axios.",
  },
  {
    icon: <ArrowPathIcon className="size-5" />,
    title: "Single source of truth",
    desc: "Update once in your dashboard. Every site or script that consumes the API reflects the change instantly.",
  },
  {
    icon: <KeyIcon className="size-5" />,
    title: "API key management",
    desc: "Generate scoped keys per project. Rotate without touching your consumers. Monitor usage from the dashboard.",
  },
];

const STEPS: StepItem[] = [
  {
    num: "01",
    title: "Register & create your profile",
    desc: "Set up your account, add your bio, experience, projects, and skills in a structured editor.",
  },
  {
    num: "02",
    title: "Get your API endpoint",
    desc: "Your personal endpoint is ready instantly. Copy your key and URL from the dashboard.",
  },
  {
    num: "03",
    title: "Power your portfolio",
    desc: "Fetch your data anywhere — static sites, SPAs, CLI scripts. One source, infinite consumers.",
  },
];

const DASHBOARD_NAV = ["Profile", "Experience", "Projects", "Skills", "API Keys"] as const;

const DASHBOARD_PROJECTS = [
  { title: "Distributed Cache Layer", stack: "Go · Redis · gRPC" },
  { title: "Portfolio API",           stack: "Go · PostgreSQL"   },
  { title: "CLI Toolkit",             stack: "Go · Cobra"        },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

type FeatureCardProps = { item: FeatureItem };

function FeatureCard({ item }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
      <div className="text-primary">{item.icon}</div>
      <h3 className="text-sm font-semibold text-base-content">{item.title}</h3>
      <p className="text-sm text-base-content/60 leading-relaxed">{item.desc}</p>
    </div>
  );
}

type StepRowProps = { item: StepItem };

function StepRow({ item }: StepRowProps) {
  return (
    <div className="flex gap-6 py-6 border-b border-base-300 last:border-0">
      <span className="text-xs text-base-content/30 tracking-widest mt-0.5 w-6 shrink-0 font-mono">
        {item.num}
      </span>
      <div>
        <h3 className="text-sm font-semibold text-base-content mb-1">{item.title}</h3>
        <p className="text-sm text-base-content/60 leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
}

type CodeTabButtonProps = {
  tab: CodeTab;
  active: boolean;
  onClick: () => void;
};

function CodeTabButton({ tab, active, onClick }: CodeTabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 transition-colors font-mono tracking-wide rounded-lg
        ${active
          ? "bg-base-300 text-base-content"
          : "text-base-content/40 hover:text-base-content/70"
        }`}
    >
      {CODE_TAB_LABELS[tab]}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<CodeTab>("json");
  const [copied, setCopied]       = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-screen bg-base-100">

      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled ? "bg-base-100/80 backdrop-blur border-b border-base-300" : ""}`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoFull />
            <span className="hidden sm:inline-flex rounded-full border border-base-300 px-3 py-1 text-xs text-base-content/50">
              API-First Portfolio Platform
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="#how" className="hidden sm:block text-sm text-base-content/60 hover:text-base-content transition-colors">
              How it works
            </Link>
            <Link href="#api" className="hidden sm:block text-sm text-base-content/60 hover:text-base-content transition-colors">
              API
            </Link>
            <Link href="/auth" className="text-sm text-base-content/60 hover:text-base-content transition-colors">
              Sign in
            </Link>
            <Link href="/auth?mode=signup" className="btn btn-primary btn-sm rounded-xl">
              Get started
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center xl:items-start xl:text-left max-w-2xl mx-auto xl:mx-0">

          {/* Badge */}
          <span className="mb-6 inline-flex rounded-full border border-base-300 px-3 py-1 text-xs text-base-content/50 font-mono tracking-wide">
            Portfolio infrastructure · REST API
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-base-content mb-5 leading-[1.05]">
            Your Portfolio.
            <br />
            Powered by{" "}
            <span className="text-primary font-mono">API_</span>
          </h1>

          <div className="space-y-1 text-base-content/60 mb-8">
            <p className="text-base sm:text-lg">
              Store, manage, and expose your developer portfolio through structured APIs.
            </p>
            <p className="hidden lg:block text-lg">
              Built for developers who want reusable career data.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth?mode=signup" className="btn btn-primary rounded-xl">
              Start free
            </Link>
            <Link href="#api" className="btn btn-ghost rounded-xl text-base-content/60">
              View API docs →
            </Link>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-base-300 border border-base-300 rounded-2xl overflow-hidden mt-16">
          {(["Go backend", "REST endpoints", "Typed schema", "API keys"] as const).map((t) => (
            <div key={t} className="bg-base-100 px-5 py-4">
              <p className="text-xs text-base-content/40 font-mono tracking-widest uppercase">{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CODE BLOCK ── */}
      <section id="api" className="px-4 sm:px-6 max-w-5xl mx-auto pb-20">
        <div className="overflow-hidden rounded-2xl border border-base-300 bg-neutral shadow-md">

          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-neutral px-4 py-3">
            <div className="flex items-center gap-3 text-sm font-medium text-neutral-content">
              <div className="size-2 rounded-full bg-success" />
              API Response
            </div>
            <div className="flex items-center gap-2">
              {(["json", "curl", "fetch"] as CodeTab[]).map((tab) => (
                <CodeTabButton
                  key={tab}
                  tab={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                />
              ))}
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1.5 text-neutral-content/50 hover:text-neutral-content transition-colors font-mono tracking-wide"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Code */}
          <div className="overflow-x-auto p-4 lg:p-6">
            <pre className="text-xs sm:text-sm leading-6 text-neutral-content font-mono whitespace-pre">
              {CODE_EXAMPLES[activeTab]}
            </pre>
          </div>

          {/* Endpoint strip */}
          <div className="border-t border-white/10 px-4 py-2.5 flex items-center gap-3">
            <span className="text-xs text-success font-mono tracking-widest uppercase">GET</span>
            <span className="text-xs text-neutral-content/40 font-mono">
              https://api.megome.dev/v1/
            </span>
            <span className="text-xs text-primary font-mono">{"{username}"}</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto pb-20">
        <p className="text-xs text-base-content/40 font-mono tracking-widest uppercase mb-8">
          Core primitives
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} item={f} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="px-4 sm:px-6 max-w-5xl mx-auto pb-20">
        <p className="text-xs text-base-content/40 font-mono tracking-widest uppercase mb-8">
          How it works
        </p>
        <div className="rounded-2xl border border-base-300 bg-base-100 divide-y divide-base-300 px-6">
          {STEPS.map((s) => (
            <StepRow key={s.num} item={s} />
          ))}
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto pb-20">
        <p className="text-xs text-base-content/40 font-mono tracking-widest uppercase mb-8">
          Dashboard preview
        </p>

        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-sm lg:shadow-md">
          {/* Chrome bar */}
          <div className="flex items-center gap-2 border-b border-base-300 px-4 py-3 bg-base-100">
            <div className="size-2.5 rounded-full bg-base-300" />
            <div className="size-2.5 rounded-full bg-base-300" />
            <div className="size-2.5 rounded-full bg-base-300" />
            <span className="text-xs text-base-content/30 font-mono ml-2 tracking-wide">
              megome.dev/dashboard/projects
            </span>
          </div>

          <div className="flex min-h-[240px]">
            {/* Sidebar */}
            <div className="hidden sm:flex w-36 shrink-0 flex-col border-r border-base-300 p-4 bg-base-100 gap-1">
              {DASHBOARD_NAV.map((item, i) => (
                <div
                  key={item}
                  className={`text-xs py-1.5 px-2 rounded-lg tracking-wide transition-colors
                    ${i === 2
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-base-content/40"
                    }`}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-base-content">Projects</span>
                <button className="btn btn-ghost btn-xs rounded-lg text-base-content/50">
                  + Add project
                </button>
              </div>

              <div className="flex flex-col divide-y divide-base-300">
                {DASHBOARD_PROJECTS.map(({ title, stack }) => (
                  <div key={title} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm text-base-content font-medium">{title}</div>
                      <div className="text-xs text-base-content/40 font-mono mt-0.5">{stack}</div>
                    </div>
                    <button className="btn btn-ghost btn-xs rounded-lg text-base-content/40">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-base-content/30 text-center mt-3 tracking-wide">
          Structured editing — no CMS clutter
        </p>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto pb-24">
        <div className="rounded-2xl border border-base-300 bg-base-200 p-8 sm:p-12
          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2 tracking-tight">
              Stop hardcoding
              <br />
              your portfolio.
            </h2>
            <p className="text-sm text-base-content/50">Free to start. No credit card required.</p>
          </div>
          <div className="flex flex-col gap-3 items-start sm:items-end shrink-0">
            <Link href="/auth?mode=signup" className="btn btn-primary rounded-xl">
              Create account
            </Link>
            <Link href="/auth" className="btn btn-primary rounded-xl">
              Already have an account → Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-base-300 px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-sm text-base-content/40">© 2026 Megome · Built for developers.</span>
          <div className="flex gap-6">
            {(["Docs", "GitHub", "Status"] as const).map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm text-base-content/40 hover:text-base-content/70 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}