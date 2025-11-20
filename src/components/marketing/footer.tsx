import Link from "next/link";
import { Locale } from "@/i18n/config";
import { type MarketingDictionary } from "@/i18n/getMarketingDictionary";
import { LocaleSwitcher } from "./locale-switcher";

type FooterProps = {
  locale: Locale;
  footer: MarketingDictionary["footer"];
  languageLabels: { en: string; ja: string };
};

export function Footer({ locale, footer, languageLabels }: FooterProps) {
  const columns = [
    footer.product,
    footer.solutions,
    footer.resources,
    footer.company,
    footer.legal,
  ];

  return (
    <footer className="border-t border-default bg-surface pb-10 pt-12">
      <span id="blog" className="sr-only" aria-hidden />
      <div className="container-shell">
        <div className="grid gap-4 md:hidden">
          {columns.map((column) => (
            <details
              key={column.title}
              className="rounded-card border border-default bg-surface px-4 py-3"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-primary">
                {column.title}
                <span aria-hidden className="text-muted">
                  ▾
                </span>
              </summary>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-secondary">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition hover:text-primary hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="hidden gap-10 md:grid md:grid-cols-2 lg:grid-cols-5">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-primary">
                {column.title}
              </p>
              <ul className="flex flex-col gap-2 text-sm text-secondary">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition hover:text-primary hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-default pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">{footer.copyright}</p>
          <LocaleSwitcher
            locale={locale}
            labels={languageLabels}
            className="self-start"
          />
        </div>
      </div>
    </footer>
  );
}
