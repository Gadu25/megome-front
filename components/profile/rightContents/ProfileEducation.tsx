import { useEffect, useState } from "react";
import { Education } from "@/types/types";
import { educationApi } from "@/lib/api/educationApi";
import { humanizeDate } from "@/functions/humanitizeDate";

import { SectionHeader } from "../sections/SectionHeaders";
import { EmptyState } from "../sections/EmptyState";

import RightModal from "../../modal/RightModal";
import ProfileEducationForm from "../../form/Education";

export default function ProfileEducation() {
  const { getEducation } = educationApi();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await getEducation();
        setEducation(res.data.education);
      } catch (error) {
        console.error("Error fetching education:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEducation();
  }, []);

  return (
    <>
      <div className="space-y-4">
        <SectionHeader
          title="Education"
          onEdit={() => setIsEditOpen(true)}
        />

        {education.length === 0 ? (
          <EmptyState
            title="🎓"
            description=" You haven’t added any education yet"
            action={
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setIsEditOpen(true)}
              >
                Add your first education
              </button>
            }
          />
          ) : (
            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex gap-4 p-4 rounded-xl border border-base-300 bg-base-100 hover:shadow-sm transition"
                >
                  {/* LEFT INDICATOR (timeline feel) */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mt-1" />
                    <div className="flex-1 w-px bg-base-300 mt-1" />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 space-y-1">
                    {/* DEGREE */}
                    <h3 className="font-semibold leading-tight">
                      {edu.degree || "Untitled Degree"}
                      {edu.fieldOfStudy && (
                        <span className="ml-2 text-sm font-normal text-base-content/60">
                          • {edu.fieldOfStudy}
                        </span>
                      )}
                    </h3>

                    {/* SCHOOL */}
                    <p className="text-sm text-base-content/70">
                      {edu.school}
                    </p>

                    {/* DATE */}
                    <p className="text-xs text-base-content/50">
                      {humanizeDate(edu.startDate)} —{" "}
                      {edu.endDate ? humanizeDate(edu.endDate) : "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      <RightModal
        title="Education"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <ProfileEducationForm initialEducation={education} setEducation={setEducation} />
      </RightModal>
    </>
  );
}