"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import { ProjectCard } from "@/features/project";
import { AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { ProjectFull } from "@/types/domain";

type ProjectTab = "published" | "drafts";

interface ProjectsClientProps {
  projects: ProjectFull[];
  activeTab: ProjectTab;
  draftCount: number;
}

function ProjectGrid({
  projects,
  emptyMessage,
}: {
  projects: ProjectFull[];
  emptyMessage: string;
}) {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-box border border-dashed border-base-300">
        <p className="text-sm text-base-content/60">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}

export default function ProjectsClient({
  projects,
  activeTab,
  draftCount,
}: ProjectsClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [techFilter, setTechFilter] = useState<number[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filtersOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filtersOpen]);

  const allStatuses = useMemo(() => {
    const statuses = new Set(projects.map((p) => p.status).filter(Boolean));
    return Array.from(statuses).sort();
  }, [projects]);

  const allTechnologies = useMemo(() => {
    const techMap = new Map<number, { id: number; name: string }>();
    for (const project of projects) {
      for (const tech of project.technologies ?? []) {
        techMap.set(tech.id, { id: tech.id, name: tech.name });
      }
    }
    return Array.from(techMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = activeTab === "drafts"
      ? projects.filter((p) => p.isDraft)
      : projects.filter((p) => !p.isDraft);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (techFilter.length > 0) {
      result = result.filter((p) =>
        (p.technologies ?? []).some((t) => techFilter.includes(t.id))
      );
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((p) => new Date(p.createdAt) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((p) => new Date(p.createdAt) <= to);
    }

    return result;
  }, [projects, activeTab, search, statusFilter, techFilter, dateFrom, dateTo]);

  const activeFilterCount =
    (statusFilter ? 1 : 0) +
    (techFilter.length > 0 ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  function toggleTech(techId: number) {
    setTechFilter((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId]
    );
  }

  function clearFilters() {
    setStatusFilter("");
    setTechFilter([]);
    setDateFrom("");
    setDateTo("");
  }

  return (
    <>
      {/* Toolbar */}
      <header
        className="space-y-4 border-b border-base-200 pb-4"
        aria-label="Projects toolbar"
      >
        {/* Top Row */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search projects..."
            />
          </div>

          <div className="relative" ref={filterRef}>
            <button
              className="btn btn-square relative"
              aria-label="Filter projects"
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <AdjustmentsHorizontalIcon
                className="size-5"
                aria-hidden="true"
              />
              {activeFilterCount > 0 && (
                <span className="badge badge-primary badge-xs absolute -right-1 -top-1">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {filtersOpen && (
              <div className="absolute right-0 menu rounded-box bg-base-100 border border-base-200 shadow-lg p-4 w-80 z-50 mt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={clearFilters}
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-medium text-base-content/70">
                  Status
                </label>
                <select
                  className="select select-bordered select-sm w-full"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All statuses</option>
                  {allStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Technologies */}
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-medium text-base-content/70">
                  Technologies
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1 border border-base-200 rounded-lg p-2">
                  {allTechnologies.length === 0 && (
                    <p className="text-xs text-base-content/50">No technologies found</p>
                  )}
                  {allTechnologies.map((tech) => (
                    <label
                      key={tech.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-base-200 rounded px-1 py-0.5"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs checkbox-primary"
                        checked={techFilter.includes(tech.id)}
                        onChange={() => toggleTech(tech.id)}
                      />
                      <span className="text-sm">{tech.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-base-content/70">
                  Created date
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="input input-bordered input-sm flex-1"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                  <span className="text-base-content/50 self-center text-xs">to</span>
                  <input
                    type="date"
                    className="input input-bordered input-sm flex-1"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
              </div>
            )}
          </div>

          <Link
            href="/projects/new"
            className="btn btn-square btn-primary"
            aria-label="Create new project"
          >
            <PlusIcon
              className="size-5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Tabs */}
        <nav
          className="tabs tabs-bordered"
          aria-label="Project categories"
        >
          <Link
            href="/projects?tab=published"
            className={`tab ${
              activeTab === "published"
                ? "tab-active"
                : ""
            }`}
          >
            Projects
          </Link>

          <Link
            href="/projects?tab=drafts"
            className={`tab ${
              activeTab === "drafts"
                ? "tab-active"
                : ""
            }`}
          >
            Drafts ({draftCount})
          </Link>
        </nav>
      </header>

      <ProjectGrid
        projects={filteredProjects}
        emptyMessage={
          activeTab === "drafts"
            ? "No drafts found."
            : "No projects found."
        }
      />
    </>
  );
}
