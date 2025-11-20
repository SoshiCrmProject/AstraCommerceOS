"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Locale } from "@/i18n/config";

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  adminOnly?: boolean;
};

type SidebarProps = {
  locale: Locale;
  navItems: NavItem[];
  role: "owner" | "admin" | "operator" | "analyst";
};

const statusDot = (
  <span className="h-2 w-2 rounded-full bg-accent-primary" aria-hidden />
);

export function Sidebar({ locale, navItems, role }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || role === "owner",
  );

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-default bg-surface px-4 py-5 shadow-token-md lg:flex">
      <Link
        href={`/${locale}/app`}
        className="flex items-center gap-3"
        aria-label="AstraCommerce OS dashboard"
      >
        <div className="grid h-11 w-11 place-items-center rounded-card border border-accent-primary bg-accent-primary-soft text-accent-primary shadow-soft">
          <Image
            src="/branding/logo-mark.svg"
            alt="AstraCommerce OS logo"
            width={28}
            height={28}
            priority
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-secondary">AstraCommerce</span>
          <span className="text-lg font-semibold text-primary">AstraCommerce OS</span>
        </div>
      </Link>

      <div className="mt-8 flex-1 space-y-1">
        {visibleItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 rounded-card px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-accent-primary-soft text-primary shadow-soft"
                  : "text-secondary hover:bg-accent-primary-soft hover:text-primary"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.icon ?? statusDot}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
