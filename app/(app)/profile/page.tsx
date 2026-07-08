import { TopProfile, ProfileSkill, RightContent } from "@/features/profile";
import { Card } from "@/components/ui/Card";

export default async function ProfilePage({ searchParams }: { searchParams: { tab?: string }}) {

  const resolvedParams = await searchParams;
  const isProfileSetup = resolvedParams.tab === 'profile-setup';

  return (
    <main className="mx-auto space-y-6">

      {/* Profile Header */}
      <section>
        <Card className="shadow-xs">
          <div className="p-5 sm:p-6 lg:p-8">
            <TopProfile isProfileSetup={isProfileSetup}/>
          </div>
        </Card>
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