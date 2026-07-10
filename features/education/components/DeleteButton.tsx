"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteEducationClient } from "@/lib/api/client/education";
import Modal from "@/components/ui/modal/Modal";
import { withRequest } from "@/utils/api/withRequest";
import { useToast } from "@/components/ui/toast/useToast";

type Props = {
  educationId: number;
  educationTitle: string;
  children: React.ReactNode;
};

export default function EducationDeleteButton({ educationId, educationTitle, children }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  async function handleDelete() {
    const data = await withRequest(
      () => deleteEducationClient(educationId),
      showToast
    );
    if (!data) return;
    router.push("/profile");
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Delete education ${educationTitle}`}
        onClick={() => setModalOpen(true)}
      >
        {children}
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete Education"
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
