import { getProjectsServer } from "@/lib/api/server/project";
import ProjectsClient from "@/features/project/components/ProjectsClient";
import type { ProjectFull } from "@/types/domain";

type ProjectTab = "published" | "drafts";

export default async function ProjectPage({
  searchParams,
}: {
  searchParams?: Promise<{
    tab?: ProjectTab;
  }>;
}) {
  let projects: ProjectFull[] = [];

  try {
    const res = await getProjectsServer();
    projects = res?.projects ?? [];
  } catch (error) {
    console.error("Failed to fetch projects", error);
  }

  const params = await searchParams;

  const activeTab: ProjectTab =
    params?.tab === "drafts"
      ? "drafts"
      : "published";

  const draftCount = projects.filter((p) => p.isDraft).length;

  return (
    <section className="space-y-6">
      <ProjectsClient
        projects={projects}
        activeTab={activeTab}
        draftCount={draftCount}
      />
    </section>
  );
}
