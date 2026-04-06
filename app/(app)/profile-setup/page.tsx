import ProfileForm from "@/components/form/Profile"

export default function ProfilePage() {

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Create Your Profile</h2>
        <p className="text-textSecondary text-sm">
          Set up your profile to continue.
        </p>
      </div>
      <ProfileForm />
    </div>
  )
}