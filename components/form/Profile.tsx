"use client"

import { useState } from "react"
import type { Profile } from "@/types/types"
import {
  UserIcon,
  MapPinIcon,
  GlobeAltIcon,
  PhoneIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

type Props = {
  initialData?: Partial<Profile>
}

export default function ProfileForm({ initialData }: Props) {
  const [form, setForm] = useState<Partial<Profile>>({
    firstName: "",
    lastName: "",
    bio: "",
    phone: "",
    website: "",
    location: "",
    profileImage: "",
    ...initialData,
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // console.log("handled")
    // setLoading(true)

    // try {
    //   const res = await fetch("/api/profile", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(form),
    //   })

    //   if (!res.ok) throw new Error("Failed to save")
    // } finally {
    //   setLoading(false)
    // }
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6 text-textPrimary"
    >
      {/* BASIC INFO */}
      <div className="bg-surfaceElevated border border-border p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="size-20 rounded-full bg-surface flex items-center justify-center text-lg">
              JD
            </div>
            <input type="file" className="file-input file-input-md" value={form.profileImage || ""} />
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="text-sm text-textSecondary flex items-center gap-2">
                <UserIcon className="size-4" />
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm text-textSecondary flex items-center gap-2">
                <UserIcon className="size-4" />
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm text-textSecondary flex items-center gap-2">
                <MapPinIcon className="size-4" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-textSecondary flex items-center gap-2">
                <PhoneIcon className="size-4" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Website */}
            <div className="md:col-span-2">
              <label className="text-sm text-textSecondary flex items-center gap-2">
                <GlobeAltIcon className="size-4" />
                Website
              </label>
              <input
                type="url"
                name="website"
                value={form.website || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BIO */}
      <div className="bg-surfaceElevated border border-border p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold">Bio</h3>
        <textarea
          name="bio"
          value={form.bio || ""}
          onChange={handleChange}
          rows={4}
          className="textarea textarea-bordered w-full"
          placeholder="Write something about yourself..."
        />
      </div>

      {/* SOCIAL LINKS */}
      <div className="bg-surfaceElevated border border-border p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold">Links</h3>

        <div>
          <label className="text-sm text-textSecondary flex items-center gap-2">
            <LinkIcon className="size-4" />
            Website / Portfolio
          </label>
          <input
            type="url"
            name="website"
            value={form.website || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 border border-border rounded-md text-textSecondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-accent hover:bg-accentHover text-black px-6 py-2 rounded-md font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  )
}