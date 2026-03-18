"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/api";
import { logout } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";

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

  return (
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
    </div>
  );
}