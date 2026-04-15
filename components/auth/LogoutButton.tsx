"use client";
import { authApi } from "@/lib/api/authApi";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const onLogout = async () => {
    const { logout } = authApi();
    await logout();
    router.push("/auth");
  };

  return <div onClick={onLogout}>Logout</div>;
};

export default LogoutButton;
