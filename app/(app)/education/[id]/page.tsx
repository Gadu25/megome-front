"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AcademicCapIcon, ArrowLeftIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
import { getEducationClient } from "@/lib/api/client/education"
import { humanizeDate } from "@/utils/date/humanizeDate"
import EducationDeleteButton from "@/features/education/components/DeleteButton"
import type { Education } from "@/types/domain"

function Skeleton() {
  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-10">
      <div className="skeleton h-5 w-32 rounded" />
      <header className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="skeleton size-14 rounded-xl shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="skeleton h-8 w-72" />
            <div className="skeleton h-5 w-48" />
            <div className="skeleton h-4 w-56" />
            <div className="skeleton h-3 w-40" />
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          <div className="skeleton h-5 w-24" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-[92%]" />
          <div className="skeleton h-4 w-[70%]" />
        </div>
        <aside className="space-y-3">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-3 w-36" />
          <div className="skeleton h-3 w-40" />
        </aside>
      </div>
    </div>
  )
}

export default function EducationDetailPage() {
  const params = useParams()
  const id = Number(params.id)

  const [education, setEducation] = useState<Education | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await getEducationClient()
        const found = res.educations?.find((e) => e.id === id) ?? null
        if (found) setEducation(found)
        else setNotFound(true)
      } catch (err) {
        console.error("Failed to fetch education:", err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchEducation()
  }, [id])

  if (loading) return <Skeleton />

  if (notFound || !education) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-base-content/60">
        Education not found
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-10">
      <div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Profile
        </Link>
      </div>

      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="p-3 rounded-xl bg-primary/10 shrink-0">
              <AcademicCapIcon className="size-8 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                {education.degree || "Untitled Degree"}
              </h1>

              {education.fieldOfStudy && (
                <p className="text-lg text-base-content/70 mt-1">
                  {education.fieldOfStudy}
                </p>
              )}

              <p className="text-base text-base-content/60 mt-2">{education.school}</p>

              <p className="text-sm text-base-content/50 mt-1">
                {humanizeDate(education.startDate)} —{" "}
                {education.endDate ? humanizeDate(education.endDate) : "Present"}
              </p>
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Education actions"
            >
              <EllipsisVerticalIcon className="size-5" />
            </button>

            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
            >
              <li>
                <Link href={`/education/${id}/edit`}>
                  <PencilIcon className="size-4" />
                  Edit Education
                </Link>
              </li>

              <li className="mt-1 border-t border-base-200 pt-1">
                <EducationDeleteButton educationId={id} educationTitle={education.degree}>
                  <div className="flex justify-start gap-2 w-full items-center text-error">
                    <TrashIcon className="size-4" />
                    Delete Education
                  </div>
                </EducationDeleteButton>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {education.description && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Overview</h2>
              <p className="text-base-content/80 leading-relaxed whitespace-pre-line">
                {education.description}
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <section className="space-y-2 text-sm text-base-content/60">
            <h3 className="font-semibold text-base-content/70">Metadata</h3>

            <div className="space-y-1">
              <p>Created: {humanizeDate(education.createdAt)}</p>

              {humanizeDate(education.createdAt) !== humanizeDate(education.updatedAt) && (
                <p>Last Updated: {humanizeDate(education.updatedAt)}</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
