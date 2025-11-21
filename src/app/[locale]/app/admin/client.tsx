/**
 * Admin Client - Main Dashboard Layout
 */

'use client';

import { useState } from 'react';
import type { AdminOverviewSnapshot, TenantSummary } from '@/lib/services/admin-types';
import { AdminKpis } from '@/components/admin/admin-kpis';
import { SystemHealthPanel } from '@/components/admin/system-health-panel';
import { JobQueuesPanel } from '@/components/admin/job-queues-panel';
import { ApiUsagePanel } from '@/components/admin/api-usage-panel';
import { TenantTable } from '@/components/admin/tenant-table';
import { TenantDetailDrawer } from '@/components/admin/tenant-detail-drawer';
import { RefreshCw } from 'lucide-react';

type AdminClientProps = {
  dict: any;
  overview: AdminOverviewSnapshot;
  tenants: TenantSummary[];
};

export function AdminClient({ dict, overview, tenants }: AdminClientProps) {
  const [selectedTenant, setSelectedTenant] = useState<TenantSummary | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{dict.title}</h1>
            <p className="text-gray-600 mt-1">{dict.subtitle}</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            <RefreshCw className="w-4 h-4" />
            {dict.common.refresh}
          </button>
        </div>

        {/* KPIs */}
        <AdminKpis
          totalTenants={overview.totalTenants}
          activeTenants={overview.activeTenants}
          totalRevenue={overview.totalMonthlyRevenue}
          systemUptime={overview.systemUptime}
          dict={dict}
        />

        {/* System Health & Job Queues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemHealthPanel metrics={overview.systemHealth} dict={dict} />
          <JobQueuesPanel queues={overview.jobQueues} dict={dict} />
        </div>

        {/* API Usage */}
        <ApiUsagePanel metrics={overview.apiUsage} dict={dict} />

        {/* Tenants */}
        <TenantTable
          tenants={tenants}
          dict={dict}
          onViewDetails={setSelectedTenant}
        />

        {/* Tenant Detail Drawer */}
        <TenantDetailDrawer
          tenant={selectedTenant}
          dict={dict}
          onClose={() => setSelectedTenant(null)}
        />
      </div>
    </div>
  );
}
