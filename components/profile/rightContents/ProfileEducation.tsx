import { useEffect, useMemo, useState } from "react";

import { Education } from "@/types/types";
import { getEducationClient } from "@/lib/api/client/education";
import { humanizeDate } from "@/functions/humanitizeDate";

import { SectionHeader } from "../sections/SectionHeaders";
import { EmptyState } from "../sections/EmptyState";

import RightModal from "../../modal/RightModal";
import ProfileEducationForm from "../../form/Education";

export default function ProfileEducation() {

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await getEducationClient();
        setEducation(res.educations);
      } catch (error) {
        console.error("Error fetching education:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const sortedEducation = useMemo(
    () =>
      [...education].sort(
        (a, b) =>
          new Date(b.startDate).getTime() -
          new Date(a.startDate).getTime()
      ),
    [education]
  );

  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => setIsEditOpen(false);

  return (
    <>
      <section className="space-y-4">
        <SectionHeader
          title="Education"
          onEdit={openEditModal}
        />

        {!loading && education.length === 0 ? (
          <EmptyState
            title="🎓"
            description="You haven’t added any education yet"
            action={
              <button
                className="btn btn-sm btn-primary"
                onClick={openEditModal}
              >
                Add your first education
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {sortedEducation.map((edu, index) => {
              const isLastItem =
                index === sortedEducation.length - 1;

              return (
                <article
                  key={edu.id}
                  className="flex gap-4 rounded-xl border border-base-300 bg-base-100 p-4 transition hover:shadow-sm"
                >
                  {/* TIMELINE */}
                  <div
                    aria-hidden="true"
                    className="flex flex-col items-center"
                  >
                    <div className="mt-1 h-3 w-3 rounded-full bg-primary" />

                    {!isLastItem && (
                      <div className="mt-1 w-px flex-1 bg-base-300" />
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <header className="space-y-1">
                      <h3 className="font-semibold leading-tight">
                        {edu.degree || "Untitled Degree"}

                        {edu.fieldOfStudy && (
                          <span className="ml-2 text-sm font-normal text-base-content/60">
                            • {edu.fieldOfStudy}
                          </span>
                        )}
                      </h3>

                      <p className="text-sm text-base-content/70">
                        {edu.school}
                      </p>

                      <p className="text-xs text-base-content/50">
                        {humanizeDate(edu.startDate)} —{" "}
                        {edu.endDate
                          ? humanizeDate(edu.endDate)
                          : "Present"}
                      </p>
                    </header>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <RightModal
        title="Education"
        isOpen={isEditOpen}
        onClose={closeEditModal}
      >
        <ProfileEducationForm
          initialEducation={education}
          setEducation={setEducation}
        />
      </RightModal>
    </>
  );
}