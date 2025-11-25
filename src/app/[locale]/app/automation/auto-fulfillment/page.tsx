/**

// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

 * Auto-Fulfillment & Amazon Auto-Purchase Page
 * Complete multi-marketplace automated order fulfillment system with browser automation
 */

import { type Locale } from '@/i18n/config';
import { getAppDictionary } from '@/i18n/getAppDictionary';
import { PageHeader } from '@/components/app/page-header';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { AutoFulfillmentService } from '@/lib/services/auto-fulfillment.service';
import { ChannelService } from '@/lib/services/channel.service';
import { RiskWarning } from '@/components/auto-fulfillment/risk-warning';
import { SummaryCards } from '@/components/auto-fulfillment/summary-cards';
import { ConfigPanel } from '@/components/auto-fulfillment/config-panel';
import { CandidatesTable } from '@/components/auto-fulfillment/candidates-table';
import { AutoFulfillmentActions } from './client-actions';

type AutoFulfillmentPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AutoFulfillmentPage(props: AutoFulfillmentPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const commonDict = await getAppDictionary(params.locale);

  // Get authenticated user and org
  const user = await getUserWithOrg();
  if (!user.currentOrgId) {
    throw new Error('No organization selected');
  }

  const orgId = user.currentOrgId;

  // Fetch real data from database
  const [config, stats, jobs, channels] = await Promise.all([
    AutoFulfillmentService.getConfig(orgId),
    AutoFulfillmentService.getStats(orgId),
    AutoFulfillmentService.getJobs(orgId, { take: 20 }),
    ChannelService.getChannels(orgId),
  ]);

  // Mock dict for now - should come from i18n
  const dict = {
    title: 'Auto-Fulfillment',
    subtitle: 'Automated order fulfillment across marketplaces',
    actions: {
      viewLogs: 'View Logs',
      exportFailed: 'Export Failed',
    },
    warning: {
      title: 'Risk Warning',
      message: 'Automated purchasing involves financial risk. Monitor carefully.',
    },
    table: {
      title: 'Fulfillment Candidates',
    },
  };

  const summary = {
    totalProcessed: stats.total || 0,
    successRate: stats.successRate || 0,
    avgProcessingTime: 0,
    pendingJobs: stats.pending || 0,
    totalCandidates: stats.total || 0,
    eligible: stats.completed || 0,
    skipped: stats.failed || 0,
    queued: stats.pending || 0,
    processing: 0,
    completed: stats.completed || 0,
    succeeded: stats.completed || 0,
    failed: stats.failed || 0,
    totalProfit: stats.totalProfit || 0,
    totalExpectedProfit: stats.totalProfit || 0,
    averageProfit: stats.totalProfit / (stats.completed || 1),
  };

  const candidates = jobs.jobs.map((job: any) => ({
    id: job.id,
    orderId: job.orderId,
    status: job.status,
    createdAt: job.createdAt,
    orgId: orgId,
    marketplaceOrderId: job.orderId,
    marketplace: 'shopee',
    shopId: '',
    lineItemSku: '',
    productName: '',
    quantity: 1,
    salePrice: 0,
    amazonAsin: '',
    amazonTitle: '',
    amazonPrice: 0,
    estimatedFees: 0,
    shippingCost: 0,
    amazonPoints: 0,
    expectedProfit: 0,
    expectedDeliveryDays: 0,
    isEligible: true,
    ineligibleReason: null,
    profitMargin: 0,
    metadata: {},
  }));

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <PageHeader
        title={dict.title}
        subtitle={dict.subtitle}
        actions={
          <AutoFulfillmentActions dict={dict} orgId={orgId} />
        }
      />

      {/* Risk Warning */}
      <RiskWarning dict={dict} />

      {/* Summary Cards */}
      <SummaryCards summary={summary} dict={dict} />

      {/* Configuration Panel */}
      <ConfigPanel
        initialConfig={(config || {
          enabled: false,
          sourceChannels: [],
          targetMarketplace: 'amazon',
          minProfitAmount: 0,
          maxDeliveryDays: 7,
          includePoints: false,
          includeShippingCost: true,
          autoRetry: true,
          maxRetries: 3,
        }) as any}
        dict={dict}
        onSave={async (newConfig) => {
          'use server';
          const { saveConfigAction } = await import('./actions');
          await saveConfigAction(orgId, newConfig);
        }}
      />

      {/* Candidates Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{dict.table.title}</h2>
        <CandidatesTable candidates={candidates as any} dict={dict} locale={params.locale} />
      </div>
    </div>
  );
}
