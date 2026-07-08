"use client"

import { useState, useRef } from "react"
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { addCertificateClient, updateCertificateClient, deleteCertificateClient } from "@/lib/api/client/certificate"
import { formatDate } from "@/functions/formatDate"
import { certificateSchema } from "@/features/profile/schema";
import { withRequest } from "@/functions/withRequest"
import { useToast } from "../toast/useToast";
import type { Certificate, CertificateForm } from "@/types/types"
import Modal from "../modal/Modal"


type Props = {
  initialCertificates: Certificate[]
  setCertificates: React.Dispatch<React.SetStateAction<Certificate[]>>
}

export default function ProfileCertificateForm({ initialCertificates, setCertificates }: Props) {
  const { showToast } = useToast();

  const debounceRef = useRef<Record<number, NodeJS.Timeout>>({})

  const [newCert, setNewCert] = useState<CertificateForm>({
    title: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    credentialUrl: "",
    certificateImage: null,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [addLoading, setAddLoading] = useState(false);
  const [certImagePreview, setCertImagePreview] = useState<string | null>(null);
  const [editImagePreviews, setEditImagePreviews] = useState<Record<number, string>>({});

  const handleUpdate = (id: number, field: keyof Certificate, value: Certificate[keyof Certificate]) => {
    let updatedItem: Certificate | undefined
    let previousItem: Certificate | undefined
    
    setCertificates((prev) =>
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
        const payload = {
          ...updatedItem,
          issueDate: formatDate(updatedItem.issueDate),
          expirationDate: updatedItem.expirationDate
            ? formatDate(updatedItem.expirationDate)
            : null,
        }

        const data = await withRequest(
          () => updateCertificateClient(id, payload as CertificateForm),
          showToast
        )

        if (!data) return;

        setCertificates((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...data.certificate } : item
          )
        );
      } catch (err) {
        console.error("Failed to update certificate", err)
        if (previousItem) {
          setCertificates((prev) =>
            prev.map((item) =>
              item.id === id ? previousItem! : item
            )
          )
        }
      }
    }, 500)
  }

  const handleCertificateImageUpdate = async (id: number, file: File | null) => {
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setEditImagePreviews((prev) => ({ ...prev, [id]: previewUrl }))

    try {
      const current = initialCertificates.find((c) => c.id === id)
      if (!current) return

      const payload = {
        title: current.title,
        issuer: current.issuer,
        issueDate: formatDate(current.issueDate),
        expirationDate: current.expirationDate ? formatDate(current.expirationDate) : null,
        credentialId: current.credentialId || null,
        credentialUrl: current.credentialUrl || null,
        certificateImage: file,
      }

      const data = await withRequest(
        () => updateCertificateClient(id, payload as CertificateForm),
        showToast
      )

      if (!data) return
      setEditImagePreviews((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      setCertificates((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...data.certificate } : item
        )
      )
    } catch (err) {
      console.error("Failed to update certificate image", err)
    }
  }

  const handleAdd = async () => {
    setErrors({});
    setAddLoading(true);

    try {
      const result = certificateSchema.safeParse(newCert);

      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      const payload = {
        ...result.data,
        issueDate: formatDate(result.data.issueDate),
        expirationDate: result.data.expirationDate ? formatDate(result.data.expirationDate) : null,
        credentialId: result.data.credentialId || null,
        credentialUrl: result.data.credentialUrl || null,
      }

      const data = await withRequest(
        () => addCertificateClient(payload as CertificateForm),
        showToast
      )

      if (!data) return;

      setCertificates((prev) => [...prev, data.certificate]);

      setNewCert({
        title: "",
        issuer: "",
        issueDate: "",
        expirationDate: "",
        credentialId: "",
        credentialUrl: "",
        certificateImage: null,
      })
      setCertImagePreview(null)

    } finally {
      setAddLoading(false);
    }
  }

  const handleDelete = async () => {
    if (selectedId === null) return

    const data = await withRequest(
      () => deleteCertificateClient(selectedId),
      showToast
    )

    if (!data) return;

    setSelectedId(null)
    setCertificates((prev) =>
      prev.filter((item) => item.id !== selectedId)
    );
  }

  function LoadingCertificate() {
    return (
      <div className="card bg-base-200 border border-base-300">
        <div className="card-body space-y-4">
          {/* Header */}
          <div className="skeleton h-6 w-40 rounded" />

          {/* Title */}
          <div className="space-y-2">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-10 w-full rounded-md" />
          </div>

          {/* Issuer */}
          <div className="space-y-2">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-10 w-full rounded-md" />
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <div className="skeleton h-4 w-28 rounded" />
              <div className="skeleton h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Credential ID + URL */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="skeleton h-4 w-28 rounded" />
              <div className="skeleton h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <div className="skeleton h-4 w-12 rounded" />
              <div className="skeleton h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <div className="skeleton h-10 w-24 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          {initialCertificates.length === 0 && (
            <div className="text-center text-sm opacity-60 py-10">
              No certificates added yet
            </div>
          )}

          {initialCertificates.map((cert) => (
            <div key={cert.id} className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition">
              <div className="card-body p-4 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <input type="text" placeholder="Certificate Title" className="input input-ghost text-lg font-semibold w-full focus:input-bordered" value={cert.title}
                    onChange={(e) =>
                      handleUpdate(cert.id, "title", e.target.value)
                    }
                  />

                  <button className="btn btn-ghost btn-sm text-error"
                    onClick={() => {
                      setSelectedId(cert.id)
                      setModalOpen(true)
                    }}
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

                <fieldset className="fieldset relative w-full">
                  <label className="label"><span className="text-error">*</span>Title</label>
                  <input type="text" placeholder="Certificate Title" className="input input-bordered w-full" value={cert.title}
                    onChange={(e) =>
                      handleUpdate(cert.id, "title", e.target.value)
                    }
                  />
                </fieldset>

                <input type="text" placeholder="Issuer (e.g. Google, AWS)" className="input input-bordered w-full" value={cert.issuer}
                  onChange={(e) =>
                    handleUpdate(cert.id, "issuer", e.target.value)
                  }
                />

                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-xl bg-base-100 border-2 border-base-300 overflow-hidden flex items-center justify-center shrink-0">
                    {editImagePreviews[cert.id] ? (
                      <img src={editImagePreviews[cert.id]} alt="Certificate" className="w-full h-full object-contain p-1" />
                    ) : cert.certificateImage ? (
                      <img src={cert.certificateImage} alt="Certificate" className="w-full h-full object-contain p-1" />
                    ) : (
                      <PhotoIcon className="size-6 opacity-40" />
                    )}
                  </div>
                  <input type="file" accept="image/*" className="file-input file-input-sm file-input-bordered w-full"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (file) {
                        handleCertificateImageUpdate(cert.id, file)
                      }
                    }}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <input type="date" className="input input-bordered w-full" value={ formatDate(cert.issueDate) }
                    onChange={(e) =>
                      handleUpdate(cert.id, "issueDate", e.target.value)
                    }
                  />

                  <input type="date" className="input input-bordered w-full" value={ formatDate(cert.expirationDate) }
                    onChange={(e) =>
                      handleUpdate(cert.id, "expirationDate", e.target.value || null)
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Credential ID" className="input input-bordered w-full" value={cert.credentialId || ""}
                    onChange={(e) =>
                      handleUpdate(cert.id, "credentialId", e.target.value || null)
                    }
                  />

                  <input type="text" placeholder="Credential URL" className="input input-bordered w-full" value={cert.credentialUrl || ""}
                    onChange={(e) =>
                      handleUpdate(cert.id, "credentialUrl", e.target.value || null)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          {addLoading ? <LoadingCertificate/> : null}
        </div>

        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h3 className="font-semibold text-base">Add Certificate</h3>

            <fieldset className="fieldset relative w-full">
              <label className="label"><span className="text-error">*</span>Title</label>
              <input type="text" placeholder="Certificate Title" className="input input-bordered w-full" value={newCert.title}
                onChange={(e) =>
                  setNewCert((prev) => ({
                    ...prev,
                    title: e.target.value
                  }))
                }
              />
              {errors.title && (
                <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.title }</span>
              )}
            </fieldset>

            <fieldset className="fieldset relative w-full">
              <label className="label"><span className="text-error">*</span>Issuer</label>
              <input type="text" placeholder="Issuer" className="input input-bordered w-full" value={newCert.issuer}
                onChange={(e) =>
                  setNewCert((prev) => ({
                    ...prev,
                    issuer: e.target.value
                  }))
                }
              />
              {errors.issuer && (
                <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.issuer }</span>
              )}
            </fieldset>

            <fieldset className="fieldset relative">
              <label className="label">Certificate Image</label>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-xl bg-base-100 border-2 border-base-300 overflow-hidden flex items-center justify-center shrink-0">
                  {certImagePreview ? (
                    <img src={certImagePreview} alt="Certificate preview" className="w-full h-full object-contain p-1" />
                  ) : (
                    <PhotoIcon className="size-6 opacity-40" />
                  )}
                </div>
                <input type="file" accept="image/*" className="file-input file-input-sm file-input-bordered w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setNewCert((prev) => ({ ...prev, certificateImage: file }))
                    if (file) {
                      setCertImagePreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </div>
            </fieldset>

            <div className="grid md:grid-cols-2 gap-3">
              <fieldset className="fieldset relative w-full">
                <label className="label">Issue date</label>
                <input type="date" className="input input-bordered w-full" value={newCert.issueDate}
                  onChange={(e) =>
                    setNewCert((prev) => ({
                      ...prev,
                      issueDate: e.target.value,
                    }))
                  }
                />
                {errors.issueDate && (
                <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.issueDate }</span>
              )}
              </fieldset>
              
              <fieldset className="fieldset relative w-full">
                <label className="label">Expiration date</label>
                <input type="date" className="input input-bordered w-full" value={newCert.expirationDate}
                  onChange={(e) =>
                    setNewCert((prev) => ({
                      ...prev,
                      expirationDate: e.target.value,
                    }))
                  }
                />
                {errors.expirationDate && (
                <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.expirationDate }</span>
              )}
              </fieldset>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <fieldset className="fieldset relative w-full">
                <label className="label">Credential ID</label>
                <input type="text" placeholder="Credential ID" className="input input-bordered w-full" value={newCert.credentialId}
                  onChange={(e) =>
                    setNewCert((prev) => ({
                      ...prev,
                      credentialId: e.target.value,
                    }))
                  }
                />
                {errors.credentialId && (
                  <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.credentialId }</span>
                )}
              </fieldset>
              
              <fieldset className="fieldset relative w-full">
                <label className="label">URL</label>
                <input type="text" placeholder="Credential URL" className="input input-bordered w-full" value={newCert.credentialUrl}
                  onChange={(e) =>
                    setNewCert((prev) => ({
                      ...prev,
                      credentialUrl: e.target.value,
                    }))
                  }
                />
                {errors.credentialUrl && (
                  <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.credentialUrl }</span>
                )}
              </fieldset>
              
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={handleAdd}>
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
        title="Delete Certificate"
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