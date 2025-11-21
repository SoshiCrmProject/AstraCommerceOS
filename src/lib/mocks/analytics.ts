/**
 * Analytics Mock Data
 * 
 * Realistic mock data for analytics dashboard, trends, and insights.
 */

import type {
  AnalyticsOverviewSnapshot,
  RevenuePoint,
  ChannelPerformance,
  TopSkuPerformance,
  FunnelMetric,
  AnalyticsAnomaly,
  CustomerCohortPoint,
  GeographicBreakdown,
} from '../services/analytics-types';

/**
 * Generate time series data for last N days
 */
function generateTimeSeries(days: number): RevenuePoint[] {
  const data: RevenuePoint[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some realistic variation
    const baseRevenue = 45000 + Math.random() * 15000;
    const profitMargin = 0.22 + Math.random() * 0.08;
    const orders = Math.floor(180 + Math.random() * 80);
    const units = Math.floor(orders * (1.5 + Math.random() * 0.8));
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(baseRevenue),
      profit: Math.round(baseRevenue * profitMargin),
      orders,
      units,
      avgOrderValue: Math.round(baseRevenue / orders),
    });
  }
  
  return data;
}

/**
 * Mock channel performance data
 */
export const mockChannelPerformance: ChannelPerformance[] = [
  {
    channelType: 'AMAZON',
    channelName: 'Amazon US',
    region: 'US',
    currency: 'USD',
    revenue: 856430,
    profit: 205543,
    orders: 3421,
    units: 5234,
    avgOrderValue: 250.35,
    profitMarginPercent: 24.0,
    trendDirection: 'UP',
    revenueGrowthPercent: 12.4,
    lateShipmentRatePercent: 2.1,
  },
  {
    channelType: 'SHOPIFY',
    channelName: 'Shopify Store',
    region: 'US',
    currency: 'USD',
    revenue: 423680,
    profit: 118230,
    orders: 1567,
    units: 2341,
    avgOrderValue: 270.34,
    profitMarginPercent: 27.9,
    trendDirection: 'UP',
    revenueGrowthPercent: 8.7,
    lateShipmentRatePercent: 1.3,
  },
  {
    channelType: 'RAKUTEN',
    channelName: 'Rakuten Ichiba',
    region: 'JP',
    currency: 'JPY',
    revenue: 8945000,
    profit: 1967900,
    orders: 2145,
    units: 3287,
    avgOrderValue: 4170.63,
    profitMarginPercent: 22.0,
    trendDirection: 'FLAT',
    revenueGrowthPercent: 1.2,
    lateShipmentRatePercent: 1.8,
  },
  {
    channelType: 'SHOPEE',
    channelName: 'Shopee Singapore',
    region: 'SG',
    currency: 'USD',
    revenue: 234500,
    profit: 49245,
    orders: 1876,
    units: 3452,
    avgOrderValue: 125.00,
    profitMarginPercent: 21.0,
    trendDirection: 'UP',
    revenueGrowthPercent: 18.3,
    lateShipmentRatePercent: 3.2,
  },
  {
    channelType: 'WALMART',
    channelName: 'Walmart Marketplace',
    region: 'US',
    currency: 'USD',
    revenue: 187650,
    profit: 39407,
    orders: 843,
    units: 1234,
    avgOrderValue: 222.63,
    profitMarginPercent: 21.0,
    trendDirection: 'DOWN',
    revenueGrowthPercent: -5.2,
    lateShipmentRatePercent: 4.1,
  },
  {
    channelType: 'EBAY',
    channelName: 'eBay',
    region: 'US',
    currency: 'USD',
    revenue: 145320,
    profit: 29064,
    orders: 672,
    units: 891,
    avgOrderValue: 216.25,
    profitMarginPercent: 20.0,
    trendDirection: 'FLAT',
    revenueGrowthPercent: 0.8,
    lateShipmentRatePercent: 2.5,
  },
  {
    channelType: 'YAHOO_SHOPPING',
    channelName: 'Yahoo! Shopping JP',
    region: 'JP',
    currency: 'JPY',
    revenue: 3245000,
    profit: 681450,
    orders: 876,
    units: 1432,
    avgOrderValue: 3704.34,
    profitMarginPercent: 21.0,
    trendDirection: 'UP',
    revenueGrowthPercent: 6.5,
    lateShipmentRatePercent: 1.9,
  },
  {
    channelType: 'TIKTOK_SHOP',
    channelName: 'TikTok Shop',
    region: 'US',
    currency: 'USD',
    revenue: 98450,
    profit: 19690,
    orders: 1234,
    units: 2187,
    avgOrderValue: 79.80,
    profitMarginPercent: 20.0,
    trendDirection: 'UP',
    revenueGrowthPercent: 45.2,
    lateShipmentRatePercent: 5.3,
  },
];

/**
 * Mock top SKU performance
 */
