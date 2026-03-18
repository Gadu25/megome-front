import React from "react";
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";

export default function AppLayout({ children }: Readonly<{children: React.ReactNode;}>) {
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
} 