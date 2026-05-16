import { cookies } from "next/headers";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getProjectServer } from "@/lib/api/server/project";

import ProjectWizard from "@/components/projects/ProjectWizard";
import Link from "next/link";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const cookieStore = await cookies();

  let project = null;

  try {
    const res = await getProjectServer(parseInt(projectId));
    project = res?.project ?? null;
  } catch (error) {
    console.error("Failed to fetch project:", error);
  }

  if (!project) {
    return (
      <div className="p-6 text-sm text-base-content/60">
        Project not found
      </div>
    );
  }

  return (
    <>
      {project.isDraft == false ? (

        <div className="mb-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content transition-colors"
          >
            <ArrowLeftIcon className="size-4" />
            Finish Edit
          </Link>
        </div>
      ): null }
      <ProjectWizard
        mode="edit"
        initialProject={project}
      />
    </>
  );
}