export const mockTopSkus: TopSkuPerformance[] = [
  {
    skuId: 'sku-001',
    skuCode: 'PRO-HEADSET-BLK',
    productId: 'prod-123',
    productName: 'ProAudio Wireless Headset - Black',
    mainImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    channelType: 'AMAZON',
    channelName: 'Amazon US',
    region: 'US',
    revenue: 145680,
    profit: 36420,
    units: 543,
    profitMarginPercent: 25.0,
    returnRatePercent: 3.2,
    buyBoxSharePercent: 87.5,
    trendDirection: 'UP',
  },
  {
    skuId: 'sku-002',
    skuCode: 'SMART-WATCH-SLV',
    productId: 'prod-124',
    productName: 'SmartFit Watch Pro - Silver',
    mainImageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    channelType: 'SHOPIFY',
    channelName: 'Shopify Store',
    region: 'US',
    revenue: 98340,
    profit: 29502,
    units: 234,
    profitMarginPercent: 30.0,
    returnRatePercent: 2.1,
    trendDirection: 'UP',
  },
  {
    skuId: 'sku-003',
    skuCode: 'YOGA-MAT-PRP',
    productId: 'prod-125',
    productName: 'Premium Yoga Mat - Purple',
    mainImageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    channelType: 'AMAZON',
    channelName: 'Amazon US',
    region: 'US',
    revenue: 76540,
    profit: 22962,
    units: 1234,
    profitMarginPercent: 30.0,
    returnRatePercent: 1.8,
    buyBoxSharePercent: 92.1,
    trendDirection: 'FLAT',
  },
  {
    skuId: 'sku-004',
    skuCode: 'LED-LAMP-WHT',
    productId: 'prod-126',
    productName: 'Designer LED Desk Lamp - White',
    mainImageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
    channelType: 'RAKUTEN',
    channelName: 'Rakuten Ichiba',
    region: 'JP',
    revenue: 3245000,
    profit: 811250,
    units: 456,
    profitMarginPercent: 25.0,
    returnRatePercent: 2.5,
    trendDirection: 'UP',
  },
  {
    skuId: 'sku-005',
    skuCode: 'BACKPACK-GRY',
    productId: 'prod-127',
    productName: 'Urban Commuter Backpack - Gray',
    mainImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    channelType: 'SHOPEE',
    channelName: 'Shopee Singapore',
    region: 'SG',
    revenue: 54320,
    profit: 13580,
    units: 876,
    profitMarginPercent: 25.0,
    returnRatePercent: 3.1,
    trendDirection: 'UP',
  },
  {
    skuId: 'sku-006',
    skuCode: 'WATER-BOTTLE-BLU',
    productId: 'prod-128',
    productName: 'Insulated Water Bottle 32oz - Blue',
    mainImageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    channelType: 'AMAZON',
    channelName: 'Amazon US',
    region: 'US',
    revenue: 45230,
    profit: 13569,
    units: 1567,
    profitMarginPercent: 30.0,
    returnRatePercent: 1.2,
    buyBoxSharePercent: 78.3,
    trendDirection: 'FLAT',
  },
  {
    skuId: 'sku-007',
    skuCode: 'PHONE-CASE-BLK',
    productId: 'prod-129',
    productName: 'Rugged Phone Case - Black',
    mainImageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    channelType: 'TIKTOK_SHOP',
    channelName: 'TikTok Shop',
    region: 'US',
    revenue: 38450,
    profit: 11535,
    units: 2345,
    profitMarginPercent: 30.0,
    returnRatePercent: 4.2,
    trendDirection: 'UP',
  },
  {
    skuId: 'sku-008',
    skuCode: 'NOTEBOOK-SET',
    productId: 'prod-130',
    productName: 'Premium Notebook Set (3-pack)',
    mainImageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop',
    channelType: 'WALMART',
    channelName: 'Walmart Marketplace',
    region: 'US',
    revenue: 32100,
    profit: 8025,
    units: 1234,
    profitMarginPercent: 25.0,
    returnRatePercent: 2.8,
    trendDirection: 'DOWN',
  },
];

/**
 * Mock conversion funnel
 */
export const mockFunnel: FunnelMetric[] = [
  { stage: 'VISITS', count: 145680, conversionFromPreviousPercent: undefined },
  { stage: 'PRODUCT_VIEWS', count: 52340, conversionFromPreviousPercent: 35.9 },
  { stage: 'ADD_TO_CART', count: 18760, conversionFromPreviousPercent: 35.8 },
  { stage: 'CHECKOUT', count: 14230, conversionFromPreviousPercent: 75.8 },
  { stage: 'ORDERS', count: 11234, conversionFromPreviousPercent: 79.0 },
];

/**
 * Mock analytics anomalies
 */
