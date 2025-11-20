import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { type Locale } from "@/i18n/config";
import { getMarketingDictionary } from "@/i18n/getMarketingDictionary";

type AuthLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;
  const dict = await getMarketingDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Navbar locale={locale} nav={dict.nav} />
      <main className="flex-1 bg-section py-16">
        <div className="container-shell">{children}</div>
      </main>
      <Footer
        locale={locale}
        footer={dict.footer}
        languageLabels={{ en: dict.nav.languageEn, ja: dict.nav.languageJa }}
      />
    </div>
  );
}
