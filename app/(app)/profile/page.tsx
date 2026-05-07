import TopProfile from "@/components/profile/TopProfile";
import ProfileSkill from "@/components/profile/ProfileSkill";
import RightContent from "@/components/profile/RightContent";

export default function ProfilePage() {
  return (
    <main className="mx-auto space-y-6">

      {/* Profile Header */}
      <section className="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <div className="p-5 sm:p-6 lg:p-8">
          <TopProfile />
        </div>
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Left Sidebar */}
        <aside className="space-y-6">
          <ProfileSkill />
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <RightContent />
        </div>
      </section>
    </main>
  );
}