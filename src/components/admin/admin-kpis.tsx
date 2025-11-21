/**
 * Admin KPIs - Top-level metrics
 */

'use client';

import { Users, Activity, DollarSign, Server } from 'lucide-react';

type AdminKpisProps = {
  totalTenants: number;
  activeTenants: number;
  totalRevenue: number;
  systemUptime: number;
  dict: any;
};

export function AdminKpis({
  totalTenants,
  activeTenants,
  totalRevenue,
  systemUptime,
  dict,
}: AdminKpisProps) {
  const kpis = [
    {
      label: dict.kpis.totalTenants,
      value: totalTenants.toString(),
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: dict.kpis.activeTenants,
      value: activeTenants.toString(),
      icon: <Activity className="w-5 h-5" />,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: dict.kpis.totalRevenue,
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: dict.kpis.systemUptime,
      value: `${systemUptime}%`,
      icon: <Server className="w-5 h-5" />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-lg ${kpi.bg}`}>
              <div className={kpi.color}>{kpi.icon}</div>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          <p className="text-sm text-gray-600 mt-1">{kpi.label}</p>
        </div>
      ))}
    </div>
  );
}
