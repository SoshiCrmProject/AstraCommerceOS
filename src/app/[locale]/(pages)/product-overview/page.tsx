import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type ProductOverviewPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: ProductOverviewPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — プロダクト概要" : "AstraCommerce OS — Product Overview",
    description: isJa
      ? "コマンドセンター、自動化エンジン、APIとコネクタについての概要。"
      : "Overview of the command center, automation engine, and APIs/connectors.",
  };
}

export default async function ProductOverviewPage({
  params,
}: ProductOverviewPageProps) {
  const { locale } = await params;
  const siteDict = await getSiteDictionary(locale);
  const marketingDict = await getMarketingDictionary(locale);
  const { product } = siteDict;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {marketingDict.hero.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
            {product.title}
          </h1>
          <p className="text-lg text-secondary">{product.subtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {product.sections.map((section) => (
            <div
              key={section.title}
              className="rounded-card border border-default bg-surface p-6 shadow-token-lg"
            >
              <h2 className="text-lg font-semibold text-primary">{section.title}</h2>
              <p className="mt-2 text-sm text-secondary">{section.body}</p>
              <ul className="mt-3 space-y-2 text-sm text-secondary">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-secondary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
