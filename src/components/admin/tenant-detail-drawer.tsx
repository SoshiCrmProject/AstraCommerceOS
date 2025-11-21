/**
 * Tenant Detail Drawer
 */

'use client';

import type { TenantSummary } from '@/lib/services/admin-types';
import { X, Building2, Mail, Globe, Calendar, Activity } from 'lucide-react';

type TenantDetailDrawerProps = {
  tenant: TenantSummary | null;
  dict: any;
  onClose: () => void;
};

export function TenantDetailDrawer({ tenant, dict, onClose }: TenantDetailDrawerProps) {
  if (!tenant) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{dict.tenantDetail.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {dict.tenantDetail.overview}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">{dict.tenantDetail.organization}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{tenant.orgName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">{dict.tenantDetail.contactEmail}</p>
                <p className="text-sm font-medium text-gray-900 mt-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  contact@{tenant.orgName.toLowerCase().replace(/\s+/g, '')}.com
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">{dict.tenantDetail.createdAt}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {new Date(tenant.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">{dict.tenantDetail.lastActive}</p>
                <p className="text-sm font-medium text-gray-900 mt-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-600" />
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{dict.tenantDetail.billing}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">{dict.tenantDetail.currentPlan}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{tenant.planTier}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">{dict.tenantDetail.monthlyRevenue}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  ${tenant.monthlyRevenue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">{dict.tenantDetail.billingCycle}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">Monthly</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">{dict.tenantDetail.nextBillingDate}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Usage */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{dict.tenantDetail.usage}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600">{dict.tenantDetail.ordersThisMonth}</p>
                  <p className="text-xs font-medium text-gray-900">
                    {tenant.ordersThisMonth.toLocaleString()} / 10,000
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(tenant.ordersThisMonth / 10000) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600">{dict.tenantDetail.activeUsers}</p>
                  <p className="text-xs font-medium text-gray-900">{tenant.activeUsers} / 10</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(tenant.activeUsers / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600">{dict.tenantDetail.storageUsed}</p>
                  <p className="text-xs font-medium text-gray-900">2.4 GB / 10 GB</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
