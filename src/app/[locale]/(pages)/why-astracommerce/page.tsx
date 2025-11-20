import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type WhyPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: WhyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — 選ばれる理由" : "AstraCommerce OS — Why Astra",
    description: isJa
      ? "マルチリージョンのエンタープライズに求められるガバナンスとスピードを両立します。"
      : "Combining governance and speed for multi-region enterprise operations.",
  };
}

export default async function WhyPage({ params }: WhyPageProps) {
  const { locale } = await params;
  const siteDict = await getSiteDictionary(locale);
  const marketingDict = await getMarketingDictionary(locale);
  const { why } = siteDict;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {marketingDict.hero.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
            {why.title}
          </h1>
          <p className="text-lg text-secondary">{why.subtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {why.pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-card border border-default bg-surface p-6 shadow-soft"
            >
              <h2 className="text-lg font-semibold text-primary">{pillar.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-secondary">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-secondary" />
                    <span>{point}</span>
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
