"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { getEducationClient, updateEducationClient } from "@/lib/api/client/education"
import { formatDate } from "@/utils/date/formatDate"
import { useToast } from "@/components/ui/toast/useToast"
import { withRequest } from "@/utils/api/withRequest"
import { educationSchema } from "@/features/profile/schema"
import type { Education } from "@/types/domain"
import type { EducationForm } from "@/types/form"

function Skeleton() {
  return (
    <div className="max-w-3xl mx-auto pb-8 space-y-6">
      <div className="skeleton h-5 w-32 rounded" />
      <div className="space-y-4">
        <div className="skeleton h-10 w-full rounded-md" />
        <div className="grid md:grid-cols-2 gap-3">
          <div className="skeleton h-10 w-full rounded-md" />
          <div className="skeleton h-10 w-full rounded-md" />
        </div>
        <div className="skeleton h-28 w-full rounded-md" />
      </div>
    </div>
  )
}

export default function EditEducationPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const { showToast } = useToast()

  const [education, setEducation] = useState<Education | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<EducationForm>({
    school: "",
    description: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isPresent: false,
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await getEducationClient()
        const found = res.educations?.find((e) => e.id === id) ?? null
        if (found) {
          setEducation(found)
          setForm({
            school: found.school,
            description: found.description,
            degree: found.degree,
            fieldOfStudy: found.fieldOfStudy,
            startDate: formatDate(found.startDate),
            endDate: formatDate(found.endDate),
            isPresent: found.isPresent,
          })
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error("Failed to fetch education:", err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchEducation()
  }, [id])

  const handleSave = async () => {
    setErrors({})

    const result = educationSchema.safeParse(form)
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
        () => updateEducationClient(id, payload as EducationForm),
        showToast
      )

      if (!data) return
      router.push(`/education/${id}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Skeleton />

  if (notFound || !education) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-base-content/60">
        Education not found
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-8 space-y-6">
      <div>
        <Link
          href={`/education/${id}`}
          className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Finish Edit
        </Link>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6 space-y-6">
          <h2 className="text-xl font-bold">Edit Education</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="label">
                <span className="text-error">*</span> School / Institute
              </label>
              <input
                type="text"
                placeholder="School"
                className="input input-bordered w-full"
                value={form.school}
                onChange={(e) => setForm(prev => ({ ...prev, school: e.target.value }))}
              />
              {errors.school && (
                <span className="text-error text-sm">{errors.school}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="text-error">*</span> Degree
              </label>
              <input
                type="text"
                placeholder="Degree"
                className="input input-bordered w-full"
                value={form.degree}
                onChange={(e) => setForm(prev => ({ ...prev, degree: e.target.value }))}
              />
              {errors.degree && (
                <span className="text-error text-sm">{errors.degree}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="text-error">*</span> Field of Study
              </label>
              <input
                type="text"
                placeholder="Field of Study"
                className="input input-bordered w-full"
                value={form.fieldOfStudy}
                onChange={(e) => setForm(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
              />
              {errors.fieldOfStudy && (
                <span className="text-error text-sm">{errors.fieldOfStudy}</span>
              )}
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
              <label className="label">Currently studying here?</label>
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
              <textarea
                placeholder="Describe your studies, achievements, activities, and relevant coursework..."
                className="textarea textarea-bordered w-full min-h-[120px]"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              />
              {errors.description && (
                <span className="text-error text-sm">{errors.description}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Link href={`/education/${id}`} className="btn btn-ghost">
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
