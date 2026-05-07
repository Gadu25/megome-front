import Link from "next/link";
import { getStatusStyle } from "@/functions/getStatusStyle";
import type { ProjectFull } from "@/types/types";

type Props = {
  project: ProjectFull;
};

export default function ProjectCard({ project }: Props) {
  const techs = project.technologies ?? [];
  const cover = project.images?.cover;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group outline-none"
    >
      <article
        className=" card overflow-hidden bg-base-100 shadow-sm transition-all duration-300
          hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/30"
      >
        {/* Cover */}
        <figure className="relative h-48 overflow-hidden bg-base-200">
          {cover ? (
            <img
              src={cover}
              alt={`${project.title} cover image`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
      </article>
    </Link>
  );
}