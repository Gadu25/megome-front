import { ProjectForm } from "@/types/form"
import React from "react"

const PROJECT_STATUSES = [
  "pending",
  "active",
  "completed",
  "archived",
] as const;

const PROJECT_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    dot: "bg-yellow-400",
  },
  active: {
    label: "Active",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    dot: "bg-green-500",
  },
  archived: {
    label: "Archived",
    dot: "bg-gray-400",
  },
} as const;

type ProjectStatus = keyof typeof PROJECT_STATUS_CONFIG;

type Props = {
  form: ProjectForm
  setForm: React.Dispatch<React.SetStateAction<ProjectForm>>
  setIsDirty: React.Dispatch<React.SetStateAction<Boolean>>
}

export default function StepInfo({ form, setForm, setIsDirty }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid md:grid-cols-4 gap-2">
        {/* Title - spans 3 columns */}
        <fieldset className="fieldset relative md:col-span-3">
          <label className="label">
            <span className="text-error">*</span>Title
          </label>
          <input
            type="text"
            placeholder="Project Title"
            className="input input-bordered w-full"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => {
                setIsDirty(true);
                return { ...prev, title: e.target.value };
              })
            }
          />
        </fieldset>

        {/* Status - 1 column */}
        <fieldset className="fieldset">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${
                PROJECT_STATUS_CONFIG[form.status as ProjectStatus].dot
              }`}
            />
            <label className="label">Status</label>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="select select-bordered w-full"
              value={form.status}
              onChange={(e) =>
                setForm((prev) => {
                  setIsDirty(true);
                  return { ...prev, status: e.target.value as ProjectStatus };
                })
              }
            >
              {Object.entries(PROJECT_STATUS_CONFIG).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
      </div>
      <fieldset className="fieldset relative">
        <legend className="label">Project description</legend>
        <textarea
          placeholder="Project description"
          className="textarea textarea-bordered w-full min-h-[80px]"
          value={form.description}
          onChange={(e)=>
            setForm(prev => {
              setIsDirty(true)
              return { ...prev, description: e.target.value }
            })
          }
        />
      </fieldset>

      <div className="grid md:grid-cols-2 gap-3">
        <fieldset className="fieldset relative">
          <label className="label">Link</label>
          <input type="text" placeholder="Live URL (https://...)" className="input input-bordered w-full"
            value={form.link}
            onChange={(e) =>
              setForm(prev => {
                setIsDirty(true)
                return { ...prev, link: e.target.value }
              })
            }
          />
        </fieldset>
        
        <fieldset className="fieldset relative">
          <label className="label">Github</label>
          <input type="text" placeholder="GitHub URL" className="input input-bordered w-full" value={form.githubLink}
            onChange={(e) =>
              setForm(prev => {
                setIsDirty(true)
                return { ...prev, githubLink: e.target.value }
              })
            }
          />
        </fieldset>
      </div>

    </div>
  )
}
