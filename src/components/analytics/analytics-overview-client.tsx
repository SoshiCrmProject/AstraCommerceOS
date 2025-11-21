'use client';

import { useState } from 'react';
import type { AnalyticsOverviewSnapshot, AnalyticsFilter } from '@/lib/services/analytics-types';
import type { Locale } from '@/i18n/config';
import { AnalyticsFilters } from './analytics-filters';
import { RevenueChart } from './revenue-chart';
import { ChannelMix } from './channel-mix';
import { ChannelPerformanceTable } from './channel-performance-table';
import { TopSkuTable } from './top-sku-table';
import { FunnelCard } from './funnel-card';
import { AnomaliesPanel } from './anomalies-panel';
import { ExplainButton } from './explain-button';
import { TrendingUp, DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';

type AnalyticsOverviewClientProps = {
  initialSnapshot: AnalyticsOverviewSnapshot;
  dict: any;
  locale: Locale;
};

export function AnalyticsOverviewClient({
  initialSnapshot,
  dict,
  locale,
}: AnalyticsOverviewClientProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [filter, setFilter] = useState<AnalyticsFilter>({
    granularity: 'DAY',
    channelType: 'ALL',
    region: 'ALL',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
      style: 'currency',
      currency: snapshot.currency === 'JPY' ? 'JPY' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const handleFilterChange = async (newFilter: AnalyticsFilter) => {
    setFilter(newFilter);
    // In production, fetch new data based on filter
    // const newSnapshot = await AnalyticsService.getAnalyticsOverview('org-demo', newFilter);
    // setSnapshot(newSnapshot);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <AnalyticsFilters filter={filter} onFilterChange={handleFilterChange} dict={dict} />

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">{dict.kpis.totalRevenue}</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(snapshot.totalRevenue)}
          </div>
          <div className={`text-xs font-medium ${snapshot.revenueGrowthPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(snapshot.revenueGrowthPercent)} {dict.kpis.vsPreviousPeriod}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">{dict.kpis.totalProfit}</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(snapshot.totalProfit)}
          </div>
          <div className={`text-xs font-medium ${snapshot.profitGrowthPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(snapshot.profitGrowthPercent)} {dict.kpis.vsPreviousPeriod}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">{dict.kpis.profitMargin}</span>
            <Package className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {snapshot.profitMarginPercent.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">
            {formatCurrency(snapshot.totalProfit)} / {formatCurrency(snapshot.totalRevenue)}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">{dict.kpis.totalOrders}</span>
            <ShoppingCart className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {snapshot.totalOrders.toLocaleString()}
          </div>
          <div className={`text-xs font-medium ${snapshot.ordersGrowthPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(snapshot.ordersGrowthPercent)} {dict.kpis.vsPreviousPeriod}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">{dict.kpis.avgOrderValue}</span>
            <DollarSign className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(snapshot.avgOrderValue)}
          </div>
          <div className="text-xs text-gray-500">
            {snapshot.totalUnits.toLocaleString()} {dict.charts.units}
          </div>
        </div>
      </div>

      {/* Revenue & Profit Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">{dict.charts.revenueOverTime}</h3>
          <ExplainButton label={dict.buttons.explainChart} onClick={() => {}} />
        </div>
        <RevenueChart timeSeries={snapshot.timeSeries} dict={dict} />
      </div>

      {/* Channel Mix & Performance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Mix Donut */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">{dict.charts.channelMix}</h3>
          <ChannelMix channels={snapshot.channelPerformance} dict={dict} />
        </div>

        {/* Anomalies & Alerts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="text-base font-semibold text-gray-900">{dict.anomalies.title}</h3>
            </div>
          </div>
          <AnomaliesPanel anomalies={snapshot.anomalies} dict={dict} />
        </div>
      </div>

      {/* Channel Performance Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">{dict.channelPerformance.title}</h3>
          <ExplainButton label={dict.buttons.explainPerformance} onClick={() => {}} />
        </div>
        <ChannelPerformanceTable channels={snapshot.channelPerformance} dict={dict} />
      </div>

      {/* Top SKUs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">{dict.topSkus.title}</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              {dict.topSkus.byRevenue}
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              {dict.topSkus.byProfit}
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              {dict.topSkus.byUnits}
            </button>
          </div>
        </div>
        <TopSkuTable skus={snapshot.topSkus} dict={dict} />
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">{dict.funnel.title}</h3>
          <ExplainButton label={dict.buttons.explainFunnel} onClick={() => {}} />
        </div>
        <FunnelCard funnel={snapshot.funnel} dict={dict} />
      </div>
    </div>
  );
}
