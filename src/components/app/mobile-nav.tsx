"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n/config";

type MobileNavProps = {
  locale: Locale;
};

const tabs = [
  { key: "dashboard", label: "Home", href: "/app", icon: "🏠" },
  { key: "channels", label: "Channels", href: "/app/channels", icon: "🛠️" },
  { key: "listings", label: "Listings", href: "/app/listings", icon: "📋" },
  { key: "ai", label: "Copilot", href: "/app/ai", icon: "🤖" },
  { key: "settings", label: "Settings", href: "/app/settings", icon: "⚙️" }
];

export function MobileNav({ locale }: MobileNavProps) {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-default bg-surface/95 backdrop-blur lg:hidden">
      {tabs.map((tab) => {
        const href = `/${locale}${tab.href}`;
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={tab.key}
            href={href}
            className={`flex flex-col items-center justify-center py-2 px-1 text-xs font-semibold transition-colors ${
              active ? "text-accent-primary bg-accent-primary-soft" : "text-secondary hover:text-primary"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <span aria-hidden className="text-base mb-1">
              {tab.icon}
            </span>
            <span className="truncate">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
