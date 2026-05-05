import TopProfile from "@/components/profile/TopProfile";
import ProfileSkill from "@/components/profile/ProfileSkill";
import RightContent from "@/components/profile/RightContent";

export default function ProfilePage() {
  
  return (
    <div className="mx-auto space-y-6">
      <div className="card bg-base-100 shadow p-6 flex flex-col lg:flex-row gap-6">
        <TopProfile/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <ProfileSkill/>
        </div>
        <RightContent/>
      </div>
    </div>
  );
}