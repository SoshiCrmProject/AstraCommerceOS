'use client';

import { useState } from 'react';
import type { AnalyticsFilter, ChannelType } from '@/lib/services/analytics-types';

type AnalyticsFiltersProps = {
  filter: AnalyticsFilter;
  onFilterChange: (filter: AnalyticsFilter) => void;
  dict: any;
};

export function AnalyticsFilters({ filter, onFilterChange, dict }: AnalyticsFiltersProps) {
  const [dateRange, setDateRange] = useState<string>('last30Days');
  const [granularity, setGranularity] = useState<'DAY' | 'WEEK' | 'MONTH'>('DAY');
  const [channelType, setChannelType] = useState<ChannelType | 'ALL'>('ALL');
  const [region, setRegion] = useState<string>('ALL');

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    
    const today = new Date();
    let dateFrom = new Date();
    
    switch (range) {
      case 'last7Days':
        dateFrom.setDate(today.getDate() - 7);
        break;
      case 'last30Days':
        dateFrom.setDate(today.getDate() - 30);
        break;
      case 'last90Days':
        dateFrom.setDate(today.getDate() - 90);
        break;
    }
    
    onFilterChange({
      ...filter,
      dateFrom: dateFrom.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0],
    });
  };

  const handleGranularityChange = (gran: 'DAY' | 'WEEK' | 'MONTH') => {
    setGranularity(gran);
    onFilterChange({ ...filter, granularity: gran });
  };

  const handleChannelChange = (channel: string) => {
    setChannelType(channel as ChannelType | 'ALL');
    onFilterChange({ ...filter, channelType: channel as ChannelType | 'ALL' });
  };

  const handleRegionChange = (reg: string) => {
    setRegion(reg);
    onFilterChange({ ...filter, region: reg });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            {dict.filters.dateRange}
          </label>
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="last7Days">{dict.filters.last7Days}</option>
            <option value="last30Days">{dict.filters.last30Days}</option>
            <option value="last90Days">{dict.filters.last90Days}</option>
          </select>
        </div>

        {/* Granularity */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            {dict.filters.granularity}
          </label>
          <select
            value={granularity}
            onChange={(e) => handleGranularityChange(e.target.value as 'DAY' | 'WEEK' | 'MONTH')}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DAY">{dict.filters.day}</option>
            <option value="WEEK">{dict.filters.week}</option>
            <option value="MONTH">{dict.filters.month}</option>
          </select>
        </div>

        {/* Channel */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            {dict.filters.channel}
          </label>
          <select
            value={channelType}
            onChange={(e) => handleChannelChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">{dict.filters.allChannels}</option>
            <option value="AMAZON">Amazon</option>
            <option value="SHOPIFY">Shopify</option>
            <option value="SHOPEE">Shopee</option>
            <option value="RAKUTEN">Rakuten</option>
            <option value="WALMART">Walmart</option>
            <option value="EBAY">eBay</option>
            <option value="YAHOO_SHOPPING">Yahoo! Shopping</option>
            <option value="TIKTOK_SHOP">TikTok Shop</option>
            <option value="MERCARI">Mercari</option>
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            {dict.filters.region}
          </label>
          <select
            value={region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">{dict.filters.allRegions}</option>
            <option value="US">United States</option>
            <option value="JP">Japan</option>
            <option value="SG">Singapore</option>
            <option value="EU">Europe</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
        </div>
      </div>
    </div>
  );
}
