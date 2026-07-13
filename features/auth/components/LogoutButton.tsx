"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutClient } from "@/lib/api/client/auth";
import Modal from "@/components/ui/modal/Modal";

const LogoutButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const proceedCancel = async () => {
    await logoutClient();
    router.push("/auth");
  }

  return (
    <>
      <div onClick={()=> setOpen(true)}>Logout</div>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
        onAccept={() => proceedCancel()}
        onCancel={() => setOpen(false)}
        acceptText="Logout"
      >
        <p>Are you sure you want to proceed? This will logout your current session.</p>
      </Modal>
    </>

  );
};

export default LogoutButton;
