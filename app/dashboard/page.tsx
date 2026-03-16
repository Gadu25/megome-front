"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/api";
import { logout } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import ThemeToggle from "@/components/themeToggle";

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
};

type Profile = {
  id: number;
  userId: number;
  bio: string;
  phone: string;
  website: string;
  location: string;
  profileImage: string;
};

type ApiResponse<T> = {
  message: string;
  data: T;
};

export default function DashboardPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projects: Project[] = [
    {
      id: "1",
      title: "Portfolio Builder",
      description: "A tool to manage structured career data.",
      techStack: ["Next.js", "Go", "Tailwind CSS"],
    },
    {
      id: "2",
      title: "Resume API",
      description: "Backend API for serving JSON portfolio data.",
      techStack: ["Go", "PostgreSQL", "JWT"],
    },
  ];

  const handleLogout = async () => {
  try {
    const data = await logout();
    console.log(data)
    useAuthStore.getState().setAccessToken(""); // make sure your auth store has a clearToken action
    alert("Logged out successfully!");
    // optionally redirect to login page
    window.location.href = "/auth";
  } catch (err) {
    console.error(err);
    alert("Logout failed, please try again.");
  }
};

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await apiFetch<ApiResponse<Profile>>("/api/v1/profile");
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-text-secondary">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-red-500">
        {error}
      </div>
    );
  }

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <nav className="navbar w-full bg-base-300">
          <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
          </label>
          <div className="w-full flex justify-between px-4">
            <div>Navbar Title</div>
              <ThemeToggle/>
          </div>
        </nav>
        <div className="p-2">

          <div className="p-6 lg:p-12 space-y-10">
            {/* Profile Card */}
            {profile && (
              <div className="bg-surface-elevated p-6 rounded-xl shadow-subtle flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-text-primary">
                  Dashboard
                </h2>

                <div className="mt-4 space-y-1">
                  <p className="text-text-secondary">
                    Phone: <span className="text-text-primary">{profile.phone}</span>
                  </p>

                  <p className="text-text-secondary">
                    Website:
                    <a
                      href={profile.website}
                      target="_blank"
                      className="ml-2 text-accent hover:underline"
                    >
                      {profile.website}
                    </a>
                  </p>

                  <p className="text-text-secondary">
                    Bio: <span className="text-text-primary">{profile.bio}</span>
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black py-2 px-4 rounded mt-4 transition"
            >
              Logout
            </button>

            {/* Access Token Section */}
            <div className="bg-surface-elevated p-6 rounded-xl shadow-subtle">
              <h3 className="text-xl font-semibold text-text-primary">
                Your Access Token
              </h3>

              {accessToken ? (
                <code className="block bg-background-subtle p-3 rounded-md mt-3 text-sm break-all">
                  {accessToken}
                </code>
              ) : (
                <p className="text-text-secondary mt-2">
                  No token found. Please login.
                </p>
              )}
            </div>

            <div className="bg-[var(--surface-elevated)] text-[var(--text-primary)] p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Projects</h2>
              <p className="text-[var(--text-secondary)]">
                Manage your portfolio projects easily.
              </p>

              <button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black py-2 px-4 rounded mt-4">
                Add Project
              </button>
            </div>

            {/* Projects */}
            {/* <div className="space-y-4">
              <h3 className="text-xl font-semibold text-text-primary">
                Projects
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-surface-elevated p-4 rounded-lg shadow-subtle flex flex-col gap-2"
                  >
                    <h4 className="font-bold text-text-primary">
                      {p.title}
                    </h4>

                    <p className="text-text-secondary text-sm">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="bg-accent-subtle text-accent px-2 py-1 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* API Key */}
            {/* <div className="bg-surface-elevated p-6 rounded-xl shadow-subtle">
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                API Access
              </h3>

              <p className="text-text-secondary mb-3">
                Your API key is used to fetch portfolio data.
              </p>

              <code className="block bg-background-subtle p-3 rounded-md select-all">
                123e4567-e89b-12d3-a456-426614174000
              </code>
            </div> */}

          </div>

        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow">
            <li>
              <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                <span className="is-drawer-close:hidden">Homepage</span>
              </button>
            </li>

            <li>
              <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                <span className="is-drawer-close:hidden">Settings</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}