import React from "react";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import { getInitServer } from "@/lib/api/server/init";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initData = await getInitServer();

  if (!initData?.profile) {
    redirect("/profile-setup");
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <Navbar profile={initData.profile} />

        <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">
          {children}
        </main>
      </div>

      <Sidebar />
    </div>
  );
}