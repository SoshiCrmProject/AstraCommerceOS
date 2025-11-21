import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { type Locale } from "@/i18n/config";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";

type MarketingLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MarketingLayout({
  children,
  params,
}: MarketingLayoutProps) {
  const { locale } = await params;
  const dict = await getMarketingDictionary(locale as Locale);

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Navbar locale={locale as Locale} nav={dict.nav} />
      <main className="flex-1">{children}</main>
      <Footer
        locale={locale as Locale}
        footer={dict.footer}
        languageLabels={{ en: dict.nav.languageEn, ja: dict.nav.languageJa }}
      />
    </div>
  );
}
