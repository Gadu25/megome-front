import {AdjustmentsHorizontalIcon, PlusIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import { cookies } from "next/headers";
import SearchBar from "@/components/common/SearchBar";
import ProjectCard from "@/components/projects/ProjectCard";
import { projectApi } from "@/lib/api/projectApi";
import { createAuthHeaders } from "@/functions/createAuthHeaders";
import type { ProjectFull } from "@/types/types";

export default async function ProjectPage() {
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

    projects = res?.data?.projects ?? [];
  } catch (error) {
    console.error("Failed to fetch projects", error);
  }

  return (
    <section className="space-y-6">

      {/* Toolbar */}
      <header
        className="flex items-center gap-2 border-b border-base-200 pb-4"
        aria-label="Projects toolbar"
      >
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
      </header>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-box border border-dashed border-base-300">
          <p className="text-sm text-base-content/60">
            No projects found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </section>
  );
}