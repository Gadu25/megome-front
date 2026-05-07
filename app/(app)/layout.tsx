import React from "react";
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";
import { authApi } from "@/lib/api/authApi";
import ServerError from "@/components/ServerError";
import { cookies } from "next/headers";
import { createAuthHeaders } from "@/functions/createAuthHeaders";
import { InitApi } from "@/lib/api/initApi";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  try {
    const cookieStore = await cookies(); 
    const accessToken = cookieStore.get("Authentication");
    const refreshToken = cookieStore.get("refresh_token");
    const headers = createAuthHeaders(new Headers(), { accessToken, refreshToken });

    const { verifyAccessToken } = authApi();
    await verifyAccessToken(headers);

    const { getInit } = InitApi();
    const initData = await getInit(headers);

    if(!initData.data.profile) {
      redirect("/profile-setup")
    }

    const profile = initData.data.profile;

    return (
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <Navbar profile={profile} />
          <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">
            {children}
          </main>
        </div>
        <Sidebar />
      </div>
    )
  } catch (error) {
    return <ServerError error={error} />
  }
} 

