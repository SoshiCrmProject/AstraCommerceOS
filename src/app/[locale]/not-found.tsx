import Link from "next/link";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";
import { getSiteLocale, getSiteDictionary } from "@/i18n/getSiteDictionary";
import { defaultLocale, type Locale } from "@/i18n/config";

export default async function LocaleNotFound({
  params,
}: {
  params?: { locale?: Locale };
}) {
  const locale = getSiteLocale(params?.locale ?? defaultLocale);
  const marketingDict = await getMarketingDictionary(locale);
  const siteDict = await getSiteDictionary(locale);

  return (
    <div className="section-shell">
      <div className="container-shell space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">
          AstraCommerce OS
        </p>
        <h1 className="text-4xl font-semibold text-primary sm:text-5xl">404</h1>
        <p className="text-secondary">
          {locale === "ja"
            ? "お探しのページが見つかりません。"
            : "The page you’re looking for does not exist."}
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="rounded-pill bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
          >
            {marketingDict.nav.features}
          </Link>
          <Link
            href={`/${locale}/docs`}
            className="rounded-pill border border-default bg-surface px-4 py-2 text-sm font-semibold text-primary"
          >
            {siteDict.docs.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
