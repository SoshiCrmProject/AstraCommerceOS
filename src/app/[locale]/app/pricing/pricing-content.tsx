'use client';

import { useState, useEffect } from 'react';
import { PricingService } from '@/lib/services/pricing-service';
import { PricingKpiBar } from '@/components/pricing/pricing-kpi-bar';
import { PricingFilters } from '@/components/pricing/pricing-filters';
import { PricingTable } from '@/components/pricing/pricing-table';
import type { PricingFilter, PricingSkuSummary, PricingKpiSnapshot } from '@/lib/services/pricing-types';

type Props = { locale: string };

export function PricingContent({ locale }: Props) {
  const [filter, setFilter] = useState<PricingFilter>({});
  const [data, setData] = useState<{ skus: PricingSkuSummary[]; kpis: PricingKpiSnapshot } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async (newFilter: PricingFilter) => {
    setLoading(true);
    const result = await PricingService.getPricingSnapshot('org-123', newFilter);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    loadData(filter);
  }, []);

  const handleFilterChange = (newFilter: PricingFilter) => {
    setFilter(newFilter);
    loadData(newFilter);
  };

  if (!data) {
    return <div className="text-secondary">Loading pricing data...</div>;
  }

  return (
    <div className="space-y-6">
      <PricingKpiBar kpis={data.kpis} />
      <PricingFilters filter={filter} onFilterChange={handleFilterChange} />
      {loading ? (
        <div className="text-secondary">Applying filters...</div>
      ) : (
        <PricingTable skus={data.skus} locale={locale} />
      )}
    </div>
  );
}
