import { AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline"
import { projectApi } from "@/lib/api/projectApi";
import type { Project } from "@/types/types";
import Link from "next/link"
import SearchBar from "@/components/common/SearchBar"
import { cookies } from "next/headers";
import { createAuthHeaders } from "@/functions/createAuthHeaders";

export default async function ProjectPage() {
  const { getProjects } = projectApi();

  let projects:Project[] = [];

  try {
    const cookieStore = await cookies(); 
    const accessToken = cookieStore.get("Authentication");
    const refreshToken = cookieStore.get("refresh_token");
    const headers = createAuthHeaders(new Headers(), { accessToken, refreshToken });
    
    const res = await getProjects(headers);
    console.log('res', res)
    projects = res?.data?.projects ?? [];
  } catch (error) {
    console.error('error', error);
  }

  return (
    <>
      <div className="flex pb-4 mb-4 gap-2 border-b-1 border-base-200">
        <SearchBar/>
        <button className="btn btn-square">
          <AdjustmentsHorizontalIcon className="size-5"/>
        </button>
        <Link href="/projects/new" className="btn btn-square">
          <PlusIcon className="size-5" />
        </Link>
      </div>
      <div className="flex flex-wrap flex-col md:flex-row gap-2 lg:gap-4">
        {projects.map((project) => (
          <div key={project.id} className="card bg-base-100 lg:w-89 shadow-sm">
            <figure>
              <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {project.title}
                <div className="badge badge-secondary">{project.status}</div>
              </h2>
              <p>{project.description}</p>
              {/* <div className="card-actions justify-end">
                <div className="badge badge-outline">Fashion</div>
                <div className="badge badge-outline">Products</div>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}