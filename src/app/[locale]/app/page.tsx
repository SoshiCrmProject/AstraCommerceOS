import { type Locale } from "@/i18n/config";
import { getAppDictionary } from "@/i18n/getAppDictionary";
import { getDashboardDictionary } from "@/i18n/getDashboardDictionary";
import { PageHeader } from "@/components/app/page-header";
import { getUserWithOrg } from "@/lib/supabase/auth-utils";
import { DashboardService } from "@/lib/services/dashboard.service";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SystemHealth } from "@/components/dashboard/system-health";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { SkuInsights } from "@/components/dashboard/sku-insights";
import { AutomationAiSummary } from "@/components/dashboard/automation-ai";
import { ReviewsCard } from "@/components/dashboard/reviews-card";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

type DashboardPageProps = {
  params: Promise<{ locale: Locale }>;
};

async function refreshAction(locale: Locale) {
  "use server";
  revalidatePath(`/${locale}/app`);
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  try {
    console.log('=== DASHBOARD PAGE START ===');
    const { locale } = await params;
    console.log('Locale:', locale);
    
    const commonDict = await getAppDictionary(locale);
    const dashDict = await getDashboardDictionary(locale);
    console.log('Dictionaries loaded successfully');

    // Get current user and org with error handling
    console.log('Attempting to get user with org...');
    let user;
    try {
      user = await getUserWithOrg();
      console.log('User retrieved:', user ? `User ID: ${user.id}, Org ID: ${user.currentOrgId}` : 'null');
      if (!user || !user.currentOrgId) {
        console.error('No user or organization found, redirecting to sign-in');
        redirect(`/${locale}/sign-in`);
      }
    } catch (error) {
      console.error('Authentication error in dashboard:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      redirect(`/${locale}/sign-in`);
    }

    // Get real dashboard data from database
    console.log('Fetching dashboard snapshot for org:', user.currentOrgId);
    const snapshot = await DashboardService.getDashboardSnapshot(user.currentOrgId);
    console.log('Dashboard snapshot retrieved successfully');

  const kpiCards = [
    {
      label: dashDict.kpis.revenue24h,
      value: `$${(snapshot.kpis.revenue24h / 1000).toFixed(1)}k`,
      change: snapshot.kpis.revenue24hChange,
      direction: snapshot.kpis.revenue24hChange?.startsWith('+') ? 'up' as const : 'down' as const,
    },
    {
      label: dashDict.kpis.netProfit7d,
      value: `$${(snapshot.kpis.netProfit7d / 1000).toFixed(1)}k`,
      change: snapshot.kpis.netProfit7dChange,
      direction: snapshot.kpis.netProfit7dChange?.startsWith('+') ? 'up' as const : 'down' as const,
    },
    {
      label: dashDict.kpis.orders24h,
      value: snapshot.kpis.orders24h.toLocaleString(),
      change: snapshot.kpis.orders24hChange,
      direction: snapshot.kpis.orders24hChange?.startsWith('+') ? 'up' as const : 'down' as const,
    },
    {
      label: dashDict.kpis.avgOrderValue,
      value: `$${snapshot.kpis.avgOrderValue.toFixed(2)}`,
      change: snapshot.kpis.avgOrderValueChange,
      direction: snapshot.kpis.avgOrderValueChange?.startsWith('+') ? 'up' as const : 'down' as const,
    },
    {
      label: dashDict.kpis.buyBoxShare,
      value: `${snapshot.kpis.buyBoxShare}%`,
      change: snapshot.kpis.buyBoxShareChange,
      direction: snapshot.kpis.buyBoxShareChange?.startsWith('+') ? 'up' as const : 'down' as const,
    },
    {
      label: dashDict.kpis.fulfillmentSla,
      value: `${snapshot.kpis.fulfillmentSla}%`,
      change: snapshot.kpis.fulfillmentSlaChange,
      direction: snapshot.kpis.fulfillmentSlaChange?.startsWith('+') ? 'up' as const : 'down' as const,
    },
  ];

  const readinessMetrics = [
    {
      label: dashDict.kpis.fulfillmentSla,
      value: `${snapshot.kpis.fulfillmentSla}%`,
      change: snapshot.kpis.fulfillmentSlaChange || '+0.5%',
    },
    {
      label: "Incidents auto-resolved",
      value: snapshot.automation.totalExecutions.toLocaleString(),
      change: "+18%",
    },
    {
      label: "Avg recovery time",
      value: "14 min",
      change: "-24%",
    },
  ];

  // Map channel health
  const healthBadges = snapshot.channels.map((ch) => ({
    label: ch.name,
    status: ch.status,
    description: ch.health === 'healthy' ? 'HEALTHY' : ch.health === 'degraded' ? 'WARNING' : 'ERROR',
  }));

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
                {commonDict.common.welcome.replace("{{name}}", user.name || 'User')}
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
  } catch (error) {
    console.error('=== DASHBOARD PAGE ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Re-throw to show in UI
    throw new Error(`Dashboard error: ${error instanceof Error ? error.message : String(error)}`);
  }
}
