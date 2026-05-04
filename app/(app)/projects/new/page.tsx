"use client"

import { useState } from "react"
import Stepper, { Step } from "@/components/stepper/Stepper"

import StepInfo from "@/components/form/stepperForm/projects/stepInfo"
import StepImages from "@/components/form/stepperForm/projects/stepImages"
import StepTech from "@/components/form/stepperForm/projects/stepTech"
import StepConfirm from "@/components/form/stepperForm/projects/stepConfirm"
import type { ProjectForm } from "@/types/types"
import { withRequest } from "@/functions/withRequest"
import { projectApi } from "@/lib/api/projectApi"
import { useToast } from "@/components/toast/useToast"

type ProjectImage = {
  file: File | null
  preview: string
  type: "cover" | "screenshot" | "demo"
}

type Image = {
  cover: ProjectImage | null
  screenshots: ProjectImage[]
  demo: ProjectImage | null
}

type Technology = {
  id: number
  name: string
  slug: string
  category: string
  isVerified: boolean
}

export default function CreateProjectPage() {
  const { addProject, updateProject } = projectApi();
  const { showToast } = useToast();
  const [isDirty, setIsDirty] = useState<Boolean>(false);
  const [form, setForm] = useState<ProjectForm>({
    title: "",
    description: "",
    link: "",
    githubLink: "",
    status: "completed",
  })

  const [images, setImages] = useState<Image>({
    cover: null,
    screenshots: [],
    demo: null,
  })

  const [tech, setTech] = useState<string[]>([])
  const [projectId, setProjectId] = useState<number | null>(null)
  const [selectedTech, setSelectedTech] = useState<Technology[]>([])

  const createDraft = async () => {
    // if (projectId) {
    //   if (!isDirty) return

    //   await withRequest(
    //     () => updateProject(projectId, form),
    //     showToast
    //   )
    //   setIsDirty(false)
    //   return
    // }

    // const data = await withRequest(
    //   () => addProject(form),
    //   showToast
    // )

    // if (!data) return

    // setProjectId(data.project.id)
    // setIsDirty(false)
  }

  const saveImages = async () => {
    if (!projectId) return

    // upload logic
  }

  const saveTech = async () => {
    if (!projectId) return

    await fetch(`/api/projects/${projectId}/tech`, {
      method: "POST",
      body: JSON.stringify({ tech }),
    })
  }

  const publish = async () => {
    if (!projectId) return

    await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify({ isDraft: false }),
    })
  }

  // ===== STEPS =====

  const steps: Step[] = [
    {
      id: "info",
      title: "Info",
      description: "Give your project a clear identity and purpose.",
      render: () => <StepInfo form={form} setForm={setForm} setIsDirty={setIsDirty}/>,
      onNext: createDraft,
    },
    {
      id: "images",
      title: "Media",
      description: "Upload visuals that showcase your work effectively.",
      render: () => <StepImages images={images} setImages={setImages} />,
      onNext: saveImages,
    },
    {
      id: "tech",
      title: "Tech",
      description: "Select the technologies used to build this project.",
      render: () => <StepTech tech={tech} setTech={setTech} selectedTech={selectedTech} setSelectedTech={setSelectedTech}/>,
      onNext: saveTech,
    },
    {
      id: "confirm",
      title: "Review",
      description: "Double-check everything before making it public.",
      render: () => <StepConfirm form={form} images={images} tech={selectedTech} />,
      onNext: publish,
    },
  ]

  return (
    <div className="p-6">
      <Stepper steps={steps} />
    </div>
  )
}