"use client"

import { useState, useRef } from "react"
import { projectApi } from "@/lib/api/projectApi"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useToast } from "../toast/useToast";
import { withRequest } from "@/functions/withRequest";
import type { Project } from "@/types/types"
import Modal from "../modal/Modal"

type ProjectForm = {
  title: string
  description: string
  link: string
  githubLink: string
}

type Props = {  
  initialProjects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export default function ProfileProjectForm({ initialProjects, setProjects }: Props) {
  const { addProject, updateProject, deleteProject } = projectApi();
  const { showToast } = useToast();

  const debounceRef = useRef<Record<number, NodeJS.Timeout>>({})

  const [newProject, setNewProject] = useState<ProjectForm>({
    title: "",
    description: "",
    link: "",
    githubLink: "",
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleUpdate = (id: number, field: keyof Project, value: Project[keyof Project]) => {
    let updatedItem: Project | undefined
    let previousItem: Project | undefined

    setProjects((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          previousItem = item
          updatedItem = { ...item, [field]: value }
          return updatedItem
        }
        return item
      })
    )

    if (debounceRef.current[id]) {
      clearTimeout(debounceRef.current[id])
    }

    debounceRef.current[id] = setTimeout(async () => {
      if (!updatedItem) return

      try {
        const data = await withRequest(
          () => updateProject(id, updatedItem as ProjectForm),
          showToast
        )

        if (!data) return;

        setProjects((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...data.project } : item
          )
        );
      } catch (err) {
        console.error("Failed to update project", err)
        if (previousItem) {
          setProjects((prev) => 
            prev.map((item) =>
              item.id === id ? previousItem! : item
            )
          )
        }
      }
    }, 500)
  }

  const handleAdd = async () => {
    if (!newProject.title.trim()) return

    const data = await withRequest(
      () => addProject(newProject),
      showToast
    )

    if (!data) return;
    setProjects((prev) => [...prev, data.project]);

    setNewProject({
      title: "",
      description: "",
      link: "",
      githubLink: "",
    })
  }

  const handleDelete = async () => {
    if (selectedId === null) return

    const data = await withRequest(
      () => deleteProject(selectedId),
      showToast
    )

    if (!data) return;
    setSelectedId(null)
    setProjects((prev) =>
      prev.filter((item) => item.id !== selectedId)
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          {initialProjects.length === 0 && (
            <div className="text-center text-sm opacity-60 py-10">
              No projects added yet
            </div>
          )}

          {initialProjects.map((project) => (
            <div key={project.id} className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition">
              <div className="card-body p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <input type="text" placeholder="Project Title" className="input input-ghost text-lg font-semibold w-full focus:input-bordered"
                    value={project.title}
                    onChange={(e) =>
                      handleUpdate(project.id, "title", e.target.value)
                    }
                  />

                  <button className="btn btn-ghost btn-sm text-error"
                    onClick={() => {
                      setSelectedId(project.id)
                      setModalOpen(true)
                    }}
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

                <textarea
                  placeholder="Project description"
                  className="textarea textarea-bordered w-full min-h-[80px]"
                  value={project.description}
                  onChange={(e) =>
                    handleUpdate(project.id, "description", e.target.value)
                  }
                />

                <div className="grid md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Live URL (https://...)" className="input input-bordered w-full" value={project.link}
                    onChange={(e) =>
                      handleUpdate(project.id, "link", e.target.value)
                    }
                  />

                  <input type="text" placeholder="GitHub URL" className="input input-bordered w-full" value={project.githubLink}
                    onChange={(e) =>
                      handleUpdate(project.id, "githubLink", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h3 className="font-semibold text-base">Add Project</h3>

            <fieldset className="fieldset relative">
              <label className="label"><span className="text-error">*</span>Title</label>
              <input type="text" placeholder="Project Title" className="input input-bordered w-full" value={newProject.title}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </fieldset>
            <fieldset className="fieldset relative">
              <legend className="label">Your bio</legend>
              <textarea
                placeholder="Project description"
                className="textarea textarea-bordered w-full min-h-[80px]"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </fieldset>

            <div className="grid md:grid-cols-2 gap-3">
              <fieldset className="fieldset relative">
                <label className="label">Link</label>
                <input type="text" placeholder="Live URL (https://...)" className="input input-bordered w-full"
                  value={newProject.link}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      link: e.target.value,
                    }))
                  }
                />
              </fieldset>
              
              <fieldset className="fieldset relative">
                <label className="label">Github</label>
                <input type="text" placeholder="GitHub URL" className="input input-bordered w-full" value={newProject.githubLink}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      githubLink: e.target.value,
                    }))
                  }
                />
              </fieldset>
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={handleAdd} disabled={!newProject.title.trim()}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete Project"
        onAccept={handleDelete}
        onCancel={() => setModalOpen(false)}
        acceptText="Delete"
      >
        <p className="text-sm opacity-70">
          This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}