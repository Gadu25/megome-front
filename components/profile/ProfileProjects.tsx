import { useEffect, useState } from "react";
import { Project } from "@/types/types";
import { projectApi } from "@/lib/api/projectApi";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import RightModal from "../modal/RightModal";
import ProfileProjectForm from "../form/Project";
import Link from "next/link";

export default function ProfileProjects() {
  const { getProjects } = projectApi();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="card bg-base-100 shadow p-5 space-y-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">Projects</h2>
          <Link href="/projects/">
            <button className="btn btn-xs">
              <PencilSquareIcon className="size-5"/>
            </button>
          </Link>
        </div>

        {projects.length === 0 ? (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-base-300 rounded-xl bg-base-200/40">
      <div className="mb-3 text-base-content/60">🚀</div>

      <p className="text-sm text-base-content/70 mb-4">
        You haven’t added any projects yet
      </p>

      <Link href="/projects/new">
        <button className="btn btn-primary btn-sm">
          Add your first project
        </button>
      </Link>
    </div>
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

                    {/* FOOTER */}
                    {/* <div className="text-xs text-base-content/50 pt-2">
                      Created {humanizeDate(project.createdAt)}
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      {/* <RightModal
        title="Projects"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <ProfileProjectForm initialProjects={projects} setProjects={setProjects} />
      </RightModal> */}
    </>
  )
}