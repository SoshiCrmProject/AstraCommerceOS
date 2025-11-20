import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { getDashboardDictionary } from "@/i18n/getDashboardDictionary";
import { PageHeader } from "@/components/app/page-header";
import { mockUser } from "@/lib/mocks/mock-user";
import { DashboardService } from "@/lib/services/dashboard-service";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SystemHealth } from "@/components/dashboard/system-health";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { SkuInsights } from "@/components/dashboard/sku-insights";
import { AutomationAiSummary } from "@/components/dashboard/automation-ai";
import { ReviewsCard } from "@/components/dashboard/reviews-card";
import Link from "next/link";
import { revalidatePath } from "next/cache";

type DashboardPageProps = {
  params: Promise<{ locale: Locale }>;
};

async function refreshAction(locale: Locale) {
  "use server";
  revalidatePath(`/${locale}/app`);
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const commonDict = await getAppDictionary(locale);
  const dashDict = await getDashboardDictionary(locale);

  const snapshot = await DashboardService.getDashboardSnapshot({
    orgId: "demo-org",
    locale,
  });

  const kpiCards = [
    {
      label: dashDict.kpis.revenue24h,
      value: `$${(snapshot.kpis.revenue24h / 1000).toFixed(1)}k`,
      change: "+6.1%",
      direction: "up" as const,
    },
    {
      label: dashDict.kpis.netProfit7d,
      value: `$${(snapshot.kpis.netProfit7d / 1000).toFixed(1)}k`,
      change: "+3.8%",
      direction: "up" as const,
    },
    {
      label: dashDict.kpis.orders24h,
      value: snapshot.kpis.orders24h.toLocaleString(),
      change: "+4.3%",
      direction: "up" as const,
    },
    {
      label: dashDict.kpis.avgOrderValue,
      value: `$${snapshot.kpis.avgOrderValue.toFixed(2)}`,
      change: "+1.1%",
      direction: "up" as const,
    },
    {
      label: dashDict.kpis.buyBoxShare,
      value: `${snapshot.kpis.buyBoxShare}%`,
      change: "+0.4%",
      direction: "up" as const,
    },
    {
      label: dashDict.kpis.fulfillmentSla,
      value: `${snapshot.kpis.fulfillmentSla}%`,
      change: "+0.5%",
      direction: "up" as const,
    },
  ];

  const readinessMetrics = [
    {
      label: dashDict.kpis.fulfillmentSla,
      value: `${snapshot.kpis.fulfillmentSla}%`,
      change: "+0.5%",
    },
    {
      label: "Incidents auto-resolved",
      value: "842",
      change: "+18%",
    },
    {
      label: "Avg recovery time",
      value: "14 min",
      change: "-24%",
    },
  ];

  const healthBadges = [
    { label: "APIs connected", status: "HEALTHY" as const, description: "All channels authenticated" },
    { label: "Automation engine", status: "WARNING" as const, description: "2 rules paused" },
    { label: "Order sync", status: "HEALTHY" as const, description: "Last sync 4m ago" },
    { label: "Fulfillment sync", status: "ERROR" as const, description: "Carrier latency detected" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dashDict.title}
        subtitle={dashDict.subtitle}
        breadcrumbs={[
          { label: commonDict.common.breadcrumbs.home, href: `/${locale}/app` },
          { label: dashDict.title },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <form action={refreshAction.bind(null, locale)}>
              <button className="btn btn-secondary text-xs sm:text-sm" type="submit">
                {dashDict.actions.refresh}
              </button>
            </form>
            <Link href={`/${locale}/app/ai`} className="btn btn-primary text-xs sm:text-sm">
              {dashDict.actions.openAiCopilot}
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-secondary">
                {commonDict.common.welcome.replace("{{name}}", mockUser.name)}
              </p>
              <p className="text-xs text-muted">{dashDict.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[dashDict.filters.today, dashDict.filters.last7, dashDict.filters.last30, dashDict.filters.custom].map(
                (filter) => (
                  <button
                    key={filter}
                    className="rounded-pill border border-default px-2 py-1 text-xs font-semibold text-primary transition hover:bg-accent-primary-soft sm:px-3"
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="mt-4">
            <KpiStrip kpis={kpiCards} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-primary">{dashDict.sections.timeline}</p>
            <div className="flex flex-wrap items-center gap-2">
              <button className="rounded-pill border border-default px-2 py-1 text-xs font-semibold text-primary sm:px-3">
                {dashDict.timeline.channelAll}
              </button>
              <Link href={`/${locale}/app/analytics`} className="text-xs font-semibold text-accent-primary hover:underline">
                {dashDict.actions.viewAllAlerts}
              </Link>
            </div>
          </div>
          <div className="mt-3">
            <RevenueChart data={snapshot.revenueSeries} />
          </div>
        </div>

        <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg space-y-3 sm:p-5">
          <p className="text-sm font-semibold text-primary">{dashDict.sections.systemHealth}</p>
          <SystemHealth channels={snapshot.channels} healthBadges={healthBadges} locale={locale} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">{dashDict.sections.skuInsights}</p>
          <SkuInsights skus={snapshot.topSkus} locale={locale} />
        </div>
        <div className="space-y-4">
          <p className="text-sm font-semibold text-primary">{dashDict.sections.alerts}</p>
          <AlertsPanel
            alerts={snapshot.alerts}
            locale={locale}
            viewAllLabel={dashDict.actions.viewAllAlerts}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <AutomationAiSummary
          automation={snapshot.automation}
          aiSummary="Copilot suggests repricing 12 SKUs and expediting inbound for 8 SKUs in JP."
          locale={locale}
          automationCta={dashDict.actions.openAutomation}
          aiCta={dashDict.actions.openAiCopilot}
        />
        <ReviewsCard
          reviews={snapshot.reviews}
          locale={locale}
          ctaLabel={dashDict.actions.openReviews}
        />
      </div>

      <div className="rounded-panel border border-default bg-surface p-4 shadow-token-lg sm:p-5">
        <p className="text-sm font-semibold text-primary">Operational readiness</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {readinessMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-card border border-default bg-surface-muted p-3 shadow-soft sm:p-4"
            >
              <p className="text-xs uppercase tracking-wide text-muted">{metric.label}</p>
              <p className="text-lg font-semibold text-primary sm:text-xl">{metric.value}</p>
              <p className="text-xs text-accent-success">{metric.change}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
