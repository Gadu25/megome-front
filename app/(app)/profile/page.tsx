import TopProfile from "@/components/profile/TopProfile";
import ProfileSkill from "@/components/profile/ProfileSkill";

export default function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* TOP PROFILE */}
      <div className="card bg-base-100 shadow-xl p-6 flex flex-col lg:flex-row gap-6">
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
        <div className="lg:col-span-2 space-y-6">

          {/* Tabs */}
          <div className="tabs tabs-boxed">
            <a className="tab tab-active">Overview</a>
            <a className="tab">Experience</a>
            <a className="tab">Education</a>
          </div>

          {/* Projects */}
          <div className="card bg-base-100 shadow p-5 space-y-4">
            <div className="flex justify-between">
              <h2 className="font-semibold">Projects</h2>
              <button className="btn btn-ghost btn-xs">Edit</button>
            </div>

            {/* Project Item */}
            <div className="p-4 border border-base-300 rounded-lg">
              <h3 className="font-semibold">DevConnect Platform</h3>
              <p className="text-sm text-base-content/70">
                Collaborative platform for developers to share projects.
              </p>
              <div className="flex gap-2 mt-2">
                <span className="badge badge-outline">React</span>
                <span className="badge badge-outline">Node.js</span>
                <span className="badge badge-outline">PostgreSQL</span>
              </div>
            </div>

            <div className="p-4 border border-base-300 rounded-lg">
              <h3 className="font-semibold">Personal Portfolio</h3>
              <p className="text-sm text-base-content/70">
                Built with Next.js and Tailwind.
              </p>
              <div className="flex gap-2 mt-2">
                <span className="badge badge-outline">Next.js</span>
                <span className="badge badge-outline">Tailwind</span>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="card bg-base-100 shadow p-5 space-y-4">
            <div className="flex justify-between">
              <h2 className="font-semibold">Work Experience</h2>
              <button className="btn btn-ghost btn-xs">Edit</button>
            </div>

            <div className="p-4 border border-base-300 rounded-lg">
              <h3 className="font-semibold">Full Stack Developer</h3>
              <p className="text-sm text-base-content/70">
                CodeCrafters LLC • Jun 2018 - Aug 2021
              </p>
              <p className="text-sm mt-2 text-base-content/70">
                Developed scalable web applications using LAMP stack.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}