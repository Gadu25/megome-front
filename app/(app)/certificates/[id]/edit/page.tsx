"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { getCertificateClient, updateCertificateClient } from "@/lib/api/client/certificate"
import { formatDate } from "@/utils/date/formatDate"
import { useToast } from "@/components/ui/toast/useToast"
import { withRequest } from "@/utils/api/withRequest"
import { certificateSchema } from "@/features/profile/schema"
import type { Certificate } from "@/types/domain"
import type { CertificateForm } from "@/types/form"

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
      </div>
    </div>
  )
}

export default function EditCertificatePage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const { showToast } = useToast()

  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<CertificateForm>({
    title: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    credentialUrl: "",
    certificateImage: null,
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await getCertificateClient()
        const found = res.certificates?.find((c) => c.id === id) ?? null
        if (found) {
          setCertificate(found)
          setForm({
            title: found.title,
            issuer: found.issuer,
            issueDate: formatDate(found.issueDate),
            expirationDate: formatDate(found.expirationDate),
            credentialId: found.credentialId || "",
            credentialUrl: found.credentialUrl || "",
            certificateImage: null,
          })
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error("Failed to fetch certificate:", err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCertificate()
  }, [id])

  const handleSave = async () => {
    setErrors({})

    const result = certificateSchema.safeParse(form)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...result.data,
        issueDate: formatDate(result.data.issueDate),
        expirationDate: result.data.expirationDate
          ? formatDate(result.data.expirationDate)
          : null,
        credentialId: result.data.credentialId || null,
        credentialUrl: result.data.credentialUrl || null,
      }

      const data = await withRequest(
        () => updateCertificateClient(id, payload as CertificateForm),
        showToast
      )

      if (!data) return
      router.push(`/certificates/${id}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Skeleton />

  if (notFound || !certificate) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-base-content/60">
        Certificate not found
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-8 space-y-6">
      <div>
        <Link
          href={`/certificates/${id}`}
          className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Finish Edit
        </Link>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6 space-y-6">
          <h2 className="text-xl font-bold">Edit Certificate</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="label">
                <span className="text-error">*</span> Title
              </label>
              <input
                type="text"
                placeholder="Certificate Title"
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
                <span className="text-error">*</span> Issuer
              </label>
              <input
                type="text"
                placeholder="Issuer (e.g. Google, AWS)"
                className="input input-bordered w-full"
                value={form.issuer}
                onChange={(e) => setForm(prev => ({ ...prev, issuer: e.target.value }))}
              />
              {errors.issuer && (
                <span className="text-error text-sm">{errors.issuer}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="label">Certificate Image</label>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-xl bg-base-100 border-2 border-base-300 overflow-hidden flex items-center justify-center shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Certificate preview" className="w-full h-full object-contain p-1" />
                  ) : certificate.certificateImage ? (
                    <img src={certificate.certificateImage} alt="Certificate" className="w-full h-full object-contain p-1" />
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
                    setForm(prev => ({ ...prev, certificateImage: file }))
                    if (file) {
                      setImagePreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="label">
                  <span className="text-error">*</span> Issue Date
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={form.issueDate}
                  onChange={(e) => setForm(prev => ({ ...prev, issueDate: e.target.value }))}
                />
                {errors.issueDate && (
                  <span className="text-error text-sm">{errors.issueDate}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="label">Expiration Date</label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={form.expirationDate}
                  onChange={(e) => setForm(prev => ({ ...prev, expirationDate: e.target.value }))}
                />
                {errors.expirationDate && (
                  <span className="text-error text-sm">{errors.expirationDate}</span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="label">Credential ID</label>
                <input
                  type="text"
                  placeholder="Credential ID"
                  className="input input-bordered w-full"
                  value={form.credentialId}
                  onChange={(e) => setForm(prev => ({ ...prev, credentialId: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="label">Credential URL</label>
                <input
                  type="text"
                  placeholder="Credential URL"
                  className="input input-bordered w-full"
                  value={form.credentialUrl}
                  onChange={(e) => setForm(prev => ({ ...prev, credentialUrl: e.target.value }))}
                />
                {errors.credentialUrl && (
                  <span className="text-error text-sm">{errors.credentialUrl}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Link href={`/certificates/${id}`} className="btn btn-ghost">
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
