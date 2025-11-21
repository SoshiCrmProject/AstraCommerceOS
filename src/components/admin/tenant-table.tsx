/**
 * Tenant Table
 */

'use client';

import { useState } from 'react';
import type { TenantSummary } from '@/lib/services/admin-types';
import { Search, Eye, UserCog, Ban } from 'lucide-react';

type TenantTableProps = {
  tenants: TenantSummary[];
  dict: any;
  onViewDetails: (tenant: TenantSummary) => void;
};

export function TenantTable({ tenants, dict, onViewDetails }: TenantTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = tenants.filter((tenant) =>
    tenant.orgName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const classes = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-red-100 text-red-700',
      trial: 'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${classes[status as keyof typeof classes]}`}>
        {dict.tenants[status]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">{dict.tenants.title}</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={dict.tenants.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.tenants.orgName}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.tenants.plan}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.tenants.status}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.tenants.orders}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.tenants.users}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.tenants.mrr}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.tenants.createdAt}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.tenants.actions}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredTenants.map((tenant) => (
            <tr key={tenant.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{tenant.orgName}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {dict.tenants.planTier[tenant.planTier]}
              </td>
              <td className="px-4 py-3">{getStatusBadge(tenant.status)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{tenant.ordersThisMonth.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{tenant.activeUsers}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                ${tenant.monthlyRevenue.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(tenant.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewDetails(tenant)}
                    className="text-blue-600 hover:text-blue-700"
                    title={dict.tenants.viewDetails}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-purple-600 hover:text-purple-700" title={dict.tenants.impersonate}>
                    <UserCog className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-700" title={dict.tenants.suspend}>
                    <Ban className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
