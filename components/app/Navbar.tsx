"use client";

import Link from "next/link";
import ThemeToggle from "../common/ThemeToggle";
import Avatar from "../common/Avatar";
import { usePathname } from "next/navigation";
import {
  Bars3BottomLeftIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";

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
    <nav className=" navbar sticky top-0 z-50 border-b border-base-200 bg-base-100/80 backdrop-blur-md supports-[backdrop-filter]:bg-base-100/70">
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <label htmlFor="my-drawer-4" aria-label="Open sidebar" className="btn btn-ghost btn-square">
            <Bars3BottomLeftIcon className="size-5" />
          </label>

          <h1 className="text-sm font-semibold sm:text-base">
            {title}
          </h1>
        </div>

        <div className="dropdown dropdown-end">
          <button tabIndex={0} 
            className="rounded-full focus:outline-none" aria-label="Open user menu"
          >
            <Avatar profile={profile} />
          </button>

          <ul
            tabIndex={0}
            className=" menu dropdown-content mt-2 w-56 rounded-xl border border-base-200 bg-base-100 p-2 shadow-xl"
          >
            <li>
              <Link href="/profile">
                <UserIcon className="size-4" />
                Profile
              </Link>
            </li>

            <li>
              <Link href="/settings">
                <Cog6ToothIcon className="size-4" />
                Settings
              </Link>
            </li>

            {/* THEME */}
            <li>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SwatchIcon className="size-4" />
                  Theme
                </div>

                <ThemeToggle />
              </div>
            </li>

            <li className="mt-1 border-t border-base-200 pt-1">
              <div>
                <ArrowRightStartOnRectangleIcon className="size-4" />
                <LogoutButton />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}