import React from "react";
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";
import { authApi } from "@/lib/api/authApi";
import ServerError from "@/components/ServerError";

export default async function AppLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  try {
    const { verifyAccessToken } = authApi();
    await verifyAccessToken();

    console.log(verifyAccessToken, 'test')

    return (
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <Navbar />
          <div className="p-6">{ children }</div>
        </div>
        <Sidebar />
      </div>
    )
  } catch (error) {
    return <ServerError error={error} />
  }
} 

