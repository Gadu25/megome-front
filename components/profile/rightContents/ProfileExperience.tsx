import { useEffect, useMemo, useState } from "react";

import { Experience } from "@/types/types";
import { getExperienceClient } from "@/lib/api/client/experience";
import { humanizeDate } from "@/functions/humanitizeDate";

import RightModal from "../../modal/RightModal";
import ProfileExperienceForm from "../../form/Experience";

import { SectionHeader } from "../sections/SectionHeaders";
import { EmptyState } from "../sections/EmptyState";

export default function ProfileExperience() {

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await getExperienceClient();
        setExperiences(res.experiences);
      } catch (error) {
        console.error("Error fetching experience:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  const sortedExperiences = useMemo(() => {
    if (!experiences) return [];

    return [...experiences].sort(
      (a, b) =>
        new Date(b.startDate).getTime() -
        new Date(a.startDate).getTime()
    );
  }, [experiences]);

  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => setIsEditOpen(false);

  return (
    <>
      <section className="space-y-4">
        <SectionHeader
          title="Experiences"
          onEdit={openEditModal}
        />

        {!loading && experiences.length === 0 ? (
          <EmptyState
            title="🎓"
            description="You haven’t added any work experience yet"
            action={
              <button
                className="btn btn-sm btn-primary"
                onClick={openEditModal}
              >
                Add your first experience
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {sortedExperiences.map((exp, index) => {
              const isLastItem =
                index === sortedExperiences.length - 1;

              return (
                <article
                  key={exp.id}
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
                  <div className="flex-1 space-y-2 min-w-0">
                    <header className="space-y-1">
                      <h3 className="font-semibold leading-tight">
                        {exp.title || "Untitled Role"}
                      </h3>

                      <p className="text-sm text-base-content/70">
                        {exp.company || "Unknown Company"}
                      </p>

                      <p className="text-xs text-base-content/50">
                        {humanizeDate(exp.startDate)} —{" "}
                        {exp.endDate
                          ? humanizeDate(exp.endDate)
                          : "Present"}
                      </p>
                    </header>

                    {exp.description && (
                      <p className="line-clamp-3 text-sm leading-relaxed text-base-content/70">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <RightModal
        title="Experiences"
        isOpen={isEditOpen}
        onClose={closeEditModal}
      >
        <ProfileExperienceForm
          initialExperiences={experiences}
          setExperiences={setExperiences}
        />
      </RightModal>
    </>
  );
}