"use client"
import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const LIGHT = "lofi";
const DARK = "night";
const STORAGE_KEY = "theme"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setTheme(stored ?? LIGHT)
  }, [])

  useEffect(() => {
    if (!theme) return

    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === DARK ? LIGHT : DARK))
  }

  // Avoid hydration mismatch
  if (!theme) return null

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        checked={theme === DARK}
        onChange={toggleTheme}
      />
      <SunIcon className="swap-off size-5"/>
      <MoonIcon className="swap-on size-5"/>
    </label>
  )
}