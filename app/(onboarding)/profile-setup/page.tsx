import ProfileForm from "@/components/form/Profile";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body space-y-6">

            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Complete your profile
              </h1>

              <p className="text-sm opacity-70">
                Set up your profile to unlock the full experience.
              </p>
            </div>

            {/* Step indicator */}
            {/* <div>
              <ul className="steps steps-horizontal w-full text-xs">
                <li className="step step-primary">Account</li>
                <li className="step step-primary">Profile</li>
                <li className="step">Finish</li>
              </ul>
            </div> */}

            <div className="divider" />

            {/* Form container */}
            <div className="rounded-lg bg-base-200 p-4 sm:p-6 border border-base-300">
              <ProfileForm />
            </div>

            {/* Footer note */}
            <div className="text-center text-xs opacity-60">
              You can update your details anytime in account settings.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}