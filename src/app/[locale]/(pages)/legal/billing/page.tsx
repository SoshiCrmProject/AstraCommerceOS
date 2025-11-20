import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 3600;

type BillingPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: BillingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ja" ? "課金ポリシー | AstraCommerce OS" : "Billing Agreement | AstraCommerce OS",
  };
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { locale } = await params;
  const dict = await getSiteDictionary(locale);
  const content = dict.legal.billing;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-6">
        <h1 className="text-4xl font-semibold text-primary sm:text-5xl">{content.title}</h1>
        <p className="text-lg text-secondary">{content.intro}</p>
        <div className="space-y-3">
          {content.sections.map((section) => (
            <p key={section} className="text-sm text-secondary">
              {section}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
