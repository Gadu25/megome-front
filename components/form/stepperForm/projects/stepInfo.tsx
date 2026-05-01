import { ProjectForm } from "@/types/types"
import React from "react"

type Props = {
  form: ProjectForm
  setForm: React.Dispatch<React.SetStateAction<ProjectForm>>
  setIsDirty: React.Dispatch<React.SetStateAction<Boolean>>
}

export default function StepInfo({ form, setForm, setIsDirty }: Props) {
  return (
    <div className="space-y-2">
      <fieldset className="fieldset relative">
        <label className="label"><span className="text-error">*</span>Title</label>
        <input type="text" placeholder="Project Title" className="input input-bordered w-full" value={form.title}
          onChange={(e) =>
            setForm(prev => {
              setIsDirty(true)
              return { ...prev, title: e.target.value }
            })
          }
        />
      </fieldset>
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