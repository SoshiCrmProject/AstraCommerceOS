/**
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

  // Fetch real data from database
  const [config, stats, jobs, channels] = await Promise.all([
    AutoFulfillmentService.getConfig(user.currentOrgId),
    AutoFulfillmentService.getStats(user.currentOrgId),
    AutoFulfillmentService.getJobs(user.currentOrgId, { take: 20 }),
    ChannelService.getChannels(user.currentOrgId),
  ]);

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
        initialConfig={config}
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
        <CandidatesTable candidates={candidates} dict={dict} locale={params.locale} />
      </div>
    </div>
  );
}
