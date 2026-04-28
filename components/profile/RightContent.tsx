"use client";

import { useState } from "react";
import ProfileProjects from "./ProfileProjects";
import ProfileEducation from "./ProfileEducation";
import ProfileExperience from "./ProfileExperience";
import ProfileCertificates from "./ProfileCertificate";

type Tab = 'projects' | 'experience' | 'education' | 'certificates';

export default function RightContent() {
  const [activeTab, setActiveTab] = useState<Tab>('education');
  return (
    <>
    <div className="space-y-4 lg:col-span-2">


      <div role="tablist" className="tabs tabs-boxed">
        <button role="tab" className={`tab ${activeTab === 'education' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('education')}
        >
          Education
        </button>

        <button role="tab" className={`tab ${activeTab === 'experience' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          Experience
        </button>

        <button role="tab" className={`tab ${activeTab === 'projects' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>

        <button role="tab" className={`tab ${activeTab === 'certificates' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          Certificates
        </button>
      </div>

      <div className="w-full">
        {activeTab === 'projects' && (
          <ProfileProjects />
        )}

        {activeTab === 'experience' && (
          <ProfileExperience />
        )}

        {activeTab === 'education' && (
          <ProfileEducation />
        )}

        {activeTab === 'certificates' && (
          <ProfileCertificates />
        )}
      </div>
    </div>
    </>
  )
}