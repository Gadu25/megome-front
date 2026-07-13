"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteCertificateClient } from "@/lib/api/client/certificate";
import Modal from "@/components/ui/modal/Modal";
import { withRequest } from "@/utils/api/withRequest";
import { useToast } from "@/components/ui/toast/useToast";

type Props = {
  certificateId: number;
  certificateTitle: string;
  children: React.ReactNode;
};

export default function CertificateDeleteButton({ certificateId, certificateTitle, children }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  async function handleDelete() {
    const data = await withRequest(
      () => deleteCertificateClient(certificateId),
      showToast
    );
    if (!data) return;
    router.push("/profile");
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Delete certificate ${certificateTitle}`}
        onClick={() => setModalOpen(true)}
      >
        {children}
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete Certificate"
        onAccept={handleDelete}
        onCancel={() => setModalOpen(false)}
        acceptText="Delete"
      >
        <p className="text-sm opacity-70">
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
