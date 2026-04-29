"use client"

import { useState, useRef } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { certificateApi } from "@/lib/api/certificateApi"
import { formatDate } from "@/functions/formatDate"
import type { Certificate, CertificateForm } from "@/types/types"
import Modal from "../modal/Modal"


type Props = {
  initialCertificates: Certificate[]
  setCertificates: React.Dispatch<React.SetStateAction<Certificate[]>>
}

export default function ProfileCertificateForm({ initialCertificates, setCertificates }: Props) {
  const { addCertificate, updateCertificate, deleteCertificate } = certificateApi()

  const debounceRef = useRef<Record<number, NodeJS.Timeout>>({})

  const [newCert, setNewCert] = useState<CertificateForm>({
    title: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    credentialUrl: "",
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleUpdate = (id: number, field: keyof Certificate, value: Certificate[keyof Certificate]) => {
    let updatedItem: Certificate | undefined

    setCertificates((prev) =>
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
        const payload = {
          ...updatedItem,
          issueDate: formatDate(updatedItem.issueDate),
          expirationDate: updatedItem.expirationDate
            ? formatDate(updatedItem.expirationDate)
            : null,
        }

        const res = await updateCertificate(id, payload as CertificateForm)
        setCertificates(res.data.certificates)
      } catch (err) {
        console.error("Failed to update certificate", err)
      }
    }, 500)
  }

  const handleAdd = async () => {
    if (!newCert.title.trim() || !newCert.issuer.trim() || !newCert.issueDate) {
      return
    }

    const payload = {
      ...newCert,
      issueDate: formatDate(newCert.issueDate),
      expirationDate: newCert.expirationDate ? formatDate(newCert.expirationDate) : null,
      credentialId: newCert.credentialId || null,
      credentialUrl: newCert.credentialUrl || null,
    }

    const res = await addCertificate(payload as CertificateForm)
    setCertificates(res.data.certificates)

    setNewCert({
      title: "",
      issuer: "",
      issueDate: "",
      expirationDate: "",
      credentialId: "",
      credentialUrl: "",
    })
  }

  const handleDelete = async () => {
    if (selectedId === null) return

    const res = await deleteCertificate(selectedId)
    setSelectedId(null)
    setCertificates(res.data.certificates)
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
              </fieldset>
              
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={handleAdd}
                disabled={
                  !newCert.title.trim() ||
                  !newCert.issuer.trim() ||
                  !newCert.issueDate
                }
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