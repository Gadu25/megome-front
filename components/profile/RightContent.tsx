"use client";

import { useState } from "react";
import ProfileProjects from "./rightContents/ProfileProjects";
import ProfileEducation from "./rightContents/ProfileEducation";
import ProfileExperience from "./rightContents/ProfileExperience";
import ProfileCertificates from "./rightContents/ProfileCertificate";

type Tab =
  | "projects"
  | "experience"
  | "education"
  | "certificates";

const tabs: {
  key: Tab;
  label: string;
}[] = [
  {
    key: "education",
    label: "Education",
  },
  {
    key: "experience",
    label: "Experience",
  },
  {
    key: "projects",
    label: "Projects",
  },
  {
    key: "certificates",
    label: "Certificates",
  },
];

export default function RightContent() {
  const [activeTab, setActiveTab] =
    useState<Tab>("education");

  return (
    <section className="space-y-4">

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Profile sections"
        className="flex gap-2 overflow-x-auto rounded-2xl border border-base-300 bg-base-100 p-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors
              ${
                activeTab === tab.key
                  ? "bg-primary text-primary-content"
                  : "text-base-content/70 hover:bg-base-200"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-4 sm:p-6">
        {activeTab === "projects" && (
          <ProfileProjects />
        )}

        {activeTab === "experience" && (
          <ProfileExperience />
        )}

        {activeTab === "education" && (
          <ProfileEducation />
        )}

        {activeTab === "certificates" && (
          <ProfileCertificates />
        )}
      </div>
    </section>
  );
}