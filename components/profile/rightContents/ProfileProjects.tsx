import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Project } from "@/types/types";
import { projectApi } from "@/lib/api/projectApi";

import { SectionHeader } from "../sections/SectionHeaders";
import { EmptyState } from "../sections/EmptyState";

const MAX_PREVIEW_PROJECTS = 4;

export default function ProfileProjects() {
  const { getProjects } = projectApi();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const displayProjects = useMemo(
    () => projects.slice(0, MAX_PREVIEW_PROJECTS),
    [projects]
  );

  const handleProjectsRedirect = () => {
    router.push("/projects");
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Projects"
        onEdit={handleProjectsRedirect}
      />

      {!loading && projects.length === 0 ? (
        <EmptyState
          title="🎓"
          description="You haven’t added any projects yet"
          action={
            <button
              className="btn btn-sm btn-primary"
              onClick={handleProjectsRedirect}
            >
              Add your first project
            </button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {displayProjects.map((project) => (
              <article
                key={project.id}
                className="card bg-base-100 border border-base-300 transition hover:shadow-md"
              >
                <div className="card-body space-y-3 p-5">
                  {/* TITLE */}
                  <h3 className="text-base font-semibold leading-tight">
                    {project.title || "Untitled Project"}
                  </h3>

                  {/* DESCRIPTION */}
                  {project.description && (
                    <p className="line-clamp-3 text-sm text-base-content/70">
                      {project.description}
                    </p>
                  )}

                  {/* LINKS */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-xs btn-primary"
                      >
                        Live
                      </a>
                    )}

                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-xs btn-ghost"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {projects.length > MAX_PREVIEW_PROJECTS && (
            <div className="flex justify-center pt-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={handleProjectsRedirect}
              >
                See more projects
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}