"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { type Locale } from "@/i18n/config";

type LocaleSwitcherProps = {
  locale: Locale;
  labels: { en: string; ja: string };
  className?: string;
};

const buildPathForLocale = (pathname: string, target: Locale) => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return `/${target}`;
  }
  segments[0] = target;
  return `/${segments.join("/")}`;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export function LocaleSwitcher({
  locale,
  labels,
  className,
}: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentPath = useMemo(
    () => pathname || `/${locale}`,
    [locale, pathname],
  );

  const handleSwitch = (target: Locale) => {
    const nextPath = buildPathForLocale(currentPath, target);
    router.push(nextPath);
  };

  return (
    <div
      className={cx(
        "inline-flex items-center gap-1 rounded-pill border border-default bg-surface-muted px-1 py-1 text-sm",
        className,
      )}
      aria-label="Language selector"
    >
      <button
        type="button"
        className={cx(
          "rounded-pill px-3 py-1 transition-all",
          locale === "en"
            ? "bg-accent-primary text-white shadow-soft"
            : "text-secondary hover:bg-accent-primary-soft",
        )}
        onClick={() => handleSwitch("en")}
        aria-label={labels.en}
        aria-current={locale === "en"}
      >
        {labels.en}
      </button>
      <button
        type="button"
        className={cx(
          "rounded-pill px-3 py-1 transition-all",
          locale === "ja"
            ? "bg-accent-primary text-white shadow-soft"
            : "text-secondary hover:bg-accent-primary-soft",
        )}
        onClick={() => handleSwitch("ja")}
        aria-label={labels.ja}
        aria-current={locale === "ja"}
      >
        {labels.ja}
      </button>
    </div>
  );
}
