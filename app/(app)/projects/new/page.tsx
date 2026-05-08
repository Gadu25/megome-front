"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Stepper, { Step } from "@/components/stepper/Stepper"

import StepInfo from "@/components/form/stepperForm/projects/stepInfo"
import StepImages from "@/components/form/stepperForm/projects/stepImages"
import StepTech from "@/components/form/stepperForm/projects/stepTech"
import StepConfirm from "@/components/form/stepperForm/projects/stepConfirm"
import type { ProjectForm, Image, ProjectImage, Technology } from "@/types/types"
import { withRequest } from "@/functions/withRequest"
import { projectApi } from "@/lib/api/projectApi"
import { technologyApi } from "@/lib/api/technologyApi"
import { useToast } from "@/components/toast/useToast"

export default function CreateProjectPage() {
  const { addProject, updateProject, uploadProjectImage, uploadCoverImage } = projectApi();
  const { linkProjectTechnologies } = technologyApi();
  const { showToast } = useToast();
  const router = useRouter();

  const [isDirty, setIsDirty] = useState<Boolean>(false);
  const [form, setForm] = useState<ProjectForm>({
    title: "",
    description: "",
    link: "",
    githubLink: "",
    status: "completed",
    isDraft: true,
  })

  const [images, setImages] = useState<Image>({
    cover: null,
    screenshots: [],
  })

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

    try {
      const techIds: number[] = [];
      for (let i = 0; i < selectedTech.length; i++) {
        techIds.push(selectedTech[i].id)
      }

      const data = await withRequest(
        () => linkProjectTechnologies(projectId, techIds),
        showToast
      )

      if (!data) return false;

      return true
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "  failed";
      showToast(errorMessage, 'error')
    }

    return true
  }

  const publish = async (): Promise<boolean> => {
    if (!projectId) {
      return false;
    }
    setForm((prev) => ({
      ...prev,
      isDraft: false,
    }))

    const data = await withRequest(
      () => updateProject(projectId, form),
      showToast
    )
    if (!data) return false;
    router.push("/projects")
    return true;

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