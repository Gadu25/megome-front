"use client";

import { useEffect, useState } from "react";
import { getSkillClient } from "@/lib/api/client/skill";
import { Skill } from "@/types/types";
import RightModal from "../modal/RightModal";
import ProfileSkillForm from "../form/Skill";
import { SectionCard } from "./sections/SectionCard";
import { SectionHeader } from "./sections/SectionHeaders";
import { EmptyState } from "./sections/EmptyState";

const PROFICIENCY_MAP: Record<Skill["proficiency"], number> = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 100,
};

export default function ProfileSkill() {

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await getSkillClient();
        setSkills(res.skills);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="Skills"
          onEdit={() => setIsEditOpen(true)}
        />

        {loading ? (
          <div className="h-24 animate-pulse bg-base-200 rounded-lg" />
        ) : skills.length === 0 ? (
          <EmptyState
            title="No skills added yet"
            description="Add your skills to showcase your expertise"
            action={
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setIsEditOpen(true)}
              >
                Add Skills
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{skill.skillName}</span>
                  <span className="opacity-70">
                    {skill.proficiency}
                  </span>
                </div>

                <progress
                  className="progress progress-primary w-full"
                  value={PROFICIENCY_MAP[skill.proficiency]}
                  max="100"
                />
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <RightModal
        title="Skills"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <ProfileSkillForm
          initialSkills={skills}
          setSkills={setSkills}
        />
      </RightModal>
    </>
  );
}