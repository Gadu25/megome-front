"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteProjectClient } from "@/lib/api/client/project";
import Modal from "@/components/ui/modal/Modal";
import { withRequest } from "@/utils/api/withRequest";
import { useToast } from "@/components/ui/toast/useToast";

type Props = {
  projectId: number;
  isDraft?: boolean;
  projectTitle: string;
  children: React.ReactNode
};

export default function ProjectDeleteButton({ projectId, isDraft = false, projectTitle, children }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const { showToast } = useToast();

  async function handleDelete() {
    const data = await withRequest(
      () => deleteProjectClient(projectId),
      showToast
    )
    if (!data) return;
    if (isDraft) {
      router.refresh();
    }
    router.push("/projects");
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Delete draft ${projectTitle}`}
        
        onClick={() => setModalOpen(true)}
      >
        {children}
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete Project"
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
