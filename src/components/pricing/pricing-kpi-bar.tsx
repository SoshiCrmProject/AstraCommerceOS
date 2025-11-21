'use client';

import type { PricingKpiSnapshot } from '@/lib/services/pricing-types';

type Props = { kpis: PricingKpiSnapshot };

export function PricingKpiBar({ kpis }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div className="bg-surface rounded-card p-3 border border-border-subtle">
        <div className="text-xs text-secondary mb-1">Avg Margin</div>
        <div className="text-lg font-semibold text-primary">{kpis.averageMargin.toFixed(1)}%</div>
      </div>
      <div className="bg-surface rounded-card p-3 border border-border-subtle">
        <div className="text-xs text-secondary mb-1">Negative Margin</div>
        <div className="text-lg font-semibold text-red-500">{kpis.skusWithNegativeMargin}</div>
      </div>
      <div className="bg-surface rounded-card p-3 border border-border-subtle">
        <div className="text-xs text-secondary mb-1">Low Margin (&lt;20%)</div>
        <div className="text-lg font-semibold text-yellow-500">{kpis.skusWithLowMargin}</div>
      </div>
      <div className="bg-surface rounded-card p-3 border border-border-subtle">
        <div className="text-xs text-secondary mb-1">Active Rules</div>
        <div className="text-lg font-semibold text-primary">{kpis.skusWithActiveRules}</div>
      </div>
      <div className="bg-surface rounded-card p-3 border border-border-subtle">
        <div className="text-xs text-secondary mb-1">In Experiments</div>
        <div className="text-lg font-semibold text-primary">{kpis.skusInExperiments}</div>
      </div>
    </div>
  );
}
