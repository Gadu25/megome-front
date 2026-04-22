"use client";

import { useState } from "react";

export default function RightContent() {
  const [activeTab, setActiveTab] = useState<'projects' | 'experience' | 'education'>('projects');
  return (
    <>
    <div className="space-y-4 lg:col-span-2">


      <div role="tablist" className="tabs tabs-boxed">
        <button role="tab" className={`tab ${activeTab === 'projects' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>

        <button role="tab" className={`tab ${activeTab === 'experience' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          Experience
        </button>

        <button role="tab" className={`tab ${activeTab === 'education' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('education')}
        >
          Education
        </button>
      </div>

      <div className="w-full">

        {activeTab === 'projects' && (
          <div className="card bg-base-100 shadow p-5 space-y-4">
            <div className="flex justify-between">
              <h2 className="font-semibold">Projects</h2>
              <button className="btn btn-ghost btn-xs">Edit</button>
            </div>

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
          </div>
        )}

        {activeTab === 'experience' && (
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
        )}

        {activeTab === 'education' && (
          <div className="card bg-base-100 shadow p-5 space-y-4">
            <div className="flex justify-between">
              <h2 className="font-semibold">Education</h2>
              <button className="btn btn-ghost btn-xs">Edit</button>
            </div>

            <div className="p-4 border border-base-300 rounded-lg">
              <h3 className="font-semibold">Your Degree</h3>
              <p className="text-sm text-base-content/70">
                University Name • Year - Year
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}