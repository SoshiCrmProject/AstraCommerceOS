import { type Metadata } from "next";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type CaseStudiesPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: CaseStudiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa ? "AstraCommerce OS — 導入事例" : "AstraCommerce OS — Case Studies",
    description: isJa
      ? "エンタープライズ事業者がAstraCommerce OSを用いてオペレーションを変革したストーリー。"
      : "How enterprise operators transform their marketplace operations with AstraCommerce OS.",
  };
}

export default async function CaseStudiesPage({ params }: CaseStudiesPageProps) {
  const { locale } = await params;
  const siteDict = await getSiteDictionary(locale);
  const marketingDict = await getMarketingDictionary(locale);
  const { caseStudies } = siteDict;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {marketingDict.hero.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
            {caseStudies.title}
          </h1>
          <p className="text-lg text-secondary">{caseStudies.subtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {caseStudies.cards.map((card) => (
            <article
              key={card.company}
              className="flex h-full flex-col gap-4 rounded-card border border-default bg-surface p-6 shadow-token-lg"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-accent-primary">{card.company}</p>
                <h2 className="text-xl font-semibold text-primary">{card.headline}</h2>
                <p className="text-sm text-accent-success">{card.result}</p>
              </div>
              <p className="text-sm text-secondary">{card.summary}</p>
              <Link
                href="#"
                className="mt-auto text-sm font-semibold text-accent-primary transition hover:translate-x-0.5"
              >
                {card.linkLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
