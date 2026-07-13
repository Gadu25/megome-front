"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Stepper, { Step } from "@/components/ui/stepper/Stepper";

import StepInfo from "./stepperForm/stepInfo";
import StepImages from "./stepperForm/stepImages";
import StepTech from "./stepperForm/stepTech";
import StepConfirm from "./stepperForm/stepConfirm";

import type { Technology, ProjectFull } from "@/types/domain";
import type { ProjectForm } from "@/types/form";
import type { Image, ProjectImage } from "@/types/ui";
import { mapProjectImagesToUI } from "@/utils/ui/mapProjectImagesToUI";
import { useToast } from "@/components/ui/toast/useToast";

import { addProjectClient, updateProjectClient, uploadProjectImageClient, uploadCoverImageClient } from "@/lib/api/client/project";
import { linkProjectTechnologiesClient } from "@/lib/api/client/technology";
import { withRequest } from "@/utils/api/withRequest";

type Mode = "create" | "edit";

interface Props {
  mode: Mode;
  initialProject?: ProjectFull | null;
}

export default function ProjectWizard({
  mode,
  initialProject,
}: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const isEdit = mode === "edit";
  const [isDirty, setIsDirty] = useState<Boolean>(false);

  const [form, setForm] = useState<ProjectForm>({
    title: initialProject?.title ?? "",
    description: initialProject?.description ?? "",
    link: initialProject?.link ?? "",
    githubLink: initialProject?.githubLink ?? "",
    status: initialProject?.status ?? "completed",
    isDraft: initialProject?.isDraft ?? true,
  });

  const [projectId, setProjectId] = useState<number | null>(
    initialProject?.id ?? null
  );

  const [images, setImages] = useState<Image>(() => {
    if (initialProject) {
      return mapProjectImagesToUI(initialProject);
    }

    return {
      cover: null,
      screenshots: [],
    };
  });

  const [selectedTech, setSelectedTech] = useState<Technology[]>(
    initialProject?.technologies ?? []
  );

  // ---------- STEP 1 ----------
  const saveInfo = async () => {
    if (isEdit) {
      if (!isDirty || !projectId) return true;

      const data = await withRequest(
        () => updateProjectClient(projectId, form),
        showToast
      )

      if (!data) return false;
      
      setIsDirty(false);
      return true;
    }

    return createDraft()
  };

  const createDraft = async (): Promise<boolean> => {
    // update
    if (projectId) {
      if (!isDirty) return true;

      const data = await withRequest(
        () => updateProjectClient(projectId, form),
        showToast
      )

      if (!data) return false;
      
      setIsDirty(false);
      return true;
    }

    // create new
    const data = await withRequest(
      () => addProjectClient(form),
      showToast
    )

    if (!data?.project) return false;

    setProjectId(data.project.id);
    setIsDirty(false);
    return true;
  }

  // ---------- STEP 2 ----------
  const saveImages = async (): Promise<boolean> => {
  if (!projectId) return false;

  // immutable snapshot FIRST
  const currentImages = structuredClone(images);

  // update UI state
  setImages(prev => ({
    ...prev,
    screenshots: prev.screenshots.map(img =>
      !img.id
        ? { ...img, status: "uploading" as const }
        : img
    ),
    cover:
      prev.cover && !prev.cover.id
        ? { ...prev.cover, status: "uploading" as const }
        : prev.cover,
  }));

  // upload screenshots
  const updatedScreenshots: ProjectImage[] = await Promise.all(
    currentImages.screenshots.map(async (img) => {
      if (img.status === "uploaded") return img;

      try {
        const res = await uploadProjectImageClient(projectId, img);
        const data = res;

        return {
          ...img,
          id: data.image.id,
          url: data.image.url,
          status: "uploaded" as const,
          error: undefined,
        };
      } catch (err: any) {
        return {
          ...img,
          status: "failed" as const,
          error:
            err?.data?.error ||
            err?.data?.message ||
            err?.message ||
            "Upload failed",
        };
      }
    })
  );

  // upload cover
  let updatedCover: ProjectImage | null = currentImages.cover;

  if (
    currentImages.cover &&
    currentImages.cover.status !== "uploaded"
  ) {
    try {
      const res = await uploadCoverImageClient(
        projectId,
        currentImages.cover
      );

      const data = res;

      updatedCover = {
        ...currentImages.cover,
        id: data.image.id,
        url: data.image.url,
        status: "uploaded" as const,
        error: undefined,
      };
    } catch (err: any) {
      updatedCover = {
        ...currentImages.cover,
        status: "failed" as const,
        error:
          err?.data?.error ||
          err?.data?.message ||
          err?.message ||
          "Upload failed",
      };
    }
  }

  // reconcile state
  setImages({
    screenshots: updatedScreenshots,
    cover: updatedCover,
  });

  const hasFailed =
    updatedScreenshots.some(i => i.status === "failed") ||
    updatedCover?.status === "failed";

  return !hasFailed;
};

  // ---------- STEP 3 ----------
  const saveTech = async (): Promise<boolean> => {
    if (!projectId) return false;

    const techIds = [...new Set(selectedTech.map(t => t.id))];

    const data = await withRequest(
      () => linkProjectTechnologiesClient(projectId, techIds),
      showToast
    )

    if (!data) return false;

    return true;
  };

  // ---------- STEP 4 ----------
  const publish = async () => {
    if (!projectId) return false;

    const res = await updateProjectClient(projectId, {
      ...form,
      isDraft: false,
    });

    if (!res) return false;

    router.push("/projects");
    return true;
  };

  const steps: Step[] = [
    {
      id: "info",
      title: "Info",
      description: "Project details",
      render: () => (
        <StepInfo form={form} setForm={setForm} setIsDirty={setIsDirty} />
      ),
      onNext: saveInfo,
    },
    {
      id: "images",
      title: "Media",
      description: "Images",
      render: () => (
        <StepImages images={images} setImages={setImages} />
      ),
      onNext: saveImages,
    },
    {
      id: "tech",
      title: "Tech",
      description: "Technologies",
      render: () => (
        <StepTech
          selectedTech={selectedTech}
          setSelectedTech={setSelectedTech}
        />
      ),
      onNext: saveTech,
    },
    {
      id: "confirm",
      title: "Review",
      description: "Finalize",
      render: () => (
        <StepConfirm
          form={form}
          images={images}
          tech={selectedTech}
        />
      ),
      onNext: publish,
    },
  ];

  return (
    <div className="p-6">
      <Stepper steps={steps} />
    </div>
  );
}
