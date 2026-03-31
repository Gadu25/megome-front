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

  return <button className="btn" onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
