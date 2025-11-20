"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Locale } from "@/i18n/config";
import { LocaleSwitcher } from "@/components/marketing/locale-switcher";

type TopbarProps = {
  locale: Locale;
  searchPlaceholder: string;
  pageTitle?: string;
  navLanguageLabels: { en: string; ja: string };
};

const mockNotifications = ["Sync completed for Amazon JP", "2 automations paused"];

export function Topbar({
  locale,
  searchPlaceholder,
  pageTitle,
  navLanguageLabels,
}: TopbarProps) {
  const [query, setQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const quickHits = useMemo(
    () =>
      mockNotifications.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <header className="sticky top-0 z-30 w-full border-b border-default bg-surface/90 backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="grid h-10 w-10 place-items-center rounded-card border border-default text-muted transition hover:text-primary lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search bar */}
        <div className="relative flex flex-1 items-center gap-3 rounded-card border border-default bg-white px-3 py-2 shadow-soft">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-4 w-4 text-muted sm:h-5 sm:w-5"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 border-none bg-transparent text-sm text-primary outline-none placeholder:text-muted"
          />
          {query && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-card border border-default bg-white shadow-token-md">
              {quickHits.length === 0 ? (
                <p className="px-3 py-2 text-sm text-secondary">No matches</p>
              ) : (
                quickHits.map((hit) => (
                  <p key={hit} className="px-3 py-2 text-sm text-secondary">
                    {hit}
                  </p>
                ))
              )}
            </div>
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex lg:gap-3">
          <Link
            href="#"
            className="grid h-8 w-8 place-items-center rounded-card border border-default text-muted transition hover:text-primary hover-shadow-soft lg:h-10 lg:w-10"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4 lg:h-5 lg:w-5"
              aria-hidden
            >
              <path d="M12 6a4 4 0 0 1 4 4v3.5l1.5 1.5v1H6.5v-1L8 13.5V10a4 4 0 0 1 4-4Z" />
              <path d="M10 19a2 2 0 0 0 4 0" />
            </svg>
          </Link>
          <Link
            href="#"
            className="grid h-8 w-8 place-items-center rounded-card border border-default text-muted transition hover:text-primary hover-shadow-soft lg:h-10 lg:w-10"
            aria-label="Help"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4 lg:h-5 lg:w-5"
              aria-hidden
            >
              <path d="M12 17h.01" strokeLinecap="round" />
              <path
                d="M12 13.5V13a2 2 0 1 1 2-2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </Link>
          <LocaleSwitcher locale={locale} labels={navLanguageLabels} />
        </div>

        {/* User profile - always visible */}
        <div className="flex items-center gap-2 rounded-pill border border-default bg-surface px-2 py-1 shadow-soft sm:px-3 sm:py-2">
          <span className="h-6 w-6 rounded-full bg-accent-primary-soft text-center text-xs font-semibold text-accent-primary leading-6 sm:h-8 sm:w-8 sm:text-sm sm:leading-8">
            {pageTitle ? pageTitle.charAt(0) : "A"}
          </span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-primary">Astra User</span>
            <span className="text-xs text-muted">Owner</span>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {showMobileMenu && (
        <div className="absolute left-0 right-0 top-full z-20 border-b border-default bg-surface/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-around p-4">
            <Link href="#" className="flex flex-col items-center gap-1 text-muted">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5" />
              </svg>
              <span className="text-xs">Notifications</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1 text-muted">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">Help</span>
            </Link>
            <LocaleSwitcher locale={locale} labels={navLanguageLabels} />
          </div>
        </div>
      )}
    </header>
  );
}
