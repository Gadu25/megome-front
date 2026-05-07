import { useEffect, useState } from "react";
import { Project } from "@/types/types";
import { projectApi } from "@/lib/api/projectApi";

import { useRouter } from "next/navigation"

import { SectionHeader } from "../sections/SectionHeaders";
import { EmptyState } from "../sections/EmptyState";

export default function ProfileProjects() {
  const { getProjects } = projectApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data.projects);
      } catch (error) {
        console.error("Error fetching experience:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [])

  return (
    <>
      <div className="space-y-4">
        <SectionHeader
          title="Projects"
          onEdit={() => router.push("/projects")}
        />

        {projects.length === 0 ? (
          <EmptyState
            title="🎓"
            description="You haven’t added any projects yet"
            action={
              <button
                className="btn btn-sm btn-primary"
                onClick={() => router.push("/projects")}
              >
                Add your first project
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="card bg-base-100 border border-base-300 hover:shadow-md transition"
              >
                <div className="card-body p-5 space-y-3">
                  {/* TITLE */}
                  <h3 className="font-semibold text-base leading-tight">
                    {project.title || "Untitled Project"}
                  </h3>

                  {/* DESCRIPTION */}
                  {project.description && (
                    <p className="text-sm text-base-content/70 line-clamp-3">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}