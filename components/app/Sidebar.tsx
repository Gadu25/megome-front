"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoFull, LogoSmall } from "../common/Logo";

import {
  HomeIcon,
  WindowIcon,
  CodeBracketIcon,
  BookOpenIcon,
  KeyIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

type Item = {
  name: string;
  path: string;
  icon: any;
  children?: Item[];
};

export default function Sidebar() {
  const pathname = usePathname() ?? "";

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
    {
      name: "API",
      path: "#",
      icon: CodeBracketIcon,
      children: [
        {
          name: "API Intro",
          path: "/api/intro",
          icon: InformationCircleIcon,
        },
        {
          name: "Personal Tokens",
          path: "/api/tokens",
          icon: KeyIcon,
        },
        // {
        //   name: "API Reference",
        //   path: "/api/reference",
        //   icon: BookOpenIcon,
        // },
      ],
    }
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

              const hasChild = !!item.children?.length;

              return (
                <li key={item.path}>
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`
                      flex items-center gap-3 rounded-xl px-3 py-2 transition-colors
                      
                      is-drawer-close:justify-center
                      is-drawer-close:px-0
                      is-drawer-close:w-10
                      is-drawer-close:h-10

                      ${
                        isActive
                          ? "bg-base-200 font-medium"
                          : "hover:bg-base-200/60"
                      }

                      ${hasChild ? "is-drawer-close:hidden" : ""}

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

                  {item.children && (
                    <>
                      <ul className="ml-6 mt-1 space-y-1 is-drawer-close:hidden">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;

                          const childActive =
                            pathname === child.path ||
                            pathname.startsWith(`${child.path}/`);

                          return (
                            <li key={child.path}>
                              <Link
                                href={child.path}
                                className={`
                                  flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors

                                  ${
                                    childActive
                                      ? "bg-base-200 font-medium"
                                      : "hover:bg-base-200/50"
                                  }
                                `}
                              >
                                <ChildIcon className="size-4 shrink-0" />

                                <span>{child.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = pathname === child.path || pathname.startsWith(`${child.path}/`);
                        
                        return (
                          <Link
                            key={child.path}
                            href={child.path}
                            className={`
                              flex items-center gap-3 rounded-xl px-3 py-2 transition-colors

                              hidden
                              is-drawer-close:block
                              is-drawer-close:justify-center

                              ${
                                childActive
                                  ? "bg-base-200 font-medium"
                                  : "hover:bg-base-200/60"
                              }

                              is-drawer-close:tooltip
                              is-drawer-close:tooltip-right
                            `}
                            data-tip={child.name}
                          >
                            <ChildIcon className="size-5 shrink-0" />
                          </Link>
                        );
                      })}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}