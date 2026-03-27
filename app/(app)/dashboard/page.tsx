import { apiFetch } from "@/lib/api/api";
import { logout } from "@/lib/api/authApi";
import { useAuthStore } from "@/lib/store/auth-store";
import AppLayout from "../layout";

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
};

type Profile = {
  id: number;
  userId: number;
  bio: string;
  phone: string;
  website: string;
  location: string;
  profileImage: string;
};

type ApiResponse<T> = {
  message: string;
  data: T;
};

export default async function DashboardPage() {
  // const accessToken = useAuthStore((state) => state.accessToken);


  // const handleLogout = async () => {
  //   try {
  //     const data = await logout();
  //     console.log(data)
  //     useAuthStore.getState().setAccessToken(""); // make sure your auth store has a clearToken action
  //     alert("Logged out successfully!");
  //     // optionally redirect to login page
  //     window.location.href = "/auth";
  //   } catch (err) {
  //     console.error(err);
  //     alert("Logout failed, please try again.");
  //   }
  // };

  return (
    <>
      Just a Dashboard
    </>
  );
}