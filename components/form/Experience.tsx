"use client"

import { useState, useRef } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { addExperienceClient, updateExperienceClient, deleteExperienceClient } from "@/lib/api/client/experience"
import { formatDate } from "@/functions/formatDate"
import { useToast } from "../toast/useToast";
import { withRequest } from "@/functions/withRequest";
import type { Experience, ExperienceForm } from "@/types/types"
import Modal from "../modal/Modal"

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
    startDate: "",
    endDate: "",
    description: "",
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

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
    if (!newExp.title.trim() || !newExp.company.trim()) return

    const payload = {
      ...newExp,
      startDate: formatDate(newExp.startDate),
      endDate: newExp.endDate
        ? formatDate(newExp.endDate)
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
      startDate: "",
      endDate: "",
      description: "",
    })
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

                  <input type="date" className="input input-bordered w-full" value={formatDate(exp.endDate)}
                    onChange={(e) =>
                      handleUpdate(exp.id, "endDate", e.target.value)
                    }
                  />
                </div>

                <textarea placeholder="Describe your responsibilities, impact, and technologies..."
                  className="textarea textarea-bordered w-full min-h-[100px]"
                  value={exp.description}
                  onChange={(e) =>
                    handleUpdate(exp.id, "description", e.target.value)
                  }
                />

                {!exp.endDate && (
                  <div className="text-xs text-success">
                    Current role
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h3 className="font-semibold text-base">
              Add Experience
            </h3>

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
              </fieldset>
              
              <fieldset className="fieldset relative w-full">
                <label className="label">End date</label>
                <input type="date" className="input input-bordered w-full" value={newExp.endDate}
                  onChange={(e) =>
                    setNewExp((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </fieldset>
            </div>
            
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
            </fieldset>
            

            <div className="flex justify-end">
              <button className="btn btn-primary"
                onClick={handleAdd}
                disabled={
                  !newExp.title.trim() || !newExp.company.trim()
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