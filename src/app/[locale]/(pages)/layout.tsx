import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { type Locale } from "@/i18n/config";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";

type PagesLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export default async function PagesLayout({ children, params }: PagesLayoutProps) {
  const { locale } = await params;
  const dictionary = await getMarketingDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Navbar locale={locale} nav={dictionary.nav} />
      <main className="flex-1 bg-page">{children}</main>
      <Footer
        locale={locale}
        footer={dictionary.footer}
        languageLabels={{ en: dictionary.nav.languageEn, ja: dictionary.nav.languageJa }}
      />
    </div>
  );
}
