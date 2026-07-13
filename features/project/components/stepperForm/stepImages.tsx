"use client"

import { PlusIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { ProjectImage, Image } from "@/types/ui"
import React from "react"

type Props = {
  images: Image
  setImages: React.Dispatch<React.SetStateAction<Props["images"]>>
}


export default function StepImages({ images, setImages }: Props) {
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
          <label className="border border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-base-200 transition">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return

                setImages((prev) => ({
                  ...prev,
                  cover: {
                    file,
                    preview: URL.createObjectURL(file),
                    type: "cover",
                    status: "idle",
                  },
                }))
              }}
            />

            <p className="font-medium">Upload cover image</p>
            <p className="text-sm opacity-60">Recommended: 16:9 ratio</p>
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
              onClick={() =>
                setImages((prev) => ({ ...prev, cover: null }))
              }
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
                }}
              >
                ✕
              </button>
            </div>
          ))}

          {/* ADD */}
          <label className="border border-dashed rounded flex items-center justify-center h-47 cursor-pointer hover:bg-base-200">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])

                const newImgs: ProjectImage[] = files.map((file) => ({
                  file,
                  preview: URL.createObjectURL(file),
                  type: "screenshot",
                  status: "idle",
                }))

                setImages((prev) => ({
                  ...prev,
                  screenshots: [...prev.screenshots, ...newImgs],
                }))
              }}
            />

            <PlusIcon className="w-6 h-6 opacity-60" />
          </label>

        </div>
      </fieldset>

    </div>
  )
}
