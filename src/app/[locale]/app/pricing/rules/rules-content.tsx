'use client';

import { useState, useEffect } from 'react';
import { PricingService } from '@/lib/services/pricing-service';
import { RulesTable } from '@/components/pricing/rules-table';
import type { RepricingRule } from '@/lib/services/pricing-types';

type Props = { locale: string };

export function RulesContent({ locale }: Props) {
  const [rules, setRules] = useState<RepricingRule[]>([]);

  useEffect(() => {
    const loadRules = async () => {
      const data = await PricingService.getRepricingRules('org-123');
      setRules(data);
    };
    loadRules();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary">Active Repricing Rules</h2>
          <p className="text-sm text-secondary">Configure automated pricing strategies</p>
        </div>
        <button className="px-4 py-2 bg-accent text-white rounded-card font-medium text-sm hover:bg-accent/90 transition-colors">
          + New Rule
        </button>
      </div>

      <RulesTable rules={rules} />
    </div>
  );
}
