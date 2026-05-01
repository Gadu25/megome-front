import { XMarkIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"

type Props = {
  tech: string[]
  setTech: (v: string[]) => void
  selectedTech: Technology[]
  setSelectedTech: React.Dispatch<React.SetStateAction<Technology[]>>
}

type Technology = {
  id: number
  name: string
  slug: string
  category: string
  isVerified: boolean
}

const MOCK_TECH: Technology[] = [
  { id: 1, name: "React", slug: "react", category: "frontend", isVerified: true },
  { id: 2, name: "Next.js", slug: "next-js", category: "frontend", isVerified: true },
  { id: 3, name: "Node.js", slug: "node-js", category: "backend", isVerified: true },
  { id: 4, name: "Tailwind CSS", slug: "tailwind-css", category: "frontend", isVerified: true },
  { id: 5, name: "Prisma", slug: "prisma", category: "tool", isVerified: true },
]

export default function StepTech({ tech, setTech, selectedTech, setSelectedTech }: Props) {
  const [search, setSearch] = useState("")
  const add = (t: string) => {
    if (tech.includes(t)) return
    setTech([...tech, t])
  }

  const addTech = (tech: Technology) => {
    if (selectedTech.find((t) => t.id === tech.id)) return
    setSelectedTech((prev) => [...prev, tech])
  }

  const removeTech = (id: number) => {
    setSelectedTech((prev) => prev.filter((t) => t.id !== id))
  }

  const filteredTech = MOCK_TECH.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )


  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTech.map((t) => (
          <div key={t.id} className="badge badge-primary gap-2">
            {t.name}
            <button onClick={() => removeTech(t.id)}>
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <input
        className="input input-bordered w-full"
        placeholder="Search technologies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <div className="border rounded-lg p-2 space-y-1">
          {filteredTech.map((t) => (
            <button
              key={t.id}
              className="w-full text-left p-2 hover:bg-base-200 rounded"
              onClick={() => addTech(t)}
            >
              {t.name}
              <span className="text-xs opacity-50 ml-2">{t.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}