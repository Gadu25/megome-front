import { useEffect, useState } from "react";
import { Experience } from "@/types/types";
import { experienceApi } from "@/lib/api/experienceApi";
import { humanizeDate } from "@/functions/humanitizeDate";

import RightModal from "../../modal/RightModal";
import ProfileExperienceForm from "../../form/Experience";

import { SectionHeader } from "../sections/SectionHeaders";
import { EmptyState } from "../sections/EmptyState";

export default function ProfileExperience() {
  const { getExperience } = experienceApi();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await getExperience();
        setExperiences(res.data.experience);
      } catch (error) {
        console.error("Error fetching experience:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  return (
    <>
      <div className="space-y-4">
        <SectionHeader
          title="Experiences"
          onEdit={() => setIsEditOpen(true)}
        />

        {experiences.length === 0 ? (
          <EmptyState
            title="🎓"
            description="You haven’t added any work experience yet"
            action={
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setIsEditOpen(true)}
              >
                Add your first experience
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {[...experiences]
              .sort(
                (a, b) =>
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime()
              )
              .map((exp, index, arr) => (
                <div
                  key={exp.id}
                  className="flex gap-4 p-4 rounded-xl border border-base-300 bg-base-100 hover:shadow-sm transition"
                >
                  {/* TIMELINE */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mt-1" />
                    {index !== arr.length - 1 && (
                      <div className="flex-1 w-px bg-base-300 mt-1" />
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 space-y-2">
                    {/* TITLE */}
                    <h3 className="font-semibold leading-tight">
                      {exp.title || "Untitled Role"}
                    </h3>

                    {/* COMPANY + DATE */}
                    <p className="text-sm text-base-content/70">
                      {exp.company || "Unknown Company"}
                    </p>

                    <p className="text-xs text-base-content/50">
                      {humanizeDate(exp.startDate)} —{" "}
                      {exp.endDate
                        ? humanizeDate(exp.endDate)
                        : "Present"}
                    </p>

                    {/* DESCRIPTION */}
                    {exp.description && (
                      <p className="text-sm text-base-content/70 leading-relaxed line-clamp-3">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <RightModal
        title="Experiences"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <ProfileExperienceForm initialExperiences={experiences} setExperiences={setExperiences} />
      </RightModal>
    </>
  );
}