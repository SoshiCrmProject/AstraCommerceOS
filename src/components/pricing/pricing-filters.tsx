'use client';

import { useState } from 'react';
import type {
  PricingFilter,
  PricingChannelType,
  PricingStrategyType,
} from '@/lib/services/pricing-types';

type Props = {
  filter: PricingFilter;
  onFilterChange: (filter: PricingFilter) => void;
};

export function PricingFilters({ filter, onFilterChange }: Props) {
  const [localSearch, setLocalSearch] = useState(filter.search || '');

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFilterChange({ ...filter, search: value });
  };

  return (
    <div className="bg-surface rounded-card p-4 border border-border-subtle flex flex-col md:flex-row gap-3">
      <input
        type="text"
        placeholder="Search SKU or product..."
        value={localSearch}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="flex-1 px-3 py-2 bg-bg-page border border-border-subtle rounded-card text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <select
        value={filter.channelType || 'ALL'}
        onChange={(e) =>
          onFilterChange({
            ...filter,
            channelType: e.target.value === 'ALL' ? 'ALL' : (e.target.value as PricingChannelType),
          })
        }
        className="px-3 py-2 bg-bg-page border border-border-subtle rounded-card text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="ALL">All Channels</option>
        <option value="AMAZON">Amazon</option>
        <option value="SHOPIFY">Shopify</option>
        <option value="SHOPEE">Shopee</option>
        <option value="RAKUTEN">Rakuten</option>
        <option value="EBAY">eBay</option>
        <option value="WALMART">Walmart</option>
        <option value="YAHOO_SHOPPING">Yahoo Shopping</option>
        <option value="MERCARI">Mercari</option>
        <option value="TIKTOK_SHOP">TikTok Shop</option>
      </select>
      <select
        value={filter.strategyType || 'ALL'}
        onChange={(e) =>
          onFilterChange({
            ...filter,
            strategyType: e.target.value === 'ALL' ? 'ALL' : (e.target.value as PricingStrategyType),
          })
        }
        className="px-3 py-2 bg-bg-page border border-border-subtle rounded-card text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="ALL">All Strategies</option>
        <option value="FIXED_MARGIN">Fixed Margin</option>
        <option value="COMPETITIVE">Competitive</option>
        <option value="PREMIUM">Premium</option>
        <option value="CLEARANCE">Clearance</option>
        <option value="MANUAL_ONLY">Manual Only</option>
      </select>
      <select
        value={filter.marginBucket || 'ALL'}
        onChange={(e) =>
          onFilterChange({
            ...filter,
            marginBucket:
              e.target.value === 'ALL'
                ? undefined
                : (e.target.value as 'NEGATIVE' | 'LOW' | 'HEALTHY' | 'HIGH'),
          })
        }
        className="px-3 py-2 bg-bg-page border border-border-subtle rounded-card text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="ALL">All Margins</option>
        <option value="NEGATIVE">Negative</option>
        <option value="LOW">Low (&lt;20%)</option>
        <option value="HEALTHY">Healthy (20-40%)</option>
        <option value="HIGH">High (&gt;40%)</option>
      </select>
    </div>
  );
}
