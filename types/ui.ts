export type ProjectImage = {
  id?: number
  url?: string
  file?: File
  preview: string
  type: "cover" | "screenshot"
  status: "idle" | "uploading" | "uploaded" | "failed"
  error?: string
}

export type Image = {
  cover: ProjectImage | null
  screenshots: ProjectImage[]
}
