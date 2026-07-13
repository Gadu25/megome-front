"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeftIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
import { getCertificateClient } from "@/lib/api/client/certificate"
import { humanizeDate } from "@/utils/date/humanizeDate"
import CertificateDeleteButton from "@/features/certificate/components/DeleteButton"
import type { Certificate } from "@/types/domain"

function Skeleton() {
  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-10">
      <div className="skeleton h-5 w-32 rounded" />
      <header className="space-y-4">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-3 w-52" />
      </header>
      <div className="skeleton h-80 w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="skeleton h-5 w-28" />
            <div className="skeleton h-7 w-40 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-5 w-24" />
            <div className="skeleton h-7 w-52 rounded-md" />
          </div>
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

export default function CertificateDetailPage() {
  const params = useParams()
  const id = Number(params.id)

  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await getCertificateClient()
        const found = res.certificates?.find((c) => c.id === id) ?? null
        if (found) setCertificate(found)
        else setNotFound(true)
      } catch (err) {
        console.error("Failed to fetch certificate:", err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCertificate()
  }, [id])

  if (loading) return <Skeleton />

  if (notFound || !certificate) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-base-content/60">
        Certificate not found
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

      <header className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              {certificate.title || "Untitled Certificate"}
            </h1>

            <p className="text-base text-base-content/70">
              {certificate.issuer || "Unknown issuer"}
            </p>

            <p className="text-sm text-base-content/50">
              Issued {humanizeDate(certificate.issueDate)}
              {certificate.expirationDate && (
                <> • Expires {humanizeDate(certificate.expirationDate)}</>
              )}
            </p>
          </div>

          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Certificate actions"
            >
              <EllipsisVerticalIcon className="size-5" />
            </button>

            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
            >
              <li>
                <Link href={`/certificates/${id}/edit`}>
                  <PencilIcon className="size-4" />
                  Edit Certificate
                </Link>
              </li>

              <li className="mt-1 border-t border-base-200 pt-1">
                <CertificateDeleteButton certificateId={id} certificateTitle={certificate.title}>
                  <div className="flex justify-start gap-2 w-full items-center text-error">
                    <TrashIcon className="size-4" />
                    Delete Certificate
                  </div>
                </CertificateDeleteButton>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* CERTIFICATE IMAGE — full-width preview */}
      <div className="rounded-xl overflow-hidden bg-base-200 flex items-center justify-center p-4 sm:p-8">
        {certificate.certificateImage ? (
          <img
            src={certificate.certificateImage}
            alt={certificate.title}
            className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-md"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-sm text-base-content/50">
            No certificate image
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {(certificate.credentialUrl || certificate.credentialId) && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Credential</h2>

              <div className="space-y-3">
                {certificate.credentialUrl && (
                  <div className="space-y-1">
                    <p className="text-sm text-base-content/60">Verify URL</p>
                    <a
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      View Credential
                    </a>
                  </div>
                )}

                {certificate.credentialId && (
                  <div className="space-y-1">
                    <p className="text-sm text-base-content/60">Credential ID</p>
                    <p className="text-sm font-mono bg-base-200 rounded-md px-3 py-2 inline-block">
                      {certificate.credentialId}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <section className="space-y-2 text-sm text-base-content/60">
            <h3 className="font-semibold text-base-content/70">Metadata</h3>

            <div className="space-y-1">
              <p>Created: {humanizeDate(certificate.createdAt)}</p>

              {humanizeDate(certificate.createdAt) !== humanizeDate(certificate.updatedAt) && (
                <p>Last Updated: {humanizeDate(certificate.updatedAt)}</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
