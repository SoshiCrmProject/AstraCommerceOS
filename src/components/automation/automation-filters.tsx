'use client';

import { useState } from 'react';
import type {
  AutomationFilter,
  AutomationStatus,
  AutomationTriggerType,
} from '@/lib/services/automation-types';

type Props = {
  filter: AutomationFilter;
  onFilterChange: (filter: AutomationFilter) => void;
};

export function AutomationFilters({ filter, onFilterChange }: Props) {
  const [localSearch, setLocalSearch] = useState(filter.search || '');

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFilterChange({ ...filter, search: value });
  };

  return (
    <div className="bg-surface rounded-card p-4 border border-border-subtle flex flex-col md:flex-row gap-3">
      <input
        type="text"
        placeholder="Search by rule name..."
        value={localSearch}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="flex-1 px-3 py-2 bg-bg-page border border-border-subtle rounded-card text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <select
        value={filter.status || 'ALL'}
        onChange={(e) =>
          onFilterChange({
            ...filter,
            status: e.target.value === 'ALL' ? 'ALL' : (e.target.value as AutomationStatus),
          })
        }
        className="px-3 py-2 bg-bg-page border border-border-subtle rounded-card text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="ALL">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="PAUSED">Paused</option>
        <option value="DRAFT">Draft</option>
      </select>
      <select
        value={filter.triggerType || 'ALL'}
        onChange={(e) =>
          onFilterChange({
            ...filter,
            triggerType:
              e.target.value === 'ALL' ? 'ALL' : (e.target.value as AutomationTriggerType),
          })
        }
        className="px-3 py-2 bg-bg-page border border-border-subtle rounded-card text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="ALL">All Triggers</option>
        <option value="ORDER_CREATED">Order Created</option>
        <option value="ORDER_STATUS_CHANGED">Order Status Changed</option>
        <option value="INVENTORY_BELOW_THRESHOLD">Inventory Below Threshold</option>
        <option value="PRICE_BELOW_MIN_MARGIN">Price Below Min Margin</option>
        <option value="NEW_NEGATIVE_REVIEW">New Negative Review</option>
        <option value="CHANNEL_SYNC_FAILED">Channel Sync Failed</option>
        <option value="DAILY_SCHEDULE">Daily Schedule</option>
        <option value="WEEKLY_SCHEDULE">Weekly Schedule</option>
      </select>
    </div>
  );
}
