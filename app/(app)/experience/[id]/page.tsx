"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { BriefcaseIcon, ArrowLeftIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
import { getExperienceClient } from "@/lib/api/client/experience"
import { humanizeDate } from "@/utils/date/humanizeDate"
import ExperienceDeleteButton from "@/features/experience/components/DeleteButton"
import type { Experience } from "@/types/domain"

function Skeleton() {
  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-10">
      <div className="skeleton h-5 w-32 rounded" />
      <header className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="skeleton size-14 rounded-xl shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="skeleton h-8 w-64" />
            <div className="skeleton h-5 w-48" />
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
        <aside className="space-y-6">
          <div className="space-y-2">
            <div className="skeleton h-4 w-24" />
            <div className="flex gap-2">
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-3 w-36" />
            <div className="skeleton h-3 w-40" />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default function ExperienceDetailPage() {
  const params = useParams()
  const id = Number(params.id)

  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await getExperienceClient()
        const found = res.experiences?.find((e) => e.id === id) ?? null
        if (found) setExperience(found)
        else setNotFound(true)
      } catch (err) {
        console.error("Failed to fetch experience:", err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchExperience()
  }, [id])

  if (loading) return <Skeleton />

  if (notFound || !experience) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-base-content/60">
        Experience not found
      </div>
    )
  }

  const techs = experience.technologies ?? []

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
            <div className="p-3 rounded-xl bg-primary/10 shrink-0 overflow-hidden flex items-center justify-center">
              {experience.logo ? (
                <img
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  className="size-8 object-contain"
                />
              ) : (
                <BriefcaseIcon className="size-8 text-primary" />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                {experience.title || "Untitled Role"}
              </h1>

              <p className="flex items-center gap-2 text-base text-base-content/70 mt-1">
                {experience.company || "Unknown Company"}
              </p>

              <p className="text-sm text-base-content/50 mt-1">
                {humanizeDate(experience.startDate)} —{" "}
                {experience.endDate
                  ? humanizeDate(experience.endDate)
                  : "Present"}
              </p>
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Experience actions"
            >
              <EllipsisVerticalIcon className="size-5" />
            </button>

            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
            >
              <li>
                <Link href={`/experience/${id}/edit`}>
                  <PencilIcon className="size-4" />
                  Edit Experience
                </Link>
              </li>

              <li className="mt-1 border-t border-base-200 pt-1">
                <ExperienceDeleteButton experienceId={id} experienceTitle={experience.title}>
                  <div className="flex justify-start gap-2 w-full items-center text-error">
                    <TrashIcon className="size-4" />
                    Delete Experience
                  </div>
                </ExperienceDeleteButton>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {experience.description && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Overview</h2>
              <div
                className="prose-sm text-sm leading-7 text-base-content/80
                  [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                  [&_p]:mb-2 [&_p:empty]:hidden
                  [&_strong]:font-semibold [&_em]:italic
                  [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2
                  [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                  [&_li]:mb-1
                  [&_blockquote]:border-l-4 [&_blockquote]:border-base-300
                  [&_blockquote]:pl-4 [&_blockquote]:italic
                  [&_blockquote]:text-base-content/60
                  [&_code]:bg-base-200 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
                  [&_pre]:bg-base-200 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
                  [&_pre_code]:bg-transparent [&_pre_code]:p-0"
                dangerouslySetInnerHTML={{ __html: experience.description }}
              />
            </section>
          )}
        </div>

        <aside className="space-y-8">
          {techs.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-base-content/70">
                Technologies
              </h3>

              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <span key={tech.id} className="badge badge-outline">
                    {tech.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-2 text-sm text-base-content/60">
            <h3 className="font-semibold text-base-content/70">Metadata</h3>

            <div className="space-y-1">
              <p>Created: {humanizeDate(experience.createdAt)}</p>

              {humanizeDate(experience.createdAt) !== humanizeDate(experience.updatedAt) && (
                <p>Last Updated: {humanizeDate(experience.updatedAt)}</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
