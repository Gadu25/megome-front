import { useEffect, useState } from "react";
import { Project } from "@/types/types";
import { projectApi } from "@/lib/api/projectApi";

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
    <div className="card bg-base-100 shadow p-5 space-y-4">
      <div className="flex justify-between">
        <h2 className="font-semibold">Projects</h2>
        <button className="btn btn-ghost btn-xs">Edit</button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-6 px-4 border border-dashed rounded-lg">
          <p className="text-sm opacity-70 mb-3">
            No projects added yet. Showcase your work here.
          </p>
          <button className="btn btn-sm btn-primary">
            Add Project
          </button>
        </div>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="p-4 border border-base-300 rounded-lg">
            <h3 className="font-semibold">{project.title}</h3>
            <p className="text-sm text-base-content/70">
              {project.description}
            </p>
            {/* <div className="flex gap-2 mt-2">
              {project.tech.map((t: string) => (
                <span key={t} className="badge badge-outline">{t}</span>
              ))}
            </div> */}
          </div>
        ))
      )}
    </div>
  )
}