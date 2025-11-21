/**
 * Analytics Module - Type Definitions
 * 
 * Comprehensive type system for enterprise analytics across all channels.
 */

export type ChannelType =
  | 'AMAZON'
  | 'SHOPIFY'
  | 'SHOPEE'
  | 'RAKUTEN'
  | 'EBAY'
  | 'WALMART'
  | 'YAHOO_SHOPPING'
  | 'MERCARI'
  | 'TIKTOK_SHOP';

export type AnalyticsCurrency = 'USD' | 'JPY' | 'EUR' | 'GBP' | 'OTHER';

export type TimeGranularity = 'DAY' | 'WEEK' | 'MONTH';

export type TrendDirection = 'UP' | 'DOWN' | 'FLAT';

/**
 * Single data point in revenue time series
 */
export type RevenuePoint = {
  date: string; // ISO date string
  revenue: number;
  profit: number;
  orders: number;
  units: number;
  avgOrderValue?: number;
};

/**
 * Performance metrics for a single channel
 */
export type ChannelPerformance = {
  channelType: ChannelType;
  channelName: string;
  region: string;
  currency: AnalyticsCurrency;
  revenue: number;
  profit: number;
  orders: number;
  units: number;
  avgOrderValue: number;
  profitMarginPercent: number;
  trendDirection: TrendDirection;
  revenueGrowthPercent?: number;
  lateShipmentRatePercent?: number;
};

/**
 * Top-performing SKU analytics
 */
export type TopSkuPerformance = {
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  mainImageUrl?: string;
  channelType: ChannelType;
  channelName: string;
  region: string;
  revenue: number;
  profit: number;
  units: number;
  profitMarginPercent: number;
  returnRatePercent?: number;
  buyBoxSharePercent?: number;
  trendDirection: TrendDirection;
};

/**
 * Conversion funnel stages
 */
export type FunnelStage =
  | 'VISITS'
  | 'PRODUCT_VIEWS'
  | 'ADD_TO_CART'
  | 'CHECKOUT'
  | 'ORDERS';

/**
 * Single stage in conversion funnel
 */
export type FunnelMetric = {
  stage: FunnelStage;
  count: number;
  conversionFromPreviousPercent?: number;
};

/**
 * Customer cohort retention data point
 */
export type CustomerCohortPoint = {
  cohortLabel: string; // e.g., "2025-10 (Oct signup)"
  monthIndex: number; // 0, 1, 2, ... months since cohort start
  retentionRatePercent: number;
  customerCount: number;
  revenueTotal?: number;
};

/**
 * Anomaly detection types
 */
export type AnomalyType =
  | 'REVENUE_SPIKE'
  | 'REVENUE_DROP'
  | 'MARGIN_DROP'
  | 'ORDERS_SPIKE'
  | 'CANCELLATION_SPIKE'
  | 'RETURN_RATE_SPIKE';

export type AnomalySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Detected anomaly in analytics data
 */
export type AnalyticsAnomaly = {
  id: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  channelType?: ChannelType;
  region?: string;
  description: string;
  detectedAt: string; // ISO timestamp
  expectedValue?: number;
  actualValue?: number;
  deviationPercent?: number;
};

/**
 * Complete analytics overview snapshot
 */
export type AnalyticsOverviewSnapshot = {
  currency: AnalyticsCurrency;
  dateRangeLabel: string; // "Last 30 days", etc.
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  totalUnits: number;
  profitMarginPercent: number;
  revenueGrowthPercent: number; // vs previous period
  profitGrowthPercent: number; // vs previous period
  ordersGrowthPercent: number; // vs previous period
  avgOrderValue: number;
  timeSeries: RevenuePoint[];
  channelPerformance: ChannelPerformance[];
  topSkus: TopSkuPerformance[];
  funnel: FunnelMetric[];
  anomalies: AnalyticsAnomaly[];
};

/**
 * Filter options for analytics queries
 */
export type AnalyticsFilter = {
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  granularity?: TimeGranularity;
  channelType?: ChannelType | 'ALL';
  region?: string | 'ALL';
  currency?: AnalyticsCurrency;
};

/**
 * Pagination for analytics queries
 */
export type AnalyticsPagination = {
  page: number;
  pageSize: number;
};

/**
 * Geographic breakdown data point
 */
export type GeographicBreakdown = {
  countryCode: string; // ISO 3166-1 alpha-2
  countryName: string;
  revenue: number;
  orders: number;
  customers: number;
  revenueSharePercent: number;
};

/**
 * Product category performance
 */
export type CategoryPerformance = {
  categoryId: string;
  categoryName: string;
  revenue: number;
  profit: number;
  units: number;
  profitMarginPercent: number;
  trendDirection: TrendDirection;
};
