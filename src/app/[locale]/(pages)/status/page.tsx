import { type Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/getSiteDictionary";

export const dynamic = "force-static";
export const revalidate = 300;

type StatusPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: StatusPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ja" ? "システムステータス | AstraCommerce OS" : "System Status | AstraCommerce OS",
  };
}

export default async function StatusPage({ params }: StatusPageProps) {
  const { locale } = await params;
  const dict = await getSiteDictionary(locale);
  const status = dict.status;

  return (
    <div className="section-shell">
      <div className="container-shell space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">{status.title}</h1>
          <p className="text-lg text-secondary">{status.subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(status.uptime).map(([key, value]) => (
            <div
              key={key}
              className="rounded-card border border-default bg-surface p-5 shadow-soft"
            >
              <p className="text-sm font-semibold text-primary capitalize">{key}</p>
              <p className="text-sm text-secondary">{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-card border border-default bg-surface p-6 shadow-token-lg">
          <p className="text-sm text-primary">{status.incidents}</p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 rounded-pill bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
            aria-label={status.cta}
          >
            {status.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
