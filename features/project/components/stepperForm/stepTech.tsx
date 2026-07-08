"use client";

import { XMarkIcon } from "@heroicons/react/24/outline"
import { getTechnologiesClient } from "@/lib/api/client/technology"
import type { Technology } from "@/types/domain"
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

type Props = {
  selectedTech: Technology[]
  setSelectedTech: React.Dispatch<
    React.SetStateAction<Technology[]>
  >
}

export default function StepTech({
  selectedTech,
  setSelectedTech,
}: Props) {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const res = await getTechnologiesClient()
        setTechnologies(res?.technologies ?? [])
      } catch (error) {
        console.error("Error fetching technologies:", error)
        setTechnologies([])
      } finally {
        setLoading(false)
      }
    }

    fetchTechnologies()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )
    }
  }, [])

  const filteredTech = useMemo(() => {
    return technologies
      .filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter(
        (t) =>
          !selectedTech.some((selected) => selected.id === t.id)
      )
  }, [technologies, search, selectedTech])

  const addTech = (tech: Technology) => {
    if (selectedTech.some((t) => t.id === tech.id)) return

    setSelectedTech((prev) => [...prev, tech])

    // UX improvement:
    // clear search and keep focus for rapid selection
    setSearch("")
    setActiveIndex(0)
    setIsOpen(false)

    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }

  const containerRef = useRef<HTMLDivElement>(null)

  const removeTech = (id: number) => {
    setSelectedTech((prev) =>
      prev.filter((t) => t.id !== id)
    )
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!filteredTech.length) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setIsOpen(true)
        setActiveIndex((prev) =>
          prev < filteredTech.length - 1
            ? prev + 1
            : prev
        )
        break

      case "ArrowUp":
        e.preventDefault()
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : 0
        )
        break

      case "Enter":
        e.preventDefault()

        if (filteredTech[activeIndex]) {
          addTech(filteredTech[activeIndex])
        }

        break

      case "Escape":
        setIsOpen(false)
        break
    }
  }

  const showDropdown =
    isOpen && (search.length > 0 || filteredTech.length > 0)

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Selected technologies */}
      {selectedTech.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTech.filter(Boolean).map((tech, idx) => (
            <div
              key={`${tech.id}-${tech.name}-${idx}`}
              className="badge badge-primary gap-1 px-3 py-3"
            >
              <span>{tech.name}</span>

              <button
                type="button"
                aria-label={`Remove ${tech.name}`}
                onClick={() => removeTech(tech.id)}
                className="rounded-full hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search + dropdown */}
      <div className="relative max-w-md">
        <label
          htmlFor="technology-search"
          className="sr-only"
        >
          Search technologies
        </label>

        <input
          id="technology-search"
          ref={inputRef}
          type="text"
          value={search}
          placeholder="Search technologies..."
          className="input input-bordered w-full"
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="technology-listbox"
          aria-autocomplete="list"
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
            setActiveIndex(0)
          }}
          onKeyDown={handleKeyDown}
        />

        {showDropdown && (
          <div
            id="technology-listbox"
            role="listbox"
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border bg-base-100 shadow-lg"
          >
            <div className="max-h-64 overflow-y-auto p-1">
              {loading && (
                <div className="px-3 py-2 text-sm opacity-60">
                  Loading technologies...
                </div>
              )}

              {!loading && filteredTech.length === 0 && (
                <div className="px-3 py-2 text-sm opacity-60">
                  No technologies found
                </div>
              )}

              {!loading &&
                filteredTech.map((tech, index) => {
                  const isActive = index === activeIndex

                  return (
                    <button
                      key={tech.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() =>
                        setActiveIndex(index)
                      }
                      onClick={() => addTech(tech)}
                      className={[
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors",
                        isActive
                          ? "bg-base-200"
                          : "hover:bg-base-200",
                      ].join(" ")}
                    >
                      <span>{tech.name}</span>

                      <span className="text-xs opacity-50">
                        {tech.category}
                      </span>
                    </button>
                  )
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
