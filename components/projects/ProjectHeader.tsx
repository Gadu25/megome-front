import Link from "next/link";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getStatusStyle } from "@/functions/getStatusStyle";
import ProjectDeleteButton from "./DeleteButton";

interface Props {
  id: number;
  title: string;
  status: string;
}

export function ProjectHeader({ id, title, status }: Props) {
  return (
    <header className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <h1 className="text-3xl font-bold leading-tight break-words">
            {title}
          </h1>

          <span className={`badge ${getStatusStyle(status)}`}>
            {status}
          </span>
        </div>

        {/* CONTEXT MENU */}
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Project actions"
          >
            <EllipsisVerticalIcon className="size-5" />
          </button>

          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
          >
            <li>
              <Link href={`/projects/${id}/edit`}>
                <PencilIcon className="size-4" />
                Edit Project
              </Link>
            </li>

            <li className="mt-1 border-t border-base-200 pt-1">
                <ProjectDeleteButton projectId={id} projectTitle={title}>
                  <div className="flex justify-start gap-2 w-full items-center text-error">
                    <TrashIcon className="size-4" />
                    Delete Project
                  </div>
                </ProjectDeleteButton>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}