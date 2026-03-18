import Link from "next/link";
import { LogoFull, LogoSmall } from "../common/Logo";
import { HomeIcon, WindowIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { SVGProps } from "react";

type item = {
  name: string;
  path: string;
  icon: any;
}

export default function Sidebar() {
  const menu: item[] = [
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
    {
      name: "Settings",
      path: "/settings",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
      <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
        <div className="is-drawer-close:hidden w-full px-4 pt-4 pb-6">
          <LogoFull/>
        </div>
        <div className="is-drawer-open:hidden w-full px-2 pt-4 pb-6 text-center">
          <LogoSmall/>
        </div>

        <ul className="menu w-full grow gap-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip={item.name}
                >
                  <Icon className="size-5" />
                  <span className="is-drawer-close:hidden">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  )
} 