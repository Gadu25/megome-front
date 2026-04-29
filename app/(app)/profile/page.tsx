import TopProfile from "@/components/profile/TopProfile";
import ProfileSkill from "@/components/profile/ProfileSkill";
import RightContent from "@/components/profile/RightContent";

export default function ProfilePage() {
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* TOP PROFILE */}
      <div className="card bg-base-100 shadow p-6 flex flex-col lg:flex-row gap-6">
        <TopProfile/>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="space-y-6">

          <ProfileSkill/>

          {/* API Status */}
          {/* <div className="card bg-base-100 shadow p-5">
            <h2 className="font-semibold mb-2">API Status</h2>
            <div className="badge badge-success">Connected</div>
            <p className="text-sm text-base-content/60 mt-2">
              Your portfolio is live via API.
            </p>
          </div> */}

        </div>

        {/* RIGHT CONTENT */}
        <RightContent/>

      </div>
    </div>
  );
}