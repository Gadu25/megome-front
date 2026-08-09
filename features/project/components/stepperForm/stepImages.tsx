"use client"

import { PlusIcon } from "@heroicons/react/24/outline"
import { ProjectImage, Image } from "@/types/ui"
import React, { useState } from "react"
import { useImageResize } from "@/lib/hooks/useImageResize"
import { useToast } from "@/components/ui/toast/useToast"

type Props = {
  images: Image
  setImages: React.Dispatch<React.SetStateAction<Props["images"]>>
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>
}


export default function StepImages({ images, setImages, setIsDirty }: Props) {
  const [coverDragOver, setCoverDragOver] = useState(false);
  const [screenshotDragOver, setScreenshotDragOver] = useState(false);
  const { resizeImage } = useImageResize();
  const { showToast } = useToast();

  function validateFile(file: File): boolean {
    if (!file.type.startsWith("image/")) {
      showToast("Only image files are allowed", "error");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("File must be under 10MB", "error");
      return false;
    }
    return true;
  }

  async function processCover(file: File) {
    if (!validateFile(file)) return;
    const resized = await resizeImage(file, { maxWidth: 1920 });
    setImages((prev) => ({
      ...prev,
      cover: {
        file: new File([resized], file.name, { type: "image/jpeg" }),
        preview: URL.createObjectURL(file),
        type: "cover",
        status: "idle",
      },
    }));
    setIsDirty(true);
  }

  async function processScreenshots(files: FileList) {
    const newImgs: ProjectImage[] = [];
    for (const file of Array.from(files)) {
      if (!validateFile(file)) continue;
      try {
        const resized = await resizeImage(file, { maxWidth: 1920 });
        newImgs.push({
          file: new File([resized], file.name, { type: "image/jpeg" }),
          preview: URL.createObjectURL(file),
          type: "screenshot",
          status: "idle",
        });
      } catch {
        showToast(`Failed to process ${file.name}`, "error");
      }
    }
    if (newImgs.length > 0) {
      setImages((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, ...newImgs],
      }));
      setIsDirty(true);
    }
  }
  const statusBadge = {
    uploading: "bg-amber-500/90 text-white",
    uploaded: "bg-success/90 text-white",
    failed: "bg-error/90 text-white",
  }
  
  return (
    <div className="grid gap-6">

      {/* COVER */}
      <fieldset className="fieldset space-y-2">
        <legend className="fieldset-legend">Cover Image</legend>

        {!images.cover ? (
          <label
            className={`border border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-base-200 transition ${coverDragOver ? "border-primary bg-primary/5" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setCoverDragOver(true); }}
            onDragLeave={() => setCoverDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setCoverDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) processCover(file);
            }}
          >
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processCover(file);
              }}
            />
            <p className="font-medium">Upload cover image</p>
            <p className="text-sm opacity-60">Recommended: 16:9 ratio. Drag & drop or click</p>
          </label>
        ) : (
          <div className="relative">
            <img
              src={images.cover.preview}
              className="w-full h-56 object-cover rounded-lg"
            />

            {/* STATUS */}
            {images.cover.status === "uploading" && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm">
                Uploading...
              </div>
            )}

            {images.cover.status === "failed" && (
              <div className="text-error text-sm mt-1">
                {images.cover.error}
              </div>
            )}

            <button
              className="btn btn-sm btn-error absolute top-2 right-2"
              onClick={() => {
                setImages((prev) => ({ ...prev, cover: null }))
                setIsDirty(true);
              }}
            >
              Remove
            </button>
          </div>
        )}
      </fieldset>

      {/* SCREENSHOTS */}
      <fieldset className="fieldset space-y-2">
        <legend className="fieldset-legend">Screenshots</legend>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

          {images.screenshots.map((img) => (
            <div key={img.preview} className="relative group">
              <img
                src={img.preview}
                className="w-full h-47 object-cover rounded"
              />

              {/* STATUS OVERLAY */}
              {img.status !== "idle" && (
                <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded ${statusBadge[img.status]}`}>
                  {img.status}
                </div>
              )}

              <button
                className="btn btn-xs btn-error absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                onClick={() => {
                  setImages((prev) => ({
                    ...prev,
                    screenshots: prev.screenshots.filter(i => i !== img),
                  }))
                  setIsDirty(true);
                }}
              >
                ✕
              </button>
            </div>
          ))}

          {/* ADD */}
          <label
            className={`border border-dashed rounded flex items-center justify-center h-47 cursor-pointer hover:bg-base-200 ${screenshotDragOver ? "border-primary bg-primary/5" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setScreenshotDragOver(true); }}
            onDragLeave={() => setScreenshotDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setScreenshotDragOver(false);
              if (e.dataTransfer.files.length) processScreenshots(e.dataTransfer.files);
            }}
          >
            <input
              type="file"
              multiple
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.length) processScreenshots(e.target.files);
              }}
            />
            <PlusIcon className="w-6 h-6 opacity-60" />
          </label>

        </div>
      </fieldset>

    </div>
  )
}
