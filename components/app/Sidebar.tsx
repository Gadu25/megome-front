"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoFull, LogoSmall } from "../common/Logo";

import {
  HomeIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";

type Item = {
  name: string;
  path: string;
  icon: any;
};

export default function Sidebar() {
  const pathname = usePathname();

  const menu: Item[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: WindowIcon,
    },
  ];

  return (
    <div className="drawer-side z-[60] overflow-visible">
      <label
        htmlFor="my-drawer-4"
        aria-label="Close sidebar"
        className="drawer-overlay bg-black/40"
      />

      <aside
        className="
          flex min-h-full flex-col
          overflow-visible

          border-r border-base-200
          bg-base-100
          shadow-xl

          is-drawer-close:w-16
          is-drawer-open:w-64
        "
      >
        {/* LOGO */}
        <div className="border-b border-base-200">
          <div className="is-drawer-close:hidden px-5 py-5">
            <LogoFull />
          </div>

          <div className="is-drawer-open:hidden px-2 py-5 text-center">
            <LogoSmall />
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-4 is-drawer-close:px-0 overflow-visible">
          <ul className="menu gap-1 w-auto">
            {menu.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.path ||
                pathname.startsWith(`${item.path}/`);

              return (
                <li key={item.path} className="flex is-drawer-close:items-center justify-center">
                  <Link
                    href={item.path}
                    className={`
                      group rounded-xl transition-colors
                      w-auto

                      flex items-center

                      is-drawer-close:justify-center
                      is-drawer-open:justify-start

                      is-drawer-close:px-0
                      is-drawer-open:px-3

                      is-drawer-close:w-10
                      is-drawer-close:h-10

                      ${
                        isActive
                          ? "bg-base-200 font-medium"
                          : "hover:bg-base-200/60"
                      }

                      is-drawer-close:tooltip
                      is-drawer-close:tooltip-right
                    `}
                    data-tip={item.name}
                  >
                    <Icon className="size-5 shrink-0" />

                    <span className="is-drawer-close:hidden">
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}