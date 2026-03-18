import SearchBar from "@/components/common/SearchBar"
import { AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline"

export default function ProjectPage() {
  return (
    <>
      <div className="flex pb-4 mb-4 gap-2 border-b-1 border-base-200">
        <SearchBar/>
        <button className="btn btn-square">
          <AdjustmentsHorizontalIcon className="size-5"/>
        </button>
        <button className="btn btn-square">
          <PlusIcon className="size-5"/>
        </button>
      </div>
      <div className="flex flex-wrap flex-col md:flex-row gap-2 lg:gap-4">
        <div className="card bg-base-100 lg:w-96 shadow-sm">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              Card Title
              <div className="badge badge-secondary">NEW</div>
            </h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="card-actions justify-end">
              <div className="badge badge-outline">Fashion</div>
              <div className="badge badge-outline">Products</div>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 lg:w-96 shadow-sm">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              Card Title
              <div className="badge badge-secondary">NEW</div>
            </h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="card-actions justify-end">
              <div className="badge badge-outline">Fashion</div>
              <div className="badge badge-outline">Products</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}