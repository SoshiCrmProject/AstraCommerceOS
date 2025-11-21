/**
 * Analytics Service
 * 
 * Single source of truth for analytics data across all channels.
 * Currently backed by mock data, ready for database/API integration.
 */

import type {
  AnalyticsOverviewSnapshot,
  AnalyticsFilter,
  ChannelPerformance,
  TopSkuPerformance,
  FunnelMetric,
  CustomerCohortPoint,
  GeographicBreakdown,
  AnalyticsPagination,
} from './analytics-types';

import {
  generateAnalyticsOverview,
  mockChannelPerformance,
  mockTopSkus,
  mockFunnel,
  mockCohorts,
  mockGeography,
} from '../mocks/analytics';

/**
 * Get comprehensive analytics overview with KPIs, time series, and insights
 */
export async function getAnalyticsOverview(
  orgId: string,
  filter: AnalyticsFilter = {}
): Promise<AnalyticsOverviewSnapshot> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Determine date range for mock data
  const days = filter.dateFrom && filter.dateTo
    ? Math.floor((new Date(filter.dateTo).getTime() - new Date(filter.dateFrom).getTime()) / (1000 * 60 * 60 * 24))
    : 30;

  let snapshot = generateAnalyticsOverview(days);

  // Apply channel filter if specified
  if (filter.channelType && filter.channelType !== 'ALL') {
    snapshot = {
      ...snapshot,
      channelPerformance: snapshot.channelPerformance.filter(
        (ch) => ch.channelType === filter.channelType
      ),
      topSkus: snapshot.topSkus.filter((sku) => sku.channelType === filter.channelType),
    };
  }

  // Apply region filter if specified
  if (filter.region && filter.region !== 'ALL') {
    snapshot = {
      ...snapshot,
      channelPerformance: snapshot.channelPerformance.filter((ch) => ch.region === filter.region),
      topSkus: snapshot.topSkus.filter((sku) => sku.region === filter.region),
    };
  }

  return snapshot;
}

/**
 * Get detailed channel performance breakdown
 */
export async function getChannelPerformanceDrilldown(
  orgId: string,
  filter: AnalyticsFilter = {}
): Promise<ChannelPerformance[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  let channels = [...mockChannelPerformance];

  if (filter.channelType && filter.channelType !== 'ALL') {
    channels = channels.filter((ch) => ch.channelType === filter.channelType);
  }

  if (filter.region && filter.region !== 'ALL') {
    channels = channels.filter((ch) => ch.region === filter.region);
  }

  return channels;
}

/**
 * Get top-performing SKUs with optional filtering and pagination
 */
export async function getTopSkuPerformance(
  orgId: string,
  filter: AnalyticsFilter & { limit?: number; sortBy?: 'revenue' | 'profit' | 'units' } = {}
): Promise<TopSkuPerformance[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  let skus = [...mockTopSkus];

  // Apply filters
  if (filter.channelType && filter.channelType !== 'ALL') {
    skus = skus.filter((sku) => sku.channelType === filter.channelType);
  }

  if (filter.region && filter.region !== 'ALL') {
    skus = skus.filter((sku) => sku.region === filter.region);
  }

  // Sort by specified metric
  const sortBy = filter.sortBy || 'revenue';
  skus.sort((a, b) => b[sortBy] - a[sortBy]);

  // Limit results
  if (filter.limit) {
    skus = skus.slice(0, filter.limit);
  }

  return skus;
}

/**
 * Get conversion funnel metrics
 */
export async function getFunnelMetrics(
  orgId: string,
  filter: AnalyticsFilter = {}
): Promise<FunnelMetric[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  // For now, return mock funnel data
  // In production, this would query analytics events filtered by date/channel
  return mockFunnel;
}

/**
 * Get customer cohort retention analysis
 */
export async function getCustomerCohorts(
  orgId: string,
  filter: AnalyticsFilter = {}
): Promise<CustomerCohortPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Return mock cohort data
  // In production, this would query customer signup dates and repeat purchase behavior
  return mockCohorts;
}

/**
 * Get geographic revenue breakdown
 */
export async function getGeographicBreakdown(
  orgId: string,
  filter: AnalyticsFilter = {},
  pagination?: AnalyticsPagination
): Promise<{ items: GeographicBreakdown[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  let geo = [...mockGeography];

  // Sort by revenue descending
  geo.sort((a, b) => b.revenue - a.revenue);

  // Apply pagination if provided
  if (pagination) {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    geo = geo.slice(start, end);
  }

  return {
    items: geo,
    total: mockGeography.length,
  };
}

/**
 * Export analytics data as CSV (mock)
 * Returns CSV string ready for download
 */
export async function exportAnalyticsReport(
  orgId: string,
  filter: AnalyticsFilter = {}
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const snapshot = await getAnalyticsOverview(orgId, filter);

  // Generate CSV header
  let csv = 'Date,Revenue,Profit,Orders,Units,Avg Order Value\n';

  // Add time series data
  snapshot.timeSeries.forEach((point) => {
    csv += `${point.date},${point.revenue},${point.profit},${point.orders},${point.units},${point.avgOrderValue}\n`;
  });

  return csv;
}

const AnalyticsService = {
  getAnalyticsOverview,
  getChannelPerformanceDrilldown,
  getTopSkuPerformance,
  getFunnelMetrics,
  getCustomerCohorts,
  getGeographicBreakdown,
  exportAnalyticsReport,
};

export default AnalyticsService;
