import { PlusIcon } from "@heroicons/react/24/outline"
import type { Image } from "@/types/types"
import React from "react"

type Props = {
  images: Image
  setImages: React.Dispatch<React.SetStateAction<Image>>
}

export default function StepImages({ images, setImages }: Props) {
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

          {images.screenshots.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.preview}
                className="w-full h-47 object-cover rounded"
              />

              <button
                className="btn btn-xs btn-error absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                onClick={() =>
                  setImages((prev) => ({
                    ...prev,
                    screenshots: prev.screenshots.filter((_, idx) => idx !== i),
                  }))
                }
              >
                ✕
              </button>
            </div>
          ))}

          <label className="border border-dashed rounded flex items-center justify-center h-28 cursor-pointer hover:bg-base-200">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])

                const newImgs = files.map((file) => ({
                  file,
                  preview: URL.createObjectURL(file),
                  type: "screenshot" as const,
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