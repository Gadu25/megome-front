"use client";
import Link from "next/link";
import ThemeToggle from "../common/ThemeToggle";
import Avatar from "../common/Avatar";
import { usePathname } from "next/navigation";
import { Bars3BottomLeftIcon, UserIcon, Cog6ToothIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Profile } from "@/types/types";
import LogoutButton from "../auth/LogoutButton";

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
    <nav className="navbar w-full bg-base-300/50">
      <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
        <Bars3BottomLeftIcon className="my-1.5 inline-block size-5" />
      </label>
      <div className="w-full flex justify-between items-center px-4">
        <div className="font-semibold">{title}</div>
        <div className="flex justify-end gap-2">
          <ThemeToggle/>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="rounded-field">
              <Avatar profile={profile}/>
            </div>
            <ul tabIndex={-1} className="menu dropdown-content bg-base-200 rounded-md z-1 mt-1 w-40 p-2 shadow-sm">
              <li><Link href="/profile" onClick={(e) => e.currentTarget.blur()}><UserIcon className="size-4"/> Profile</Link></li>
              <li><a><Cog6ToothIcon className="size-4"/> Settings</a></li>
              <li><div><ArrowRightStartOnRectangleIcon className="size-4"/> <LogoutButton/></div></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}