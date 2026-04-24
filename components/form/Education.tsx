"use client"

import { useState, useRef } from "react"
import { Education, EducationForm } from "@/types/types"
import { educationApi } from "@/lib/api/educationApi"
import Modal from "../modal/Modal"
import { XMarkIcon } from "@heroicons/react/24/outline"

type Props = {
  initialEducation: Education[]
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>
}

export default function ProfileEducationForm({
  initialEducation,
  setEducation,
}: Props) {
  const { addEducation, updateEducation, deleteEducation } = educationApi()

  const debounceRef = useRef<Record<number, NodeJS.Timeout>>({})

  const formatDate = (value: string) => value?.split("T")[0] || "";

  const [newEducation, setNewEducation] = useState<EducationForm>({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // UPDATE
  const handleUpdate = (
    id: number,
    field: keyof Education,
    value: Education[keyof Education]
  ) => {
    let updatedItem: Education | undefined

    setEducation((prev) =>
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
          startDate: formatDate(updatedItem.startDate),
          endDate: formatDate(updatedItem.endDate),
        };
        const res = await updateEducation(id, payload)
        setEducation(res.data.education)
      } catch (err) {
        console.error("Failed to update education", err)
      }
    }, 500)
  }

  // ADD
  const handleAdd = async () => {
    if (!newEducation.school.trim()) return

    const payload = {
      ...newEducation,
      startDate: formatDate(newEducation.startDate),
      endDate: formatDate(newEducation.endDate),
    }

    const res = await addEducation(payload)
    setEducation(res.data.education)

    setNewEducation({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    })
  }

  // DELETE
  const handleDelete = async () => {
    if (selectedId === null) return

    const res = await deleteEducation(selectedId)
    setSelectedId(null)
    setEducation(res.data.education)
  }

  return (
    <>
      <div className="space-y-6">
        {/* LIST */}
        <div className="space-y-4">
          {initialEducation.map((edu) => (
            <div key={edu.id} className="space-y-2 border p-4 rounded-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="School"
                  className="input input-bordered w-full"
                  value={edu.school}
                  onChange={(e) =>
                    handleUpdate(edu.id, "school", e.target.value)
                  }
                />

                <button
                  className="btn btn-error btn-sm"
                  onClick={() => {
                    setSelectedId(edu.id)
                    setModalOpen(true)
                  }}
                >
                  <XMarkIcon className="size-4" />
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Degree"
                  className="input input-bordered w-full"
                  value={edu.degree}
                  onChange={(e) =>
                    handleUpdate(edu.id, "degree", e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Field of Study"
                  className="input input-bordered w-full"
                  value={edu.fieldOfStudy}
                  onChange={(e) =>
                    handleUpdate(edu.id, "fieldOfStudy", e.target.value)
                  }
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={edu.startDate?.split("T")[0]}
                  onChange={(e) =>
                    handleUpdate(edu.id, "startDate", e.target.value)
                  }
                />

                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={edu.endDate?.split("T")[0]}
                  onChange={(e) =>
                    handleUpdate(edu.id, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* ADD */}
        <div className="border-t pt-4 space-y-3">
          <h3 className="text-sm font-medium opacity-70">Add Education</h3>

          <input
            type="text"
            placeholder="School"
            className="input input-bordered w-full"
            value={newEducation.school}
            onChange={(e) =>
              setNewEducation((prev) => ({
                ...prev,
                school: e.target.value,
              }))
            }
          />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Degree"
              className="input input-bordered w-full"
              value={newEducation.degree}
              onChange={(e) =>
                setNewEducation((prev) => ({
                  ...prev,
                  degree: e.target.value,
                }))
              }
            />

            <input
              type="text"
              placeholder="Field of Study"
              className="input input-bordered w-full"
              value={newEducation.fieldOfStudy}
              onChange={(e) =>
                setNewEducation((prev) => ({
                  ...prev,
                  fieldOfStudy: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex gap-2">
            <input
              type="date"
              className="input input-bordered w-full"
              value={newEducation.startDate}
              onChange={(e) =>
                setNewEducation((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
            />

            <input
              type="date"
              className="input input-bordered w-full"
              value={newEducation.endDate}
              onChange={(e) =>
                setNewEducation((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
            />
          </div>

          <button className="btn btn-primary w-full" onClick={handleAdd}>
            Add Education
          </button>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete Education"
        onAccept={handleDelete}
        onCancel={() => setModalOpen(false)}
        acceptText="Delete"
      >
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  )
}