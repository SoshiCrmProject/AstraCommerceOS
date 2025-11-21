'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { ReviewFilter, ReviewChannelType, ReviewSentiment, ReviewStatus, ReviewPriority } from '@/lib/services/review-types';

type Props = {
  filter: ReviewFilter;
  onFilterChange: (filter: ReviewFilter) => void;
  dict: any;
};

export function ReviewsFilters({ filter, onFilterChange, dict }: Props) {
  const [searchInput, setSearchInput] = useState(filter.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filter, search: searchInput });
  };

  const updateFilter = (updates: Partial<ReviewFilter>) => {
    onFilterChange({ ...filter, ...updates });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(filter).filter(k => k !== 'search' && filter[k as keyof ReviewFilter] !== 'ALL').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={dict.filters.searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {dict.filters.search}
        </button>
      </form>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <FilterSelect
          label={dict.filters.channel}
          value={filter.channelType || 'ALL'}
          onChange={(v) => updateFilter({ channelType: v as ReviewChannelType | 'ALL' })}
          options={[
            { value: 'ALL', label: dict.filters.allChannels },
            { value: 'AMAZON', label: 'Amazon' },
            { value: 'SHOPIFY', label: 'Shopify' },
            { value: 'SHOPEE', label: 'Shopee' },
            { value: 'RAKUTEN', label: 'Rakuten' },
            { value: 'WALMART', label: 'Walmart' },
            { value: 'EBAY', label: 'eBay' },
            { value: 'YAHOO_SHOPPING', label: 'Yahoo! Shopping' },
            { value: 'MERCARI', label: 'Mercari' },
            { value: 'TIKTOK_SHOP', label: 'TikTok Shop' },
          ]}
        />

        <FilterSelect
          label={dict.filters.rating}
          value={filter.rating?.toString() || 'ALL'}
          onChange={(v) => updateFilter({ rating: v === 'ALL' ? 'ALL' : parseInt(v) })}
          options={[
            { value: 'ALL', label: dict.filters.allRatings },
            { value: '5', label: '5★' },
            { value: '4', label: '4★' },
            { value: '3', label: '3★' },
            { value: '2', label: '2★' },
            { value: '1', label: '1★' },
          ]}
        />

        <FilterSelect
          label={dict.filters.sentiment}
          value={filter.sentiment || 'ALL'}
          onChange={(v) => updateFilter({ sentiment: v as ReviewSentiment | 'ALL' })}
          options={[
            { value: 'ALL', label: dict.filters.allSentiments },
            { value: 'POSITIVE', label: dict.sentiment.positive },
            { value: 'NEUTRAL', label: dict.sentiment.neutral },
            { value: 'NEGATIVE', label: dict.sentiment.negative },
          ]}
        />

        <FilterSelect
          label={dict.filters.status}
          value={filter.status || 'ALL'}
          onChange={(v) => updateFilter({ status: v as ReviewStatus | 'ALL' })}
          options={[
            { value: 'ALL', label: dict.filters.allStatuses },
            { value: 'NEW', label: dict.status.new },
            { value: 'IN_PROGRESS', label: dict.status.inProgress },
            { value: 'RESPONDED', label: dict.status.responded },
            { value: 'RESOLVED', label: dict.status.resolved },
            { value: 'ESCALATED', label: dict.status.escalated },
          ]}
        />

        <FilterSelect
          label={dict.filters.priority}
          value={filter.priority || 'ALL'}
          onChange={(v) => updateFilter({ priority: v as ReviewPriority | 'ALL' })}
          options={[
            { value: 'ALL', label: dict.filters.allPriorities },
            { value: 'CRITICAL', label: dict.priority.critical },
            { value: 'HIGH', label: dict.priority.high },
            { value: 'MEDIUM', label: dict.priority.medium },
            { value: 'LOW', label: dict.priority.low },
          ]}
        />

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
            {dict.filters.clearAll}
          </button>
        )}
      </div>

      {/* Toggle Chips */}
      <div className="flex flex-wrap gap-2">
        <ToggleChip
          active={filter.onlyUnresponded || false}
          onClick={() => updateFilter({ onlyUnresponded: !filter.onlyUnresponded })}
          label={dict.filters.unrespondedOnly}
        />
        <ToggleChip
          active={filter.rating === 1 || filter.rating === 2}
          onClick={() => updateFilter({ rating: (filter.rating === 1 || filter.rating === 2) ? 'ALL' : 1 })}
          label={dict.filters.negativeOnly}
        />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleChip({ active, onClick, label }: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}
