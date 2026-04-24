import { useEffect, useState } from "react";
import { Education } from "@/types/types";
import { educationApi } from "@/lib/api/educationApi";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import RightModal from "../modal/RightModal";
import ProfileEducationForm from "../form/Education";

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
          <div className="text-center py-6 px-4 border border-dashed rounded-lg">
            <p className="text-sm opacity-70 mb-3">
              No education details added yet.
            </p>
            <button className="btn btn-sm btn-primary" onClick={() => setIsEditOpen(true)}>
              Add Education
            </button>
          </div>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className="p-4 border border-base-300 rounded-lg">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-sm text-base-content/70">
                {edu.school} • {edu.startDate} - {edu.endDate}
              </p>
            </div>
          ))
        )}
      </div>
      <RightModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <h2 className="text-lg font-bold mb-4">Education</h2>
        <ProfileEducationForm initialEducation={education} setEducation={setEducation} />
      </RightModal>
    </>
  );
}