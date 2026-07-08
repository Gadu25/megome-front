import Link from "next/link";
import ProjectDeleteButton from "./DeleteButton";
import { getStatusStyle } from "@/utils/ui/getStatusStyle";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { ProjectFull } from "@/types/domain";

type Props = {
  project: ProjectFull;
};

export default function ProjectCard({
  project,
}: Props) {
  const techs = project.technologies ?? [];
  const cover = project.images?.cover;

  const isDraft = project.isDraft;

  const projectHref = isDraft
    ? `/projects/${project.id}/edit`
    : `/projects/${project.id}`;

  return (
    <article
      className="
        group relative overflow-hidden rounded-box bg-base-100 shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-lg
        focus-within:ring-2 focus-within:ring-primary/30
      "
    >

      {/* Draft Delete Action */}
      {isDraft && (
        <div
          className="
            absolute right-3 top-3 z-20
            opacity-100 md:opacity-0
            md:transition-opacity md:duration-200
            md:group-hover:opacity-100
            md:group-focus-within:opacity-100
          "
        >
          <ProjectDeleteButton
            projectId={project.id}
            isDraft={project.isDraft}
            projectTitle={project.title}
          >
            <div className="
              btn btn-circle btn-sm btn-error btn-soft
              shadow-md md:shadow-none
            ">
              <TrashIcon className="size-4" aria-hidden="true" />
            </div>
          </ProjectDeleteButton>
        </div>
      )}

      {/* Clickable Area */}
      <Link
        href={projectHref}
        className="block outline-none"
      >

        {/* Cover */}
        <figure className="relative h-48 overflow-hidden bg-base-200">
          {cover ? (
            <img
              src={cover}
              alt={`${project.title} cover image`}
              loading="lazy"
              decoding="async"
              className="
                h-full w-full object-cover
                transition-transform duration-300
                group-hover:scale-105
              "
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-base-content/50">
              No cover image
            </div>
          )}
        </figure>

        {/* Content */}
        <div className="card-body space-y-4 p-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-1 text-base font-semibold">
              {project.title}
            </h2>

            <span
              className={`badge badge-sm shrink-0 ${getStatusStyle(project.status)}`}
            >
              {project.status}
            </span>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-6 text-base-content/70">
            {project.description || "No description"}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5">
            {techs.slice(0, 3).map((tech) => (
              <span
                key={tech.id}
                className="badge badge-outline badge-xs"
              >
                {tech.name}
              </span>
            ))}

            {techs.length > 3 && (
              <span className="badge badge-ghost badge-xs">
                +{techs.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
