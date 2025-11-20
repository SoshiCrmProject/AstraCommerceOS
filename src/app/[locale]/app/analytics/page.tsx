import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { PageHeader } from "@/components/app/page-header";
import { mockAnalyticsCards } from "@/lib/mocks/mock-analytics";

type AnalyticsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { locale } = await params;
  const dict = await getAppDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.analytics.title}
        subtitle={dict.analytics.subtitle}
        breadcrumbs={[
          { label: dict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dict.analytics.title },
        ]}
        actions={<button className="btn btn-primary">{dict.common.buttons.viewAll}</button>}
      />

      <div className="rounded-panel border border-default bg-surface p-5 shadow-token-lg">
        <div className="grid gap-3 md:grid-cols-3">
          {mockAnalyticsCards.map((card) => (
            <div
              key={card.title}
              className="rounded-card border border-default bg-surface-muted p-4 shadow-soft"
            >
              <p className="text-xs uppercase tracking-wide text-muted">{card.title}</p>
              <p className="text-xl font-semibold text-primary">{card.value}</p>
              <p className="text-xs text-accent-success">{card.change}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
