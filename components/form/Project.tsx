"use client"

import { useState, useRef } from "react"
import { Project } from "@/types/types"
import { projectApi } from "@/lib/api/projectApi"
import Modal from "../modal/Modal"
import { XMarkIcon } from "@heroicons/react/24/outline"

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

export default function ProfileProjectForm({
  initialProjects,
  setProjects,
}: Props) {
  const { addProject, updateProject, deleteProject } = projectApi()

  const debounceRef = useRef<Record<number, NodeJS.Timeout>>({})

  const [newProject, setNewProject] = useState<ProjectForm>({
    title: "",
    description: "",
    link: "",
    githubLink: "",
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // UPDATE
  const handleUpdate = (
    id: number,
    field: keyof Project,
    value: Project[keyof Project]
  ) => {
    let updatedItem: Project | undefined

    setProjects((prev) =>
      prev.map((item) => {
        if (item.id === id) {
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
        const res = await updateProject(id, updatedItem)
        setProjects(res.data.projects)
      } catch (err) {
        console.error("Failed to update project", err)
      }
    }, 500)
  }

  // ADD
  const handleAdd = async () => {
    if (!newProject.title.trim()) return

    const res = await addProject(newProject)
    setProjects(res.data.projects)

    setNewProject({
      title: "",
      description: "",
      link: "",
      githubLink: "",
    })
  }

  // DELETE
  const handleDelete = async () => {
    if (selectedId === null) return

    const res = await deleteProject(selectedId)
    setSelectedId(null)
    setProjects(res.data.projects)
  }

  return (
    <>
      <div className="space-y-6">
        {/* LIST */}
        <div className="space-y-4">
          {initialProjects.length === 0 && (
            <div className="text-center text-sm opacity-60 py-10">
              No projects added yet
            </div>
          )}

          {initialProjects.map((project) => (
            <div
              key={project.id}
              className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition"
            >
              <div className="card-body p-4 space-y-4">
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <input
                    type="text"
                    placeholder="Project Title"
                    className="input input-ghost text-lg font-semibold w-full focus:input-bordered"
                    value={project.title}
                    onChange={(e) =>
                      handleUpdate(project.id, "title", e.target.value)
                    }
                  />

                  <button
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => {
                      setSelectedId(project.id)
                      setModalOpen(true)
                    }}
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

                {/* DESCRIPTION */}
                <textarea
                  placeholder="Project description"
                  className="textarea textarea-bordered w-full min-h-[80px]"
                  value={project.description}
                  onChange={(e) =>
                    handleUpdate(project.id, "description", e.target.value)
                  }
                />

                {/* LINKS */}
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Live URL (https://...)"
                    className="input input-bordered w-full"
                    value={project.link}
                    onChange={(e) =>
                      handleUpdate(project.id, "link", e.target.value)
                    }
                  />

                  <input
                    type="text"
                    placeholder="GitHub URL"
                    className="input input-bordered w-full"
                    value={project.githubLink}
                    onChange={(e) =>
                      handleUpdate(project.id, "githubLink", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ADD */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body space-y-4">
            <h3 className="font-semibold text-base">Add Project</h3>

            <input
              type="text"
              placeholder="Project Title"
              className="input input-bordered w-full"
              value={newProject.title}
              onChange={(e) =>
                setNewProject((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

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

            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Live URL (https://...)"
                className="input input-bordered w-full"
                value={newProject.link}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    link: e.target.value,
                  }))
                }
              />

              <input
                type="text"
                placeholder="GitHub URL"
                className="input input-bordered w-full"
                value={newProject.githubLink}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    githubLink: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end">
              <button
                className="btn btn-primary"
                onClick={handleAdd}
                disabled={!newProject.title.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
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