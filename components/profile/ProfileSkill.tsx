"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { skillApi } from "@/lib/api/skillApi";
import { Skill } from "@/types/types";
import RightModal from "../modal/RightModal";
import ProfileSkillForm from "../form/Skill";

const PROFICIENCY_MAP: Record<Skill['proficiency'], number> = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 100,
}

export default function ProfileSkill() {
  const { getSkills } = skillApi();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await getSkills();
        setSkills(res.data.skills);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <>
      <div className="card bg-base-100 shadow p-5">
        <div className="flex justify-between">
          <h2 className="font-semibold mb-4">Skills</h2>
          <button className="btn btn-xs" onClick={() => setIsEditOpen(true)}>
            <PencilSquareIcon className="size-5"/>
          </button>
        </div>
        <div className="space-y-4">
          {skills.length === 0 ? (
            <div className="text-center py-6 px-4 border border-dashed rounded-lg">
              <p className="text-sm opacity-70 mb-3">
                No skills added yet. Add your skills to showcase your expertise.
              </p>
              <button className="btn btn-sm btn-primary" onClick={() => setIsEditOpen(true)}>
                Add Skills
              </button>
            </div>
          ) : (
            skills.map((skill) => {
              const value = PROFICIENCY_MAP[skill.proficiency]

              return (
                <div key={skill.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.skillName}</span>
                    <span className="opacity-70">{skill.proficiency}</span>
                  </div>

                  <progress
                    className="progress progress-primary w-full"
                    value={value}
                    max="100"
                  />
                </div>
              )
            })
          )}
        </div>
      </div>
      <RightModal
        title="Skills"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <ProfileSkillForm initialSkills={skills} setSkills={setSkills} />
      </RightModal>
    </>
  )
}