export const mockAnomalies: AnalyticsAnomaly[] = [
  {
    id: 'anom-001',
    type: 'REVENUE_SPIKE',
    severity: 'MEDIUM',
    channelType: 'TIKTOK_SHOP',
    region: 'US',
    description: 'TikTok Shop revenue increased 45% vs last period',
    detectedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    expectedValue: 68000,
    actualValue: 98450,
    deviationPercent: 44.8,
  },
  {
    id: 'anom-002',
    type: 'MARGIN_DROP',
    severity: 'HIGH',
    channelType: 'WALMART',
    region: 'US',
    description: 'Walmart profit margin dropped from 25% to 21%',
    detectedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    expectedValue: 25.0,
    actualValue: 21.0,
    deviationPercent: -16.0,
  },
  {
    id: 'anom-003',
    type: 'RETURN_RATE_SPIKE',
    severity: 'CRITICAL',
    channelType: 'TIKTOK_SHOP',
    region: 'US',
    description: 'Return rate on TikTok Shop increased to 5.3% (avg: 2.5%)',
    detectedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    expectedValue: 2.5,
    actualValue: 5.3,
    deviationPercent: 112.0,
  },
  {
    id: 'anom-004',
    type: 'ORDERS_SPIKE',
    severity: 'LOW',
    channelType: 'SHOPEE',
    region: 'SG',
    description: 'Shopee orders increased 18% - positive trend continues',
    detectedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    expectedValue: 1590,
    actualValue: 1876,
    deviationPercent: 18.0,
  },
];

/**
 * Mock customer cohort retention
 */
export const mockCohorts: CustomerCohortPoint[] = [
  // October 2024 cohort
  { cohortLabel: '2024-10 (Oct signup)', monthIndex: 0, retentionRatePercent: 100.0, customerCount: 1234, revenueTotal: 456780 },
  { cohortLabel: '2024-10 (Oct signup)', monthIndex: 1, retentionRatePercent: 42.3, customerCount: 522, revenueTotal: 198450 },
  { cohortLabel: '2024-10 (Oct signup)', monthIndex: 2, retentionRatePercent: 28.1, customerCount: 347, revenueTotal: 145680 },
  
  // November 2024 cohort
  { cohortLabel: '2024-11 (Nov signup)', monthIndex: 0, retentionRatePercent: 100.0, customerCount: 1567, revenueTotal: 589230 },
  { cohortLabel: '2024-11 (Nov signup)', monthIndex: 1, retentionRatePercent: 38.7, customerCount: 607, revenueTotal: 234560 },
  
  // December 2024 cohort (newer, less data)
  { cohortLabel: '2024-12 (Dec signup)', monthIndex: 0, retentionRatePercent: 100.0, customerCount: 1891, revenueTotal: 678900 },
];

/**
 * Mock geographic breakdown
 */
export const mockGeography: GeographicBreakdown[] = [
  { countryCode: 'US', countryName: 'United States', revenue: 1856430, orders: 7123, customers: 4567, revenueSharePercent: 54.2 },
  { countryCode: 'JP', countryName: 'Japan', revenue: 897650, orders: 3021, customers: 2134, revenueSharePercent: 26.2 },
  { countryCode: 'SG', countryName: 'Singapore', revenue: 234500, orders: 1876, customers: 1234, revenueSharePercent: 6.8 },
  { countryCode: 'GB', countryName: 'United Kingdom', revenue: 187340, orders: 892, customers: 678, revenueSharePercent: 5.5 },
  { countryCode: 'CA', countryName: 'Canada', revenue: 145680, orders: 654, customers: 487, revenueSharePercent: 4.3 },
  { countryCode: 'AU', countryName: 'Australia', revenue: 103450, orders: 423, customers: 321, revenueSharePercent: 3.0 },
];

/**
 * Generate complete analytics overview snapshot
 */
export function generateAnalyticsOverview(days: number = 30): AnalyticsOverviewSnapshot {
  const timeSeries = generateTimeSeries(days);
  
  // Calculate totals from time series
  const totalRevenue = timeSeries.reduce((sum, p) => sum + p.revenue, 0);
  const totalProfit = timeSeries.reduce((sum, p) => sum + p.profit, 0);
  const totalOrders = timeSeries.reduce((sum, p) => sum + p.orders, 0);
  const totalUnits = timeSeries.reduce((sum, p) => sum + p.units, 0);
  
  return {
    currency: 'USD',
    dateRangeLabel: `Last ${days} days`,
    totalRevenue: Math.round(totalRevenue),
    totalProfit: Math.round(totalProfit),
    totalOrders,
    totalUnits,
    profitMarginPercent: Math.round((totalProfit / totalRevenue) * 1000) / 10,
    revenueGrowthPercent: 8.7,
    profitGrowthPercent: 12.3,
    ordersGrowthPercent: 6.4,
    avgOrderValue: Math.round(totalRevenue / totalOrders),
    timeSeries,
    channelPerformance: mockChannelPerformance,
    topSkus: mockTopSkus,
    funnel: mockFunnel,
    anomalies: mockAnomalies,
  };
}
