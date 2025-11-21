import { ReactNode } from "react";
import { Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { MobileNav } from "@/components/app/mobile-nav";
import { mockUser } from "@/lib/mocks/mock-user";

type AppLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { locale } = await params;
  const appDict = await getAppDictionary(locale as Locale);

  const navItems = [
    { key: "dashboard", label: appDict.nav.dashboard, href: `/${locale}/app` },
    { key: "channels", label: appDict.nav.channels, href: `/${locale}/app/channels` },
    { key: "products", label: appDict.nav.products, href: `/${locale}/app/products` },
    { key: "listings", label: appDict.nav.listings, href: `/${locale}/app/listings` },
    { key: "inventory", label: appDict.nav.inventory, href: `/${locale}/app/inventory` },
    { key: "orders", label: appDict.nav.orders, href: `/${locale}/app/orders` },
    { key: "pricing", label: appDict.nav.pricing, href: `/${locale}/app/pricing` },
    { key: "automation", label: appDict.nav.automation, href: `/${locale}/app/automation` },
    { key: "ai", label: appDict.nav.ai, href: `/${locale}/app/ai` },
    { key: "reviews", label: appDict.nav.reviews, href: `/${locale}/app/reviews` },
    { key: "analytics", label: appDict.nav.analytics, href: `/${locale}/app/analytics` },
    { key: "logs", label: appDict.nav.logs, href: `/${locale}/app/logs` },
    { key: "settings", label: appDict.nav.settings, href: `/${locale}/app/settings` },
    { key: "admin", label: appDict.nav.admin, href: `/${locale}/app/admin`, adminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-shell)]">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <Sidebar locale={locale as Locale} navItems={navItems} role={mockUser.role} />
        <div className="relative flex min-h-screen flex-1 flex-col bg-[var(--bg-app)]">
          <Topbar
            locale={locale as Locale}
            searchPlaceholder={appDict.common.searchPlaceholder}
            pageTitle={appDict.dashboard.title}
            navLanguageLabels={{ en: "EN", ja: "日本語" }}
          />
          <main className="flex-1 px-3 pb-20 pt-4 sm:px-4 sm:pt-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
      <MobileNav locale={locale as Locale} />
    </div>
  );
}
