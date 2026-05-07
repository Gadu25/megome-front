import { projectApi } from "@/lib/api/projectApi";
import type { ProjectFull } from "@/types/types";
import { cookies } from "next/headers";
import { createAuthHeaders } from "@/functions/createAuthHeaders";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ScreenshotsSection } from "@/components/projects/Screenshots";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { getProject } = projectApi();
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("Authentication");
  const refreshToken = cookieStore.get("refresh_token");

  const headers = createAuthHeaders(new Headers(), {
    accessToken,
    refreshToken,
  });

  let project: ProjectFull | null = null;

  try {
    const res = await getProject(parseInt(id), headers);
    project = res?.data?.project ?? null;
  } catch (error) {
    console.error("Failed to fetch project:", error);
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-base-content/60">
        Project not found
      </div>
    );
  }

  const techs = project.technologies ?? [];
  const cover = project.images?.cover ?? null;
  const screenshots = project.images?.screenshots ?? [];

  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-10">

      {/* HERO */}
      <header className="space-y-4">
        <ProjectHeader
          id={project.id}
          title={project.title}
          status={project.status}
        />

        <div className="rounded-xl overflow-hidden bg-base-200 h-72">
          {cover ? (
            <img
              src={cover}
              alt={`${project.title} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-base-content/50">
              No cover image
            </div>
          )}
        </div>
      </header>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* MAIN */}
        <div className="lg:col-span-2 space-y-10">

          {/* OVERVIEW */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="text-base-content/80 leading-relaxed">
              {project.description || "No description provided for this project."}
            </p>
          </section>

          {/* SCREENSHOTS */}
          <ScreenshotsSection
            screenshots={screenshots}
            projectTitle={project.title}
          />
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-8">

          {/* TECHNOLOGIES */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-base-content/70">
              Technologies
            </h3>

            <div className="flex flex-wrap gap-2">
              {techs.length > 0 ? (
                techs.map((tech) => (
                  <span key={tech.id} className="badge badge-outline">
                    {tech.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-base-content/50">
                  No technologies listed
                </span>
              )}
            </div>
          </section>

          {/* ACTIONS */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-base-content/70">
              Project Links
            </h3>

            <div className="flex flex-col gap-2">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  className="btn btn-primary btn-sm"
                >
                  Live Project
                </a>
              )}

              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  className="btn btn-outline btn-sm"
                >
                  GitHub Repository
                </a>
              )}
            </div>
          </section>

          {/* METADATA */}
          <section className="space-y-2 text-sm text-base-content/60">
            <h3 className="font-semibold text-base-content/70">
              Metadata
            </h3>

            <div className="space-y-1">
              <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
            </div>
          </section>

        </aside>
      </div>
    </div>
  );
}