import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/hero-section";
import { KPIStrip } from "@/components/marketing/kpi-strip";
import { ValuePropGrid } from "@/components/marketing/value-prop-grid";
import { CommandCenterSection } from "@/components/marketing/command-center-section";
import { WorkflowGrid } from "@/components/marketing/workflow-grid";
import { AutomationSection } from "@/components/marketing/automation-section";
import { ArchitectureSection } from "@/components/marketing/architecture-section";
import { IntegrationsStrip } from "@/components/marketing/integrations-strip";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { type Locale } from "@/i18n/config";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.astracommerce.example";

type MarketingPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: MarketingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";
  const title = isJa
    ? "AstraCommerce OS — AI搭載グローバルコマースOS"
    : "AstraCommerce OS — AI-Powered Global Commerce Operating System";
  const description = isJa
    ? "Amazon、Shopify、Rakuten、Shopee、Walmart、eBayなど50以上のマーケットプレイスをひとつのOSで統合・自動化するエンタープライズ向けソリューション。"
    : "Unify and automate commerce operations across Amazon, Shopify, Shopee, Rakuten, Walmart, eBay, and 50+ marketplaces with an enterprise-grade OS.";
  const pageUrl = `${baseUrl}/${locale}`;
  const ogImage = `${baseUrl}/og-default.svg`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "AstraCommerce OS",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function MarketingPage({ params }: MarketingPageProps) {
  const { locale } = await params;
  const dictionary = await getMarketingDictionary(locale);

  return (
    <>
      <span id="start-trial" className="sr-only" aria-hidden />
      <span id="book-demo" className="sr-only" aria-hidden />
      <span id="login" className="sr-only" aria-hidden />
      <HeroSection hero={dictionary.hero} ui={dictionary.ui} />
      <KPIStrip kpis={dictionary.kpis} />
      <ValuePropGrid valueProps={dictionary.valueProps} />
      <CommandCenterSection
        commandCenter={dictionary.commandCenter}
        statCard={dictionary.hero.statCard}
        ui={dictionary.ui}
      />
      <WorkflowGrid workflowGrid={dictionary.workflowGrid} />
      <AutomationSection automation={dictionary.automation} ui={dictionary.ui} />
      <ArchitectureSection architecture={dictionary.architecture} ui={dictionary.ui} />
      <IntegrationsStrip integrations={dictionary.integrations} />
      <TestimonialsSection testimonials={dictionary.testimonials} />
      <FinalCta finalCta={dictionary.finalCta} />
    </>
  );
}
