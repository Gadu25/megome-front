import { AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline"
import { projectApi } from "@/lib/api/projectApi";
import type { ProjectFull } from "@/types/types";
import { getStatusStyle } from "@/functions/getStatusStyle";
import Link from "next/link"
import SearchBar from "@/components/common/SearchBar"
import { cookies } from "next/headers";
import { createAuthHeaders } from "@/functions/createAuthHeaders";

export default async function ProjectPage() {
  const { getProjects } = projectApi();

  let projects: ProjectFull[] = [];

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("Authentication");
    const refreshToken = cookieStore.get("refresh_token");
    const headers = createAuthHeaders(new Headers(), { accessToken, refreshToken });

    const res = await getProjects(headers);
    projects = res?.data?.projects ?? [];
  } catch (error) {
    console.error('error', error);
  }

  return (
    <>
      {/* Top bar */}
      <div className="flex pb-4 mb-6 gap-2 border-b border-base-200">
        <SearchBar />
        <button className="btn btn-square">
          <AdjustmentsHorizontalIcon className="size-5" />
        </button>
        <Link href="/projects/new" className="btn btn-square btn-primary">
          <PlusIcon className="size-5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {projects.map((project) => {
          // ✅ normalize ONCE
          const techs = project.technologies ?? [];
          const cover = project.images?.cover ?? null;

          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group"
            >
              <div className="card bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">

                {/* Image */}
                <figure className="h-48 bg-base-200 overflow-hidden">
                  {cover ? (
                    <img
                      src={cover}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-base-content/50">
                      No cover image
                    </div>
                  )}
                </figure>

                {/* Body */}
                <div className="card-body p-4 gap-3">

                  {/* Title + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-base line-clamp-1">
                      {project.title}
                    </h2>
                    <span className={`badge badge-sm ${getStatusStyle(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {project.description || "No description"}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {techs.slice(0, 3).map((tech) => (
                      <span key={tech.id} className="badge badge-outline badge-xs">
                        {tech.name}
                      </span>
                    ))}

                    {techs.length > 3 && (
                      <span className="badge badge-ghost badge-xs">
                        +{techs.length - 3}
                      </span>
                    )}
                  </div>

                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  )
}