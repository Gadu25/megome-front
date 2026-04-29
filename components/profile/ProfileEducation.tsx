import { useEffect, useState } from "react";
import { Education } from "@/types/types";
import { educationApi } from "@/lib/api/educationApi";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import RightModal from "../modal/RightModal";
import ProfileEducationForm from "../form/Education";
import { humanizeDate } from "@/functions/humanitizeDate";

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
      <div className="card bg-base-100 shadow p-5 space-y-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">Education</h2>
          <button className="btn btn-ghost btn-xs" onClick={() => setIsEditOpen(true)}>
            <PencilSquareIcon className="size-5"/>
          </button>
        </div>

        {education.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-base-300 rounded-xl bg-base-200/40">
            <div className="mb-3 text-base-content/60">
              🎓
            </div>

            <p className="text-sm text-base-content/70 mb-4">
              You haven’t added any education yet
            </p>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditOpen(true)}
            >
              Add your first education
            </button>
          </div>
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