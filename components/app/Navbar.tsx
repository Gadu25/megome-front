"use client";
import ThemeToggle from "../common/ThemeToggle";
import { usePathname } from "next/navigation";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import Avatar from "../common/Avatar";
import { Profile } from "@/types/types";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/settings": "Settings",
};

type Props = {
  profile: Profile;
};


export default function Navbar({ profile }: Props) {
  const pathname = usePathname() || "/";
  const title = routeTitles[pathname] || "App";

  return (
    <nav className="navbar w-full bg-base-300">
      <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
        <Bars3BottomLeftIcon className="my-1.5 inline-block size-5" />
      </label>
      <div className="w-full flex justify-between px-4">
        <div className="font-semibold">{title}</div>
        <div className="flex justify-end gap-2">
          <ThemeToggle/>
          <Avatar profile={profile}/>
        </div>
      </div>
    </nav>
  )
}