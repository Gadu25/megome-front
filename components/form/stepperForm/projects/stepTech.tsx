import { XMarkIcon } from "@heroicons/react/24/outline"
import { technologyApi } from "@/lib/api/technologyApi"
import type { Technology } from "@/types/types"
import React, { useEffect, useMemo, useState } from "react"

type Props = {
  selectedTech: Technology[] | []
  setSelectedTech: React.Dispatch<React.SetStateAction<Technology[]>>
}

export default function StepTech({ selectedTech, setSelectedTech }: Props) {
  const { getTechnologies } = technologyApi()
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [technologies, setTechnologies] = useState<Technology[]>([])

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const res = await getTechnologies()
        setTechnologies(res?.data?.technologies ?? [])
      } catch (error) {
        console.error("Error fetching technologies:", error)
        setTechnologies([])
      } finally {
        setLoading(false)
      }
    }

    fetchTechnologies()
  }, [])

  const addTech = (tech: Technology) => {
    if (selectedTech.some((t) => t.id === tech.id)) return
    setSelectedTech((prev) => [...prev, tech])
  }

  const removeTech = (id: number) => {
    setSelectedTech((prev) => prev.filter((t) => t.id !== id))
  }

  const filteredTech = useMemo(() => {
    if (!technologies) return []

    return technologies
      .filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((t) => !selectedTech.some((s) => s.id === t.id))
  }, [technologies, search, selectedTech])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTech.map((t) => (
          <div key={t.id} className="badge badge-primary gap-2 cursor-pointer hover:opacity-80">
            {t.name}
            <button type="button" onClick={() => removeTech(t.id)} className="hover:text-red-300">
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <input className="input input-bordered w-full max-w-80"
        placeholder="Search technologies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <div className="border rounded-lg p-2 space-y-1 max-w-80">
          {loading && (
            <div className="p-2 text-sm opacity-60">
              Loading technologies...
            </div>
          )}

          {!loading && filteredTech.length === 0 && (
            <div className="p-2 text-sm opacity-60">
              No technologies found
            </div>
          )}

          {!loading &&
            filteredTech.map((t) => (
              <button key={t.id} className="w-full text-left p-2 hover:bg-base-200 rounded flex justify-between items-center"
                onClick={() => addTech(t)}
              >
                <span>{t.name}</span>
                <span className="text-xs opacity-50">
                  {t.category}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}