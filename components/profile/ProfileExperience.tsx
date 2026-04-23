import { useEffect, useState } from "react";
import { Experience } from "@/types/types";
import { experienceApi } from "@/lib/api/experienceApi";

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
    <div className="card bg-base-100 shadow p-5 space-y-4">
      <div className="flex justify-between">
        <h2 className="font-semibold">Work Experience</h2>
        <button className="btn btn-ghost btn-xs">Edit</button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-6 px-4 border border-dashed rounded-lg">
          <p className="text-sm opacity-70 mb-3">
            No work experience added yet.
          </p>
          <button className="btn btn-sm btn-primary">
            Add Experience
          </button>
        </div>
      ) : (
        experiences.map((exp) => (
          <div key={exp.id} className="p-4 border border-base-300 rounded-lg">
            <h3 className="font-semibold">{exp.title}</h3>
            <p className="text-sm text-base-content/70">
              {exp.company} • {exp.startDate} - {exp.endDate}
            </p>
            <p className="text-sm mt-2 text-base-content/70">
              {exp.description}
            </p>
          </div>
        ))
      )}
    </div>
  );
}