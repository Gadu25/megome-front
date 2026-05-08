import { cookies } from "next/headers";

import { createAuthHeaders } from "@/functions/createAuthHeaders";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { projectApi } from "@/lib/api/projectApi";

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

  const headers = createAuthHeaders(new Headers(), {
    accessToken: cookieStore.get("Authentication"),
    refreshToken: cookieStore.get("refresh_token"),
  });

  const { getProject } = projectApi();

  let project = null;

  try {
    const res = await getProject(parseInt(projectId), headers);
    console.log("edit this", res)
    project = res?.data?.project ?? null;
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