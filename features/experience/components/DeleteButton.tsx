"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteExperienceClient } from "@/lib/api/client/experience";
import Modal from "@/components/ui/modal/Modal";
import { withRequest } from "@/utils/api/withRequest";
import { useToast } from "@/components/ui/toast/useToast";

type Props = {
  experienceId: number;
  experienceTitle: string;
  children: React.ReactNode;
};

export default function ExperienceDeleteButton({ experienceId, experienceTitle, children }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  async function handleDelete() {
    const data = await withRequest(
      () => deleteExperienceClient(experienceId),
      showToast
    );
    if (!data) return;
    router.push("/profile");
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Delete experience ${experienceTitle}`}
        onClick={() => setModalOpen(true)}
      >
        {children}
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete Experience"
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
