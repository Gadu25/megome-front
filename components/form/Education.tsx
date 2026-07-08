"use client"

import { useState, useRef } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { addEducationClient, updateEducationClient, deleteEducationClient } from "@/lib/api/client/education"
import { formatDate } from "@/functions/formatDate"
import { useToast } from "../toast/useToast";
import { withRequest } from "@/functions/withRequest";
import type { Education, EducationForm } from "@/types/types"
import Modal from "../modal/Modal"
import { educationSchema } from "@/features/profile/schema"

type Props = {
  initialEducation: Education[]
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>
}

export default function ProfileEducationForm({ initialEducation, setEducation }: Props) {
  const { showToast } = useToast();

  const debounceRef = useRef<Record<number, NodeJS.Timeout>>({})

  const [newEducation, setNewEducation] = useState<EducationForm>({
    school: "",
    description: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isPresent: false,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [addLoading, setAddLoading] = useState(false);

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
          () => updateEducationClient(id, payload),
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
    setErrors({});
    setAddLoading(true);

    try {
      const result = educationSchema.safeParse(newEducation);
      
      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        return;
      }
      
      const payload = {
        ...result.data,
        startDate: formatDate(result.data.startDate),
        endDate: result.data.endDate
          ? formatDate(result.data.endDate)
          : null,
      }

      const data = await withRequest(
        () => addEducationClient(payload as EducationForm),
        showToast
      )
      
      if (!data) return;
  
      setEducation((prev) => [...prev, data.education]);

      setNewEducation({
        school: "",
        description: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        isPresent: false,
      })
    } finally {
      setAddLoading(false)
    }
  }

  const handleDelete = async () => {
    if (selectedId === null) return

    const data = await withRequest(
      () => deleteEducationClient(selectedId),
      showToast
    )

    if (!data) return;

    setSelectedId(null)
    setEducation((prev) =>
      prev.filter((item) => item.id !== selectedId)
    );
  }

  function LoadingEducation() {
    return (
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-4 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start gap-2">
            <div className="skeleton h-10 flex-1 rounded-md" />

            <div className="skeleton h-8 w-8 rounded-md shrink-0" />
          </div>

          {/* Degree + Field */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="skeleton h-10 w-full rounded-md" />
            <div className="skeleton h-10 w-full rounded-md" />
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="skeleton h-10 w-full rounded-md" />
            <div className="skeleton h-10 w-full rounded-md" />
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between gap-2">
            <div className="skeleton h-4 w-44 rounded" />
            <div className="skeleton h-6 w-12 rounded-full" />
          </div>
        </div>
      </div>
    )
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

                <textarea
                  placeholder="Describe your studies, achievements, activities, and relevant coursework..."
                  className="textarea textarea-bordered w-full min-h-[100px]"
                  value={edu.description}
                  onChange={(e) =>
                    handleUpdate(edu.id, "description", e.target.value)
                  }
                />

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
                    disabled={edu.isPresent}
                    onChange={(e) =>
                      handleUpdate(edu.id, "endDate", e.target.value)
                    }
                  />
                </div>

                <fieldset className="fieldset relative w-full flex gap-2">
                  <label className="label">Currently studying here?</label>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={edu.isPresent}
                    onChange={(e) => {
                      handleUpdate(edu.id, "isPresent", e.target.checked)

                      if (e.target.checked) {
                        handleUpdate(edu.id, "endDate", "")
                      }
                    }}
                  />
                </fieldset>
              </div>
            </div>
          ))}
          {addLoading ? <LoadingEducation/> : null}
        </div>

        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h3 className="font-semibold text-base">Add Education</h3>
            <div className="space-y-6">

              <fieldset className="fieldset relative w-full">
                <label className="label"><span className="text-error">*</span>School/ Institute</label>
                <input type="text" placeholder="School" className="input input-bordered w-full" value={newEducation.school}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      school: e.target.value,
                    }))
                  }
                />
                {errors.school && (
                  <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.school }</span>
                )}
              </fieldset>

              <fieldset className="fieldset relative">
                <legend className="label">Description</legend>
                <textarea
                  placeholder="Describe your studies, achievements, activities, and relevant coursework..."
                  className="textarea textarea-bordered w-full min-h-[100px]"
                  value={newEducation.description}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                {errors.description && (
                  <span className="text-error text-sm absolute bottom-[-1rem] left-0">
                    {errors.description}
                  </span>
                )}
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
                  {errors.degree && (
                    <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.degree }</span>
                  )}
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
                  {errors.fieldOfStudy && (
                    <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.fieldOfStudy }</span>
                  )}
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
                  {errors.startDate && (
                    <span className="text-error text-sm absolute bottom-[-1rem] left-0">{ errors.startDate }</span>
                  )}
                </fieldset>
                
                <fieldset className="fieldset relative w-full">
                  <label className="label">End date</label>
                  <input type="date" className="input input-bordered w-full" value={newEducation.endDate}
                    disabled={newEducation.isPresent}
                    onChange={(e) =>
                      setNewEducation((prev) => ({
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
                  checked={newEducation.isPresent}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      isPresent: e.target.checked,
                      endDate: e.target.checked ? "" : prev.endDate,
                    }))
                  }
                />
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