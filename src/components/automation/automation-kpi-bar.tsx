'use client';

import { Zap, Activity, AlertCircle, DollarSign, Package } from 'lucide-react';
import type { AutomationKpiSnapshot } from '@/lib/services/automation-types';

type Props = { kpis: AutomationKpiSnapshot };

export function AutomationKpiBar({ kpis }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-surface rounded-card p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="text-xs text-gray-600 mb-1">Active Workflows</div>
        <div className="text-2xl font-bold text-gray-900">{kpis.activeWorkflows}</div>
      </div>
      <div className="bg-surface rounded-card p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Activity className="w-4 h-4 text-green-600" />
          </div>
        </div>
        <div className="text-xs text-gray-600 mb-1">Runs (24h)</div>
        <div className="text-2xl font-bold text-gray-900">{kpis.runsLast24h}</div>
      </div>
      <div className="bg-surface rounded-card p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
        </div>
        <div className="text-xs text-gray-600 mb-1">Failures (24h)</div>
        <div className="text-2xl font-bold text-red-600">{kpis.failuresLast24h}</div>
      </div>
      <div className="bg-surface rounded-card p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
        </div>
        <div className="text-xs text-gray-600 mb-1">Pricing Automations</div>
        <div className="text-2xl font-bold text-gray-900">{kpis.pricingAutomations}</div>
      </div>
      <div className="bg-surface rounded-card p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <Package className="w-4 h-4 text-orange-600" />
          </div>
        </div>
        <div className="text-xs text-gray-600 mb-1">Inventory Automations</div>
        <div className="text-2xl font-bold text-gray-900">{kpis.inventoryAutomations}</div>
      </div>
    </div>
  );
}
