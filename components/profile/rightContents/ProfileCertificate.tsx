import { useEffect, useState } from "react";
import { Certificate } from "@/types/types";
import { certificateApi } from "@/lib/api/certificateApi";
import { humanizeDate } from "@/functions/humanitizeDate";
import RightModal from "../../modal/RightModal";
import ProfileCertificateForm from "../../form/Certificate";

import { SectionHeader } from "../sections/SectionHeaders";
import { EmptyState } from "../sections/EmptyState";

export default function ProfileCertificates() {
  const { getCertificate } = certificateApi();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await getCertificate();
        setCertificates(res.data.certificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <>
    <div className="space-y-4">
      <SectionHeader
        title="Certificates"
        onEdit={() => setIsEditOpen(true)}
      />

      {certificates.length === 0 ? (
        <EmptyState
          title="🎓"
          description="You haven’t added any certificates yet"
          action={
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setIsEditOpen(true)}
            >
              Add Certificates
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="card bg-base-100 border border-base-300 hover:shadow-md transition"
            >
              <div className="card-body p-5 space-y-2">
                {/* TITLE */}
                <h3 className="font-semibold text-base leading-tight">
                  {cert.title || "Untitled Certificate"}
                </h3>

                {/* ISSUER */}
                <p className="text-sm text-base-content/70">
                  {cert.issuer || "Unknown issuer"}
                </p>

                {/* DATES */}
                <div className="text-xs text-base-content/50">
                  Issued {humanizeDate(cert.issueDate)}
                  {cert.expirationDate && (
                    <> • Expires {humanizeDate(cert.expirationDate)}</>
                  )}
                </div>

                {/* CREDENTIAL INFO */}
                {(cert.credentialId || cert.credentialUrl) && (
                  <div className="flex flex-wrap gap-2 pt-2">
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
                      <span className="text-xs px-2 py-1 rounded bg-base-200">
                        ID: {cert.credentialId}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

      <RightModal
        title="Certification"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <ProfileCertificateForm 
          initialCertificates={certificates} 
          setCertificates={setCertificates} 
        />
      </RightModal>
    </>
  );
}