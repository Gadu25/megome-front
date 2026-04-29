import { useEffect, useState } from "react";
import { Experience } from "@/types/types";
import { experienceApi } from "@/lib/api/experienceApi";
import { humanizeDate } from "@/functions/humanitizeDate";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import RightModal from "../modal/RightModal";
import ProfileExperienceForm from "../form/Experience";

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
      <div className="card bg-base-100 shadow p-5 space-y-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">Work Experience</h2>
          <button className="btn btn-xs" onClick={() => setIsEditOpen(true)}>
            <PencilSquareIcon className="size-5"/>
          </button>
        </div>

        {experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-base-300 rounded-xl bg-base-200/40">
          <div className="mb-3 text-base-content/60">💼</div>

          <p className="text-sm text-base-content/70 mb-4">
            You haven’t added any work experience yet
          </p>

          <button className="btn btn-primary btn-sm">
            Add your first experience
          </button>
        </div>
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