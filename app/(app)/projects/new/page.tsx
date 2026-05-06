"use client"

import { useState } from "react"
import Stepper, { Step } from "@/components/stepper/Stepper"

import StepInfo from "@/components/form/stepperForm/projects/stepInfo"
import StepImages from "@/components/form/stepperForm/projects/stepImages"
import StepTech from "@/components/form/stepperForm/projects/stepTech"
import StepConfirm from "@/components/form/stepperForm/projects/stepConfirm"
import type { ProjectForm, Image, ProjectImage, Technology } from "@/types/types"
import { withRequest } from "@/functions/withRequest"
import { projectApi } from "@/lib/api/projectApi"
import { useToast } from "@/components/toast/useToast"

export default function CreateProjectPage() {
  const { addProject, updateProject, uploadProjectImage, uploadCoverImage } = projectApi();
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
  })

  const [tech, setTech] = useState<string[]>([])
  const [projectId, setProjectId] = useState<number | null>(null)
  const [selectedTech, setSelectedTech] = useState<Technology[]>([])

  const createDraft = async (): Promise<boolean> => {
    // update
    if (projectId) {
      if (!isDirty) return true;

      const data = await withRequest(
        () => updateProject(projectId, form),
        showToast
      )

      if (!data) return false;
      
      setIsDirty(false);
      return true;
    }

    // create new
    const data = await withRequest(
      () => addProject(form),
      showToast
    )

    if (!data) return false;

    setProjectId(data.project.id);
    setIsDirty(false);
    return true;
  }

  const saveImages = async (): Promise<boolean> => {
    if (!projectId) return false;

    // mark all pending as uploading FIRST (avoid race conditions)
    setImages(prev => ({
      ...prev,
      screenshots: prev.screenshots.map(img =>
        !img.id ? { ...img, status: "uploading" as const } : img
      ),
      cover: prev.cover && !prev.cover.id
        ? { ...prev.cover, status: "uploading" as const }
        : prev.cover
    }));

    const updatedScreenshots: ProjectImage[] = await Promise.all(
      images.screenshots.map(async (img): Promise<ProjectImage> => {
        if (img.status === "uploaded") return img;

        try {
          const res = await uploadProjectImage(projectId, img);
          const data = res.data;

          return {
            ...img,
            id: data.image.id,
            url: data.image.url,
            status: "uploaded" as const,
            error: undefined,
          };
        } catch (err: any) {
          const errorMessage = err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Upload failed";

          return {
            ...img,
            status: "failed" as const,
            error: errorMessage,
          };
        }
      })
    );

    let updatedCover: ProjectImage | null = images.cover;

    if (images.cover && (images.cover.status !== "uploaded")) {
      try {
        const res = await uploadCoverImage(projectId, images.cover);
        const data = res.data;

        updatedCover = {
          ...images.cover,
          id: data.image.id,
          url: data.image.url,
          status: "uploaded" as const,
          error: undefined,
        };
      } catch (err: any) {
        const errorMessage = err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Upload failed";

        updatedCover = {
          ...images.cover,
          status: "failed" as const,
          error: errorMessage,
        };
      }
    }

    setImages({
      screenshots: updatedScreenshots,
      cover: updatedCover,
    });

    const hasFailed =
      updatedScreenshots.some(i => i.status === "failed") ||
      updatedCover?.status === "failed";

    return !hasFailed;
  };

  const saveTech = async (): Promise<boolean> => {
    if (!projectId) {
      return false
    }

    return true

    await fetch(`/api/projects/${projectId}/tech`, {
      method: "POST",
      body: JSON.stringify({ tech }),
    })
  }

  const publish = async (): Promise<boolean> => {
    if (!projectId) {
      return false;
    }

    return true;

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
      render: () => <StepTech selectedTech={selectedTech} setSelectedTech={setSelectedTech}/>,
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