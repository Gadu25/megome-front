"use client";

import { useEffect, useState } from "react";

import { Experience, Education, Certificate, Project } from "@/types/domain";
import { getExperienceClient } from "@/lib/api/client/experience";
import { getEducationClient } from "@/lib/api/client/education";
import { getCertificateClient } from "@/lib/api/client/certificate";
import { getProjectsClient } from "@/lib/api/client/project";

import { Card } from "@/components/ui/Card";
import ReorderTab from "./ReorderTab";

type Tab = "experience" | "certificates" | "education" | "projects";

const tabs: { key: Tab; label: string }[] = [
  { key: "experience", label: "Experience" },
  { key: "certificates", label: "Certificates" },
  { key: "education", label: "Education" },
  { key: "projects", label: "Projects" },
];

export default function ReorderPage() {
  const [activeTab, setActiveTab] = useState<Tab>("experience");
  const [loading, setLoading] = useState(true);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const expRes = await getExperienceClient().catch(() => null);
        const certRes = await getCertificateClient().catch(() => null);
        const eduRes = await getEducationClient().catch(() => null);
        const projRes = await getProjectsClient().catch(() => null);
        setExperiences(expRes?.data ?? []);
        setCertificates(certRes?.data ?? []);
        setEducations(eduRes?.data ?? []);
        setProjects(projRes?.data ?? []);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const sortByIds = <T extends { id: number; displayOrder: number }>(items: T[]): T[] =>
    [...items].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id);

  const experienceItems = sortByIds(experiences).map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: e.company,
  }));

  const certificateItems = sortByIds(certificates).map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.issuer,
  }));

  const educationItems = sortByIds(educations).map((e) => ({
    id: e.id,
    title: e.school,
    subtitle: [e.degree, e.fieldOfStudy].filter(Boolean).join(" — "),
  }));

  const projectItems = sortByIds(projects).map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.status,
  }));

  const getItems = () => {
    switch (activeTab) {
      case "experience":
        return { items: experienceItems, resource: "experience" as const };
      case "certificates":
        return { items: certificateItems, resource: "certification" as const };
      case "education":
        return { items: educationItems, resource: "education" as const };
      case "projects":
        return { items: projectItems, resource: "project" as const };
    }
  };

  const { items, resource } = getItems();

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reorder Items</h1>
        <p className="text-sm text-base-content/60">
          Drag and drop to reorder how items appear on your public profile.
        </p>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Reorder sections"
        className="flex gap-2 overflow-x-auto rounded-xl border border-base-300 bg-base-100 p-3"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.key
                ? "bg-primary text-primary-content"
                : "text-base-content/70 hover:bg-base-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <Card className="shadow-xs p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <ReorderTab
            key={activeTab}
            resource={resource}
            items={items}
          />
        )}
      </Card>
    </main>
  );
}
