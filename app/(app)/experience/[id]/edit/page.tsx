"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { getExperienceClient, updateExperienceClient } from "@/lib/api/client/experience"
import { getTechnologiesClient, linkExperienceTechnologiesClient } from "@/lib/api/client/technology"
import { formatDate } from "@/utils/date/formatDate"
import { useToast } from "@/components/ui/toast/useToast"
import { withRequest } from "@/utils/api/withRequest"
import RichEditor from "@/components/ui/rich-editor/RichEditor"
import { experienceSchema } from "@/features/profile/schema"
import type { Experience, Technology } from "@/types/domain"
import type { ExperienceForm } from "@/types/form"

function Skeleton() {
  return (
    <div className="max-w-3xl mx-auto pb-8 space-y-6">
      <div className="skeleton h-5 w-32 rounded" />
      <div className="space-y-4">
        <div className="skeleton h-10 w-full rounded-md" />
        <div className="skeleton h-10 w-full rounded-md" />
        <div className="grid md:grid-cols-2 gap-3">
          <div className="skeleton h-10 w-full rounded-md" />
          <div className="skeleton h-10 w-full rounded-md" />
        </div>
        <div className="skeleton h-40 w-full rounded-md" />
      </div>
    </div>
  )
}

export default function EditExperiencePage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const { showToast } = useToast()

  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<ExperienceForm>({
    title: "",
    company: "",
    logo: null,
    startDate: "",
    endDate: "",
    isPresent: false,
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [allTechnologies, setAllTechnologies] = useState<Technology[]>([])
  const [selectedTechs, setSelectedTechs] = useState<Technology[]>([])
  const [techSearch, setTechSearch] = useState("")
  const [techDropdownOpen, setTechDropdownOpen] = useState(false)
  const [techActiveIndex, setTechActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const techsChanged = useRef(false)

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await getExperienceClient()
        const found = res.experiences?.find((e) => e.id === id) ?? null
        if (found) {
          setExperience(found)
          setForm({
            title: found.title,
            company: found.company,
            logo: null,
            startDate: formatDate(found.startDate),
            endDate: formatDate(found.endDate),
            isPresent: found.isPresent,
            description: found.description,
          })
          setSelectedTechs(found.technologies ?? [])
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error("Failed to fetch experience:", err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchExperience()
  }, [id])

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const res = await getTechnologiesClient()
        setAllTechnologies(res?.technologies ?? [])
      } catch (err) {
        console.error("Error fetching technologies:", err)
      }
    }
    fetchTechs()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setTechDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredTechs = allTechnologies
    .filter(t => t.name.toLowerCase().includes(techSearch.toLowerCase()))
    .filter(t => !selectedTechs.some(s => s.id === t.id))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredTechs.length) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setTechDropdownOpen(true)
        setTechActiveIndex(prev => Math.min(prev + 1, filteredTechs.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setTechActiveIndex(prev => Math.max(prev - 1, 0))
        break
      case "Enter":
        e.preventDefault()
        if (filteredTechs[techActiveIndex]) {
          addTech(filteredTechs[techActiveIndex])
        }
        break
      case "Escape":
        setTechDropdownOpen(false)
        break
    }
  }

  const addTech = (tech: Technology) => {
    if (selectedTechs.some(t => t.id === tech.id)) return
    techsChanged.current = true
    setSelectedTechs(prev => [...prev, tech])
    setTechSearch("")
    setTechActiveIndex(0)
    setTechDropdownOpen(false)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const removeTech = (techId: number) => {
    techsChanged.current = true
    setSelectedTechs(prev => prev.filter(t => t.id !== techId))
  }

  const handleSave = async () => {
    setErrors({})

    const plainDesc = (form.description || "").replace(/<[^>]*>/g, "").trim()
    if (plainDesc.length > 1000) {
      setErrors({ description: [`Description must be at most 1000 characters (currently ${plainDesc.length})`] })
      return
    }

    const result = experienceSchema.safeParse(form)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...result.data,
        startDate: formatDate(result.data.startDate),
        endDate: result.data.endDate
          ? formatDate(result.data.endDate)
          : null,
      }

      const data = await withRequest(
        () => updateExperienceClient(id, payload as ExperienceForm),
        showToast
      )

      if (!data) return

      if (techsChanged.current) {
        await withRequest(
          () => linkExperienceTechnologiesClient(id, selectedTechs.map(t => t.id)),
          showToast
        )
      }

      router.push(`/experience/${id}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Skeleton />

  if (notFound || !experience) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-base-content/60">
        Experience not found
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-8 space-y-6">
      <div>
        <Link
          href={`/experience/${id}`}
          className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Finish Edit
        </Link>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6 space-y-6">
          <h2 className="text-xl font-bold">Edit Experience</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="label">
                <span className="text-error">*</span> Job Title
              </label>
              <input
                type="text"
                placeholder="Job Title"
                className="input input-bordered w-full"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              />
              {errors.title && (
                <span className="text-error text-sm">{errors.title}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="text-error">*</span> Company
              </label>
              <input
                type="text"
                placeholder="Company"
                className="input input-bordered w-full"
                value={form.company}
                onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
              />
              {errors.company && (
                <span className="text-error text-sm">{errors.company}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="label">Company Logo</label>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-xl bg-base-100 border-2 border-base-300 overflow-hidden flex items-center justify-center shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-1" />
                  ) : experience.logo ? (
                    <img src={experience.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <PhotoIcon className="size-6 opacity-40" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-sm file-input-bordered w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setForm(prev => ({ ...prev, logo: file }))
                    if (file) {
                      setLogoPreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="label">
                  <span className="text-error">*</span> Start Date
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={form.startDate}
                  onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                />
                {errors.startDate && (
                  <span className="text-error text-sm">{errors.startDate}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="label">End Date</label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={form.endDate}
                  disabled={form.isPresent}
                  onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
                {errors.endDate && (
                  <span className="text-error text-sm">{errors.endDate}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="label">Currently working here?</label>
              <input
                type="checkbox"
                className="toggle"
                checked={form.isPresent}
                onChange={(e) => setForm(prev => ({
                  ...prev,
                  isPresent: e.target.checked,
                  endDate: e.target.checked ? "" : prev.endDate,
                }))}
              />
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="text-error">*</span> Description
              </label>
              <RichEditor
                content={form.description}
                onChange={(html) => {
                  const plainText = html.replace(/<[^>]*>/g, "").trim()
                  if (plainText.length > 1000) return
                  setForm(prev => ({ ...prev, description: html }))
                }}
              />
              {errors.description && (
                <span className="text-error text-sm">{errors.description}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="label">Technologies</label>
              {selectedTechs.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTechs.map(tech => (
                    <div key={tech.id} className="badge badge-primary gap-1 px-3 py-3">
                      <span>{tech.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${tech.name}`}
                        onClick={() => removeTech(tech.id)}
                        className="rounded-full hover:text-red-200 focus:outline-none"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div ref={containerRef} className="relative max-w-md">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search technologies..."
                  className="input input-bordered w-full"
                  autoComplete="off"
                  value={techSearch}
                  onFocus={() => setTechDropdownOpen(true)}
                  onChange={(e) => {
                    setTechSearch(e.target.value)
                    setTechDropdownOpen(true)
                    setTechActiveIndex(0)
                  }}
                  onKeyDown={handleKeyDown}
                />
                {techDropdownOpen && (techSearch.length > 0 || filteredTechs.length > 0) && (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border bg-base-100 shadow-lg">
                    <div className="max-h-64 overflow-y-auto p-1">
                      {filteredTechs.length === 0 && (
                        <div className="px-3 py-2 text-sm opacity-60">No technologies found</div>
                      )}
                      {filteredTechs.map((tech, idx) => {
                        const isActive = idx === techActiveIndex
                        return (
                          <button
                            key={tech.id}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onMouseEnter={() => setTechActiveIndex(idx)}
                            onClick={() => addTech(tech)}
                            className={[
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors",
                              isActive ? "bg-base-200" : "hover:bg-base-200",
                            ].join(" ")}
                          >
                            <span>{tech.name}</span>
                            <span className="text-xs opacity-50">{tech.category}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Link href={`/experience/${id}`} className="btn btn-ghost">
              Cancel
            </Link>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
