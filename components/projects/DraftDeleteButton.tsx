"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { projectApi } from "@/lib/api/projectApi";
import Modal from "../modal/Modal";
import { withRequest } from "@/functions/withRequest";
import { useToast } from "../toast/useToast";

type Props = {
  projectId: number;
  projectTitle: string;
  children: React.ReactNode
};

export default function DraftDeleteButton({ projectId, projectTitle, children }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const { showToast } = useToast();
  const { deleteProject } = projectApi();

  async function handleDelete() {
    try {
      const data = await withRequest(
        () => deleteProject(projectId),
        showToast
      )
      if (!data) return;

      router.refresh();
    } catch (error) {
      console.error(error);
    }
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