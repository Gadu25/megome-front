import type { Image, Technology } from "@/types/types"

type ProjectForm = {
  title: string
  description: string
  link: string
  githubLink: string
}

type StepConfirmProps = {
  form: ProjectForm
  images: Image
  tech: Technology[]
}

export default function StepConfirm({
  form,
  images,
  tech,
}: StepConfirmProps) {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body space-y-5">

          {/* Title section */}
          <div>
            <p className="text-xs uppercase tracking-wider opacity-60">
              Project title
            </p>
            <h2 className="text-2xl font-semibold leading-tight">
              {form.title || "Untitled project"}
            </h2>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs uppercase tracking-wider opacity-60 mb-1">
              Description
            </p>
            <p className="text-base-content/70 whitespace-pre-line leading-relaxed">
              {form.description || "No description provided"}
            </p>
          </div>

          {/* Links */}
          <div className="grid gap-2 pt-2">
            <div>
              <p className="text-xs opacity-60">Live project</p>
              <a
                href={form.link}
                target="_blank"
                className="link link-primary text-sm"
              >
                {form.link || "—"}
              </a>
            </div>

            <div>
              <p className="text-xs opacity-60">Repository</p>
              <a
                href={form.githubLink}
                target="_blank"
                className="link link-primary text-sm"
              >
                {form.githubLink || "—"}
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* TECHNOLOGIES */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body space-y-3">

          {/* Header */}
          <div>
            <p className="text-xs uppercase tracking-wider opacity-60">
              Tech stack
            </p>
            <h3 className="font-semibold text-lg">
              Technologies used
            </h3>
          </div>

          {/* Chips */}
          {tech.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tech.map((t) => (
                <div
                  key={t.id}
                  className={`badge gap-1 px-3 py-2 ${
                    t.isVerified
                      ? "badge-primary"
                      : "badge-outline"
                  }`}
                >
                  <span className="text-xs opacity-80">{t.category}</span>
                  <span className="font-medium">{t.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-60">No technologies selected</p>
          )}

        </div>
      </div>

      {/* IMAGES */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body space-y-5">

          <h3 className="font-semibold">Project Media</h3>

          {/* COVER */}
          <div>
            <p className="text-sm opacity-70 mb-2">Cover</p>

            {images.cover ? (
              <img
                src={images.cover.preview}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="h-40 border border-dashed rounded-lg flex items-center justify-center opacity-60">
                No cover image
              </div>
            )}
          </div>

          {/* SCREENSHOTS */}
          <div>
            <p className="text-sm opacity-70 mb-2">
              Screenshots ({images.screenshots.length})
            </p>

            {images.screenshots.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {images.screenshots.map((img, i) => (
                  <img
                    key={i}
                    src={img.preview}
                    className="h-47 w-full object-cover rounded-md"
                  />
                ))}
              </div>
            ) : (
              <div className="h-47 border border-dashed rounded-lg flex items-center justify-center opacity-60">
                No screenshots uploaded
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}