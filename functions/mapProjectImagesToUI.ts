import type {
  ProjectFull,
  Image,
  ProjectImage,
} from "@/types/types";

export function mapProjectImagesToUI(
  project: ProjectFull
): Image {
  const screenshots = Array.isArray(
    project.images?.screenshots
  )
    ? project.images.screenshots
    : [];

  const cover: ProjectImage | null =
    project.images?.cover
      ? {
          url: project.images.cover,
          preview: project.images.cover,
          type: "cover",
          status: "uploaded",
        }
      : null;

  return {
    cover,

    screenshots: screenshots.map(
      (url): ProjectImage => ({
        url,
        preview: url,
        type: "screenshot",
        status: "uploaded",
      })
    ),
  };
}