"use client"

import { useState } from "react"
import type { ProfileForm } from "@/types/types"
import { UserIcon } from "@heroicons/react/24/outline";
import { profileApi } from "@/lib/api/profileApi";
import { useRouter } from "next/navigation";
import { profileSchema } from "@/features/profile/schema";


export default function ProfileForm() {
  const { updateProfile } = profileApi();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    bio: "",
    phone: "",
    website: "",
    location: "",
    profileImage: null,
  })


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({});
    setLoading(true)
    
    try {
      const result = profileSchema.safeParse(form);

      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        setLoading(false);
        return;
      }

      await updateProfile(form);
      router.push("/dashboard");
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6 text-textPrimary"
    >
      {/* BASIC INFO */}
      <div className="bg-surfaceElevated border border-border p-6 rounded-xl space-y-6">
        <div className="flex gap-2 items-center">
          <span>
            <UserIcon className="size-6" />
          </span>
          <h3 className="text-lg font-semibold">Basic Information</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 p-2">
            <div className="size-40 rounded-full bg-base-300 flex items-center justify-center text-lg">
              JD
            </div>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-sm"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setForm((prev) => ({ ...prev, profileImage: file }))
              }}
            />
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <fieldset className="fieldset">
              <label className="label">First Name</label>
              <input 
                type="text"
                name="firstName"
                value={form.firstName || ""}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.firstName ? "input-error" : ""}`}
              />
            </fieldset>
            {/* Last Name */}
            <fieldset className="fieldset">
              <label className="label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName || ""}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.lastName ? "input-error" : ""}`}
              />
            </fieldset>

            {/* Location */}
            <fieldset className="fieldset">
              <label className="label">Location</label>
              <input 
                type="text"
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.location ? "input-error" : ""}`}
              />
            </fieldset>

            {/* Phone */}
            <fieldset className="fieldset">
              <label className="label">Phone</label>
              <input 
                type="tel"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.phone ? "input-error" : ""}`}
              />
            </fieldset>

            {/* Website */}
            <fieldset className="fieldset md:col-span-2">
              <label className="label">Website</label>
              <input 
                type="url"
                name="website"
                value={form.website || ""}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.website ? "input-error" : ""}`}
              />
            </fieldset>
          </div>
        </div>
      </div>

      {/* BIO */}
      
      <div className="bg-surfaceElevated border border-border p-6 rounded-xl space-y-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Your bio</legend>
          <textarea
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
            rows={4}
            className={`textarea textarea-bordered w-full ${errors.bio ? "textarea-error" : ""}`}
            placeholder="Write something about yourself..."
          />
          <div className="label">You can edit bio later on from settings</div>
        </fieldset>
      </div>

      {/* SOCIAL LINKS */}
      {/* <div className="bg-surfaceElevated border border-border p-6 rounded-xl space-y-4">
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
      </div> */}

      {/* ACTIONS */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 border border-border rounded-md text-textSecondary cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-content px-6 py-2 rounded-md font-semibold disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  )
}