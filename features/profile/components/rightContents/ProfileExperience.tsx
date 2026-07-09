"use client";

import { useEffect, useMemo, useState } from "react";

import { Experience } from "@/types/domain";
import { getExperienceClient } from "@/lib/api/client/experience";
import { humanizeDate } from "@/utils/date/humanizeDate";

import RightModal from "@/components/ui/modal/RightModal";
import ProfileExperienceForm from "../ExperienceForm";

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
        setExperiences(res.experiences ?? []);
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

  if (loading) {
    return (
      <section className="space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-36"></div>
          <div className="skeleton h-9 w-24 rounded-lg"></div>
        </div>

        {/* Experience list */}
        <div className="space-y-4">

          {[...Array(3)].map((_, index) => {
            const isLastItem = index === 2;

            return (
              <article
                key={index}
                className="flex gap-4 rounded-xl border border-base-300 bg-base-100 p-4"
              >

                {/* Timeline */}
                <div
                  aria-hidden="true"
                  className="flex flex-col items-center"
                >
                  <div className="mt-1 h-3 w-3 rounded-full bg-base-300" />

                  {!isLastItem && (
                    <div className="mt-1 w-px flex-1 bg-base-300" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-3">

                  {/* Header */}
                  <header className="space-y-2">

                    {/* Role */}
                    <div className="skeleton h-5 w-48"></div>

                    {/* Company */}
                    <div className="flex items-center gap-2">
                      <div className="skeleton size-5 rounded shrink-0"></div>
                      <div className="skeleton h-4 w-36"></div>
                    </div>

                    {/* Date */}
                    <div className="skeleton h-3 w-40"></div>

                  </header>

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-[92%]"></div>
                    <div className="skeleton h-4 w-[70%]"></div>
                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </section>
    )
  }

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

                      <p className="flex items-center gap-2 text-sm text-base-content/70">
                        {exp.logo && (
                          <img
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            className="size-6 rounded object-contain bg-base-200"
                          />
                        )}
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
                      <div
                        className="line-clamp-3 text-sm leading-relaxed text-base-content/70
                          [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                          [&_p]:mb-2 [&_p:empty]:hidden
                          [&_strong]:font-semibold [&_em]:italic
                          [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                          [&_li]:mb-1
                          [&_code]:bg-base-200 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
                          [&_pre]:bg-base-200 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
                          [&_pre_code]:bg-transparent [&_pre_code]:p-0"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.technologies.map(tech => (
                          <span key={tech.id} className="badge badge-ghost badge-sm">
                            {tech.name}
                          </span>
                        ))}
                      </div>
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
