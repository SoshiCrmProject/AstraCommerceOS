import { type Metadata } from "next";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type PricingPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  const title = isJa
    ? "AstraCommerce OS — 料金プラン"
    : "AstraCommerce OS — Pricing";
  const description = isJa
    ? "マルチマーケットプレイス運営のための透明な料金プランとSLA。"
    : "Transparent plans and SLAs for multi-marketplace operations.";
  return {
    title,
    description,
  };
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  const siteDict = await getSiteDictionary(locale);
  const marketingDict = await getMarketingDictionary(locale);
  const { pricing } = siteDict;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {marketingDict.hero.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
            {pricing.title}
          </h1>
          <p className="text-lg text-secondary">{pricing.subtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pricing.plans.map((plan) => (
            <div
              key={plan.name}
              className="flex h-full flex-col gap-4 rounded-card border border-default bg-surface p-6 shadow-token-lg"
            >
              <div className="space-y-2">
                <p className="text-sm font-semibold text-accent-primary">{plan.name}</p>
                <p className="text-3xl font-semibold text-primary">{plan.price}</p>
                <p className="text-sm text-secondary">{plan.description}</p>
              </div>
              <ul className="flex-1 space-y-2 text-sm text-secondary">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent-primary-soft text-[10px] font-bold text-accent-primary">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="#start-trial"
                className="rounded-pill bg-accent-primary px-4 py-2 text-center text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="grid gap-6 rounded-card border border-default bg-surface p-8 shadow-token-lg md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-xl font-semibold text-primary">{pricing.ctaTitle}</p>
            <p className="text-secondary">{pricing.ctaSubtitle}</p>
          </div>
          <div className="md:col-span-3">
            <div className="grid gap-4 md:grid-cols-3">
              {pricing.faqs.map((faq) => (
                <div key={faq.q} className="rounded-card border border-default bg-surface-muted p-4">
                  <p className="text-sm font-semibold text-primary">{faq.q}</p>
                  <p className="mt-2 text-sm text-secondary">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
