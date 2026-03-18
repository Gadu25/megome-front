import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

export default function SearchBar() {
  return (
    <>
      <label className="input">
        <MagnifyingGlassIcon className="size-5 opacity-50" />
        <input type="search" required placeholder="Search" />
      </label>
    </>
  )
}