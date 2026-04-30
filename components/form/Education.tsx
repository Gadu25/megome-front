"use client"

import { useState, useRef } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { educationApi } from "@/lib/api/educationApi"
import { formatDate } from "@/functions/formatDate"
import { useToast } from "../toast/useToast";
import { withRequest } from "@/functions/withRequest";
import type { Education, EducationForm } from "@/types/types"
import Modal from "../modal/Modal"

type Props = {
  initialEducation: Education[]
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>
}

export default function ProfileEducationForm({ initialEducation, setEducation }: Props) {
  const { addEducation, updateEducation, deleteEducation } = educationApi()
  const { showToast } = useToast();

  const debounceRef = useRef<Record<number, NodeJS.Timeout>>({})

  const [newEducation, setNewEducation] = useState<EducationForm>({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleUpdate = (id: number, field: keyof Education, value: Education[keyof Education]) => {
    let updatedItem: Education | undefined
    let previousItem: Education | undefined

    setEducation((prev) =>
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
          startDate: formatDate(updatedItem.startDate),
          endDate: formatDate(updatedItem.endDate),
        };

        const data = await withRequest(
          () => updateEducation(id, payload),
          showToast
        )

        if (!data) return;
        
        setEducation((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...data.education } : item
          )
        );
      } catch (err) {
        console.error("Failed to update education", err)
        if (previousItem) {
          setEducation((prev) => 
            prev.map((item) => 
              item.id === id ? previousItem! : item
            )
          )
        }
      }
    }, 500)
  }

  const handleAdd = async () => {
    if (!newEducation.school.trim()) return

    const payload = {
      ...newEducation,
      startDate: formatDate(newEducation.startDate),
      endDate: formatDate(newEducation.endDate),
    }

    const data = await withRequest(
      () => addEducation(payload),
      showToast
    )

    if (!data) return;

    setEducation((prev) => [...prev, data.education]);

    setNewEducation({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    })
  }

  const handleDelete = async () => {
    if (selectedId === null) return

    const data = await withRequest(
      () => deleteEducation(selectedId),
      showToast
    )

    if (!data) return;

    setSelectedId(null)
    setEducation((prev) =>
      prev.filter((item) => item.id !== selectedId)
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          {initialEducation.length === 0 && (
            <div className="text-center text-sm opacity-60 py-10">
              No education added yet
            </div>
          )}

          {initialEducation.map((edu) => (
            <div key={edu.id} className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition">
              <div className="card-body p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <input type="text" placeholder="School" className="input input-ghost text-lg font-semibold w-full focus:input-bordered" value={edu.school}
                    onChange={(e) =>
                      handleUpdate(edu.id, "school", e.target.value)
                    }
                  />

                  <button className="btn btn-ghost btn-sm text-error"
                    onClick={() => {
                      setSelectedId(edu.id)
                      setModalOpen(true)
                    }}
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Degree" className="input input-bordered w-full" value={edu.degree}
                    onChange={(e) =>
                      handleUpdate(edu.id, "degree", e.target.value)
                    }
                  />

                  <input type="text" placeholder="Field of Study" className="input input-bordered w-full" value={edu.fieldOfStudy}
                    onChange={(e) =>
                      handleUpdate(edu.id, "fieldOfStudy", e.target.value)
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <input type="date" className="input input-bordered w-full" value={formatDate(edu.startDate)}
                    onChange={(e) =>
                      handleUpdate(edu.id, "startDate", e.target.value)
                    }
                  />

                  <input type="date" className="input input-bordered w-full" value={formatDate(edu.endDate)}
                    onChange={(e) =>
                      handleUpdate(edu.id, "endDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h3 className="font-semibold text-base">Add Education</h3>

            <fieldset className="fieldset relative w-full">
              <label className="label"><span className="text-error">*</span>School</label>
              <input type="text" placeholder="School" className="input input-bordered w-full" value={newEducation.school}
                onChange={(e) =>
                  setNewEducation((prev) => ({
                    ...prev,
                    school: e.target.value,
                  }))
                }
              />
            </fieldset>
            
            <div className="grid md:grid-cols-2 gap-3">
              <fieldset className="fieldset relative w-full">
                <label className="label"><span className="text-error">*</span>Degree</label>
                <input type="text" placeholder="Degree" className="input input-bordered w-full" value={newEducation.degree}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      degree: e.target.value,
                    }))
                  }
                />
              </fieldset>
              
              <fieldset className="fieldset relative w-full">
                <label className="label"><span className="text-error">*</span>Field of Study</label>
                <input type="text" placeholder="Field of Study" className="input input-bordered w-full" value={newEducation.fieldOfStudy}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      fieldOfStudy: e.target.value,
                    }))
                  }
                />
              </fieldset>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <fieldset className="fieldset relative w-full">
                <label className="label"><span className="text-error">*</span>Start date</label>
                <input type="date" className="input input-bordered w-full" value={newEducation.startDate}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </fieldset>
              
              <fieldset className="fieldset relative w-full">
                <label className="label">End date</label>
                <input type="date" className="input input-bordered w-full" value={newEducation.endDate}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </fieldset>
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={handleAdd} disabled={!newEducation.school.trim()}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete Education"
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