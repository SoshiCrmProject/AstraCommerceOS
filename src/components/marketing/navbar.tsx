"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n/config";
import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";
import { LocaleSwitcher } from "./locale-switcher";

type NavbarProps = {
  locale: Locale;
  nav: MarketingDictionary["nav"];
};

export function Navbar({ locale, nav }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("#hero");
  const pathname = usePathname();

  const navItems = useMemo(
    () =>
      [
        { key: "features", href: `/${locale}#features` },
        { key: "pricing", href: `/${locale}/pricing` },
        { key: "caseStudies", href: `/${locale}/case-studies` },
        { key: "docs", href: `/${locale}/docs` },
        { key: "blog", href: `/${locale}/blog` },
      ] as const,
    [locale],
  );

  useEffect(() => {
    const handleHash = () => {
      setActiveHash(window.location.hash || "#hero");
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const isActive = (href: string) => {
    const [cleanHref, hash] = href.split("#");
    if (hash) {
      return activeHash === `#${hash}`;
    }
    if (!pathname) return false;
    return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-default bg-surface/95 backdrop-blur">
      <div className="container-shell">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-3"
            aria-label="AstraCommerce OS home"
            aria-current="page"
          >
            <span className="grid h-11 w-11 place-items-center rounded-card border border-accent-primary bg-accent-primary-soft text-accent-primary shadow-soft transition duration-150 hover-shadow-soft">
              <Image
                src="/branding/logo-mark.svg"
                alt="AstraCommerce OS logo"
                width={32}
                height={32}
                priority
              />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-secondary">
                AstraCommerce
              </span>
              <span className="text-lg font-semibold text-primary">
                AstraCommerce OS
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`rounded-pill px-3 py-2 text-sm font-semibold transition ${active ? "border border-accent-primary bg-accent-primary-soft text-primary shadow-soft" : "text-secondary hover:bg-accent-primary-soft hover:text-primary"}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    const [, hash] = item.href.split("#");
                    if (hash) {
                      setActiveHash(`#${hash}`);
                    }
                  }}
                >
                  {nav[item.key]}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LocaleSwitcher
              locale={locale}
              labels={{ en: nav.languageEn, ja: nav.languageJa }}
              className="text-sm"
            />
            <Link
              href={`/${locale}/sign-in`}
              className="rounded-pill border border-default px-4 py-2 text-sm font-semibold text-primary transition hover:border-accent-primary hover:bg-accent-primary-soft"
            >
              {nav.login}
            </Link>
            <Link
              href={`/${locale}/sign-up`}
              className="rounded-pill bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
            >
              {nav.startTrial}
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-card border border-default text-primary transition hover:bg-accent-primary-soft lg:hidden"
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M18 6 6 18" strokeLinecap="round" />
                <path d="M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M4 6h16" strokeLinecap="round" />
                <path d="M4 12h16" strokeLinecap="round" />
                <path d="M4 18h12" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`lg:hidden ${open ? "max-h-[520px]" : "max-h-0"} overflow-hidden border-t border-default transition-[max-height] duration-300 ease-out`}
        >
          <div className="flex flex-col gap-4 py-4">
            <nav className="grid gap-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-base font-semibold ${active ? "border border-accent-primary bg-accent-primary-soft text-primary shadow-soft" : "text-primary hover:bg-accent-primary-soft"}`}
                  onClick={() => {
                    const [, hash] = item.href.split("#");
                    if (hash) {
                      setActiveHash(`#${hash}`);
                    }
                    setOpen(false);
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {nav[item.key]}
                </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              <LocaleSwitcher
                locale={locale}
                labels={{ en: nav.languageEn, ja: nav.languageJa }}
                className="flex-1"
              />
              <Link
                href={`/${locale}/sign-in`}
                className="flex-1 rounded-xl border border-default px-3 py-2 text-center text-sm font-semibold text-primary hover:border-accent-primary hover:bg-accent-primary-soft"
                onClick={() => setOpen(false)}
              >
                {nav.login}
              </Link>
              <Link
                href={`/${locale}/sign-up`}
                className="flex-1 rounded-xl bg-accent-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-soft hover-shadow-strong"
                onClick={() => setOpen(false)}
              >
                {nav.startTrial}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
