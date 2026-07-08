"use client";

import { useEffect, useMemo, useState } from "react";

import { Certificate } from "@/types/domain";
import { getCertificateClient } from "@/lib/api/client/certificate";
import { humanizeDate } from "@/utils/date/humanizeDate";

import RightModal from "@/components/ui/modal/RightModal";
import ProfileCertificateForm from "../CertificateForm";

import { SectionHeader } from "../sections/SectionHeaders";
import { EmptyState } from "../sections/EmptyState";

export default function ProfileCertificates() {

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await getCertificateClient();
        setCertificates(res.certificates ?? []);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const sortedCertificates = useMemo(
    () =>
      [...certificates].sort(
        (a, b) =>
          new Date(b.issueDate).getTime() -
          new Date(a.issueDate).getTime()
      ),
    [certificates]
  );

  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => setIsEditOpen(false);

  if (loading) {
    return (
      <section className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-32"></div>
          <div className="skeleton h-9 w-24 rounded-lg"></div>
        </div>

        {/* Certificate list */}
        <div className="space-y-3">

          {[...Array(3)].map((_, index) => (
            <article
              key={index}
              className="card border border-base-300 bg-base-100"
            >
              <div className="card-body space-y-4 p-5">

                {/* Header */}
                <header className="space-y-2">

                  {/* Title */}
                  <div className="skeleton h-5 w-3/4"></div>

                  {/* Issuer */}
                  <div className="skeleton h-4 w-40"></div>

                  {/* Dates */}
                  <div className="skeleton h-3 w-52"></div>

                </header>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1">

                  {/* Credential button */}
                  <div className="skeleton h-7 w-28 rounded-md"></div>

                  {/* Credential ID */}
                  <div className="skeleton h-7 w-36 rounded-md"></div>

                </div>

              </div>
            </article>
          ))}

        </div>

      </section>
    )
  }

  return (
    <>
      <section className="space-y-4">
        <SectionHeader
          title="Certificates"
          onEdit={openEditModal}
        />

        {!loading && certificates.length === 0 ? (
          <EmptyState
            title="🎓"
            description="You haven’t added any certificates yet"
            action={
              <button
                className="btn btn-sm btn-primary"
                onClick={openEditModal}
              >
                Add certificates
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {sortedCertificates.map((cert) => (
              <article
                key={cert.id}
                className="card border border-base-300 bg-base-100 transition hover:shadow-md"
              >
                <div className="card-body space-y-3 p-5">
                  <header className="space-y-1">
                    <div className="flex items-start gap-3">
                      {cert.certificateImage && (
                        <img src={cert.certificateImage} alt={cert.title} className="size-12 rounded-xl object-contain bg-base-200 p-1 shrink-0" />
                      )}
                      <div>
                        <h3 className="text-base font-semibold leading-tight">
                          {cert.title || "Untitled Certificate"}
                        </h3>

                        <p className="text-sm text-base-content/70">
                          {cert.issuer || "Unknown issuer"}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-base-content/50">
                      Issued {humanizeDate(cert.issueDate)}

                      {cert.expirationDate && (
                        <>
                          {" "}
                          • Expires{" "}
                          {humanizeDate(cert.expirationDate)}
                        </>
                      )}
                    </p>
                  </header>

                  {(cert.credentialId ||
                    cert.credentialUrl) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-xs btn-primary"
                        >
                          View Credential
                        </a>
                      )}

                      {cert.credentialId && (
                        <span className="rounded bg-base-200 px-2 py-1 text-xs">
                          ID: {cert.credentialId}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <RightModal
        title="Certification"
        isOpen={isEditOpen}
        onClose={closeEditModal}
      >
        <ProfileCertificateForm
          initialCertificates={certificates}
          setCertificates={setCertificates}
        />
      </RightModal>
    </>
  );
}
