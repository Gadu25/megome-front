"use client"

import { useState } from "react"
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline"

type Technology = {
  id: number
  name: string
  slug: string
  category: string
  isVerified: boolean
}

type ProjectForm = {
  title: string
  description: string
  link: string
  githubLink: string
}

type ProjectImage = {
  file: File | null
  preview: string
  type: "cover" | "screenshot" | "demo"
}

const MOCK_TECH: Technology[] = [
  { id: 1, name: "React", slug: "react", category: "frontend", isVerified: true },
  { id: 2, name: "Next.js", slug: "next-js", category: "frontend", isVerified: true },
  { id: 3, name: "Node.js", slug: "node-js", category: "backend", isVerified: true },
  { id: 4, name: "Tailwind CSS", slug: "tailwind-css", category: "frontend", isVerified: true },
  { id: 5, name: "Prisma", slug: "prisma", category: "tool", isVerified: true },
]

export default function CreateProjectPage() {

  const [form, setForm] = useState<ProjectForm>({
    title: "",
    description: "",
    link: "",
    githubLink: "",
  })

  const [images, setImages] = useState<{
    cover: ProjectImage | null
    screenshots: ProjectImage[]
    demo: ProjectImage | null
  }>({
    cover: null,
    screenshots: [],
    demo: null,
  })

  const [search, setSearch] = useState("")
  const [selectedTech, setSelectedTech] = useState<Technology[]>([])

  const filteredTech = MOCK_TECH.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const addTech = (tech: Technology) => {
    if (selectedTech.find((t) => t.id === tech.id)) return
    setSelectedTech((prev) => [...prev, tech])
  }

  const removeTech = (id: number) => {
    setSelectedTech((prev) => prev.filter((t) => t.id !== id))
  }

  const createProject = () => {
    const payload = {
      ...form,
      technologies: selectedTech.map((t) => t.id),
    }

    console.log(payload)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Create Project</h1>
        <p className="text-sm opacity-60">
          Build your project showcase step by step
        </p>
      </div>

      {/* ========================= */}
      {/* 1. CORE INFO */}
      {/* ========================= */}
      <section className="space-y-4">

        <h2 className="text-lg font-semibold">Core Information</h2>

        <fieldset className="fieldset space-y-3">

          <input
            className="input input-bordered w-full"
            placeholder="Project title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="textarea textarea-bordered w-full min-h-[120px]"
            placeholder="Describe your project..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid md:grid-cols-2 gap-3">
            <input
              className="input input-bordered"
              placeholder="Live URL"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />

            <input
              className="input input-bordered"
              placeholder="GitHub URL"
              value={form.githubLink}
              onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
            />
          </div>

        </fieldset>
      </section>

      {/* ========================= */}
      {/* 2. MEDIA */}
      {/* ========================= */}
      <section className="space-y-4">

        <h2 className="text-lg font-semibold">Project Media</h2>

        <div className="grid gap-6">

          {/* COVER */}
          <fieldset className="fieldset space-y-2">
            <legend className="fieldset-legend">Cover Image</legend>

            {!images.cover ? (
              <label className="border border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-base-200 transition">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    setImages((prev) => ({
                      ...prev,
                      cover: {
                        file,
                        preview: URL.createObjectURL(file),
                        type: "cover",
                      },
                    }))
                  }}
                />

                <p className="font-medium">Upload cover image</p>
                <p className="text-sm opacity-60">Recommended: 16:9 ratio</p>
              </label>
            ) : (
              <div className="relative">
                <img
                  src={images.cover.preview}
                  className="w-full h-56 object-cover rounded-lg"
                />

                <button
                  className="btn btn-sm btn-error absolute top-2 right-2"
                  onClick={() =>
                    setImages((prev) => ({ ...prev, cover: null }))
                  }
                >
                  Remove
                </button>
              </div>
            )}
          </fieldset>

          {/* SCREENSHOTS */}
          <fieldset className="fieldset space-y-2">
            <legend className="fieldset-legend">Screenshots</legend>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

              {images.screenshots.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img.preview}
                    className="w-full h-28 object-cover rounded"
                  />

                  <button
                    className="btn btn-xs btn-error absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                    onClick={() =>
                      setImages((prev) => ({
                        ...prev,
                        screenshots: prev.screenshots.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}

              <label className="border border-dashed rounded flex items-center justify-center h-28 cursor-pointer hover:bg-base-200">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])

                    const newImgs = files.map((file) => ({
                      file,
                      preview: URL.createObjectURL(file),
                      type: "screenshot" as const,
                    }))

                    setImages((prev) => ({
                      ...prev,
                      screenshots: [...prev.screenshots, ...newImgs],
                    }))
                  }}
                />

                <PlusIcon className="w-6 h-6 opacity-60" />
              </label>

            </div>
          </fieldset>

        </div>
      </section>

      {/* ========================= */}
      {/* 3. TECH STACK */}
      {/* ========================= */}
      <section className="space-y-4">

        <h2 className="text-lg font-semibold">Tech Stack</h2>

        <div className="flex flex-wrap gap-2">
          {selectedTech.map((t) => (
            <div key={t.id} className="badge badge-primary gap-2">
              {t.name}
              <button onClick={() => removeTech(t.id)}>
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <input
          className="input input-bordered w-full"
          placeholder="Search technologies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <div className="border rounded-lg p-2 space-y-1">
            {filteredTech.map((t) => (
              <button
                key={t.id}
                className="w-full text-left p-2 hover:bg-base-200 rounded"
                onClick={() => addTech(t)}
              >
                {t.name}
                <span className="text-xs opacity-50 ml-2">{t.category}</span>
              </button>
            ))}
          </div>
        )}

      </section>

      {/* SUBMIT */}
      <button
        className="btn btn-primary w-full"
        onClick={createProject}
      >
        Create Project
      </button>

    </div>
  )
}