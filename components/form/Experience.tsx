"use client"

import { useState, useRef } from "react"
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { addExperienceClient, updateExperienceClient, deleteExperienceClient } from "@/lib/api/client/experience"
import { formatDate } from "@/functions/formatDate"
import { useToast } from "../toast/useToast";
import { withRequest } from "@/functions/withRequest";
import type { Experience, ExperienceForm } from "@/types/types"
import Modal from "../modal/Modal"
import { experienceSchema } from "@/features/profile/schema"

type Props = {
  initialExperiences: Experience[]
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>
}

export default function ProfileExperienceForm({ initialExperiences, setExperiences,}: Props) {
  const { showToast } = useToast();

  const debounceRef = useRef<Record<string, NodeJS.Timeout>>({})

  const [newExp, setNewExp] = useState<ExperienceForm>({
    title: "",
    company: "",
    logo: null,
    startDate: "",
    endDate: "",
    isPresent: false,
    description: "",
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [addLoading, setAddLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editLogoPreviews, setEditLogoPreviews] = useState<Record<number, string>>({});

  const handleLogoUpdate = async (id: number, file: File | null) => {
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setEditLogoPreviews((prev) => ({ ...prev, [id]: previewUrl }))

    try {
      const current = initialExperiences.find((e) => e.id === id)
      if (!current) return

      const payload = {
        title: current.title,
        company: current.company,
        startDate: formatDate(current.startDate),
        endDate: current.endDate ? formatDate(current.endDate) : null,
        isPresent: current.isPresent,
        description: current.description,
        logo: file,
      }

      const data = await withRequest(
        () => updateExperienceClient(id, payload as ExperienceForm),
        showToast
      )

      if (!data) return
      setEditLogoPreviews((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      setExperiences((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...data.experience } : item
        )
      )
    } catch (err) {
      console.error("Failed to update logo", err)
    }
  }

  const handleUpdate = ( id: number, field: keyof Experience, value: Experience[keyof Experience]) => {
    let updatedItem: Experience | undefined
    let previousItem: Experience | undefined

    setExperiences((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          previousItem = item
          updatedItem = { ...item, [field]: value }
          return updatedItem
        }
        return item
      })
    )

    const key = `${id}-${field}`

    if (debounceRef.current[key]) {
      clearTimeout(debounceRef.current[key])
    }

    debounceRef.current[key] = setTimeout(async () => {
      if (!updatedItem) return

      try {
        const payload = {
          ...updatedItem,
          startDate: formatDate(updatedItem.startDate),
          endDate: updatedItem.endDate
            ? formatDate(updatedItem.endDate)
            : null,
        }

        const data = await withRequest(
          () => updateExperienceClient(id, payload as ExperienceForm),
          showToast
        )

        if (!data) return;
        setExperiences((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...data.experience } : item
          )
        );
      } catch (err) {
        console.error("Failed to update experience", err)
        if (previousItem) {
          setExperiences((prev) =>
            prev.map((item) =>
              item.id === id ? previousItem! : item
            )
          )
        }
      }
    }, 500)
  }

  const handleAdd = async () => {
    setErrors({});
    setAddLoading(true);

    try {
      const result = experienceSchema.safeParse(newExp);

      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        return
      }

      const payload = {
        ...result.data,
        startDate: formatDate(result.data.startDate),
        endDate: result.data.endDate
          ? formatDate(result.data.endDate)
          : null,
      }
  
      const data = await withRequest(
        () => addExperienceClient(payload as ExperienceForm),
        showToast
      )
  
      if (!data) return;
      setExperiences((prev) => [...prev, data.experience]);
  
      setNewExp({
        title: "",
        company: "",
        logo: null,
        startDate: "",
        endDate: "",
        isPresent: false,
        description: "",
      })
      setLogoPreview(null)
    } catch (err: any) {
      showToast(err.response?.data?.error, "error")
    } finally {
      setAddLoading(false);
    }

  }

  const handleDelete = async () => {
    if (selectedId === null) return

    const data = await withRequest(
      () => deleteExperienceClient(selectedId),
      showToast
    )

    if (!data) return;
    setSelectedId(null)
    setExperiences((prev) =>
      prev.filter((item) => item.id !== selectedId)
    );
  }

  function LoadingExperience() {
    return (
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-4 space-y-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 space-y-2">
              <div className="skeleton h-10 w-full rounded-md" />
              <div className="skeleton h-10 w-full rounded-md" />
            </div>

            <div className="skeleton h-8 w-8 rounded-md shrink-0" />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="skeleton h-10 w-full rounded-md" />
            <div className="skeleton h-10 w-full rounded-md" />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="skeleton h-4 w-40 rounded" />
            <div className="skeleton h-6 w-12 rounded-full" />
          </div>

          <div className="skeleton h-28 w-full rounded-md" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          {initialExperiences.length === 0 && (
            <div className="text-center text-sm opacity-60 py-10">
              No experience added yet
            </div>
          )}

          {initialExperiences.map((exp) => (
            <div key={exp.id} className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition">
              <div className="card-body p-4 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <input type="text" placeholder="Job Title" className="input input-ghost text-lg font-semibold w-full focus:input-bordered" value={exp.title}
                      onChange={(e) =>
                        handleUpdate(exp.id, "title", e.target.value)
                      }
                    />

                    <input type="text" placeholder="Company" className="input input-bordered w-full" value={exp.company}
                      onChange={(e) =>
                        handleUpdate(exp.id, "company", e.target.value)
                      }
                    />

                    <div className="flex items-center gap-4">
                      <div className="size-16 rounded-xl bg-base-100 border-2 border-base-300 overflow-hidden flex items-center justify-center shrink-0">
                        {editLogoPreviews[exp.id] ? (
                          <img src={editLogoPreviews[exp.id]} alt="Logo" className="w-full h-full object-contain p-1" />
                        ) : exp.logo ? (
                          <img src={exp.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                        ) : (
                          <PhotoIcon className="size-6 opacity-40" />
                        )}
                      </div>
                      <input type="file" accept="image/*" className="file-input file-input-sm file-input-bordered w-full"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          if (file) {
                            handleLogoUpdate(exp.id, file)
                          }
                        }}
                      />
                    </div>
                  </div>

                  <button className="btn btn-ghost btn-sm text-error"
                    onClick={() => {
                      setSelectedId(exp.id)
                      setModalOpen(true)
                    }}
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

              <div className="grid md:grid-cols-2 gap-3">
                  <input type="date" className="input input-bordered w-full" value={formatDate(exp.startDate)}
                    onChange={(e) =>
                      handleUpdate(exp.id, "startDate", e.target.value)
                    }
                  />

                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={formatDate(exp.endDate)}
                    disabled={exp.isPresent}
                    onChange={(e) =>
                      handleUpdate(exp.id, "endDate", e.target.value)
                    }
                  />
                </div>

                <fieldset className="fieldset relative w-full flex gap-2">
                  <label className="label">Currently working here?</label>

                  <input
                    type="checkbox"
                    className="toggle"
                    checked={exp.isPresent}
                    onChange={(e) => {
                      handleUpdate(exp.id, "isPresent", e.target.checked)

                      if (e.target.checked) {
                        handleUpdate(exp.id, "endDate", "")
                      }
                    }}
                  />
                </fieldset>

                <textarea placeholder="Describe your responsibilities, impact, and technologies..."
                  className="textarea textarea-bordered w-full min-h-[100px]"
                  value={exp.description}
                  onChange={(e) =>
                    handleUpdate(exp.id, "description", e.target.value)
                  }
                />

                {exp.isPresent && (
                  <div className="text-xs text-success">
                    Current role
                  </div>
                )}
              </div>
            </div>
          ))}
          {addLoading ? <LoadingExperience/> : null}
        </div>

        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h3 className="font-semibold text-base">
              Add Experience
            </h3>
            <div className="space-y-4">
              <fieldset className="fieldset relative w-full">
                <label className="label"><span className="text-error">*</span>Title</label>
                <input type="text" placeholder="Job Title" className="input input-bordered w-full" value={newExp.title}
                  onChange={(e) =>
                    setNewExp((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                {errors.title && (
                  <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.title }</span>
                )}
              </fieldset>
              
              <fieldset className="fieldset relative w-full">
                <label className="label"><span className="text-error">*</span>Company</label>
                <input type="text" placeholder="Company" className="input input-bordered w-full" value={newExp.company}
                  onChange={(e) =>
                    setNewExp((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                />
                {errors.company && (
                  <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.company }</span>
                )}
              </fieldset>

              <fieldset className="fieldset relative">
                <label className="label">Company Logo</label>
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-xl bg-base-100 border-2 border-base-300 overflow-hidden flex items-center justify-center shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <PhotoIcon className="size-6 opacity-40" />
                    )}
                  </div>
                  <input type="file" accept="image/*" className="file-input file-input-sm file-input-bordered w-full"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setNewExp((prev) => ({ ...prev, logo: file }))
                      if (file) {
                        setLogoPreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </div>
              </fieldset>
              
              <div className="grid md:grid-cols-2 gap-3">
                <fieldset className="fieldset relative w-full">
                  <label className="label"><span className="text-error">*</span>Start date</label>
                  <input type="date" className="input input-bordered w-full" value={newExp.startDate}
                    onChange={(e) =>
                      setNewExp((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                  {errors.startDate && (
                    <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.startDate }</span>
                  )}
                </fieldset>
                
                <fieldset className="fieldset relative w-full">
                  <label className="label">End date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={newExp.endDate}
                    disabled={newExp.isPresent}
                    onChange={(e) =>
                      setNewExp((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                  {errors.endDate && (
                    <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.endDate }</span>
                  )}
                </fieldset>
              </div>

              <fieldset className="fieldset relative w-full flex gap-2">
                <label className="label">Currently working here?</label>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={newExp.isPresent}
                  onChange={(e) =>
                    setNewExp((prev) => ({
                      ...prev,
                      isPresent: e.target.checked,
                      endDate: e.target.checked ? "" : prev.endDate,
                    }))
                  }
                />
              </fieldset>
              
              <fieldset className="fieldset relative">
                <legend className="label">Description</legend>
                <textarea
                  placeholder="Describe your responsibilities, impact, and technologies..."
                  className="textarea textarea-bordered w-full min-h-[100px]"
                  value={newExp.description}
                  onChange={(e) =>
                    setNewExp((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                {errors.description && (
                  <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.description }</span>
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
        title="Delete Experience"
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
