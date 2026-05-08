import Link from "next/link";
import { cookies } from "next/headers";
import SearchBar from "@/components/common/SearchBar";
import ProjectCard from "@/components/projects/ProjectCard";
import { projectApi } from "@/lib/api/projectApi";
import { createAuthHeaders } from "@/functions/createAuthHeaders";
import { AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { ProjectFull } from "@/types/types";

type ProjectTab = "published" | "drafts";

interface ProjectSectionProps {
  projects: ProjectFull[];
  emptyMessage: string;
}

function ProjectGrid({
  projects,
  emptyMessage,
}: ProjectSectionProps) {
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

export default async function ProjectPage({
  searchParams,
}: {
  searchParams?: Promise<{
    tab?: ProjectTab;
  }>;
}) {
  const { getProjects } = projectApi();

  let projects: ProjectFull[] = [];

  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("Authentication");
    const refreshToken = cookieStore.get("refresh_token");

    const headers = createAuthHeaders(new Headers(), {
      accessToken,
      refreshToken,
    });

    const res = await getProjects(headers);
    console.log('res', res)

    projects = res?.data?.projects ?? [];
  } catch (error) {
    console.error("Failed to fetch projects", error);
  }

  const params = await searchParams;

  const activeTab: ProjectTab =
    params?.tab === "drafts"
      ? "drafts"
      : "published";

  const publishedProjects = projects.filter(
    (project) => !project.isDraft
  );

  const draftProjects = projects.filter(
    (project) => project.isDraft
  );

  const visibleProjects =
    activeTab === "drafts"
      ? draftProjects
      : publishedProjects;

  return (
    <section className="space-y-6">

      {/* Toolbar */}
      <header
        className="space-y-4 border-b border-base-200 pb-4"
        aria-label="Projects toolbar"
      >

        {/* Top Row */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar />
          </div>

          <button
            className="btn btn-square"
            aria-label="Filter projects"
          >
            <AdjustmentsHorizontalIcon
              className="size-5"
              aria-hidden="true"
            />
          </button>

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
            Drafts ({draftProjects.length})
          </Link>
        </nav>
      </header>

      <ProjectGrid
        projects={visibleProjects}
        emptyMessage={
          activeTab === "drafts"
            ? "No drafts found."
            : "No projects found."
        }
      />
    </section>
  );
}