export type DashboardKpiSnapshot = {
  revenue24h: number;
  revenue7d: number;
  netProfit7d: number;
  orders24h: number;
  avgOrderValue: number;
  buyBoxShare: number;
  fulfillmentSla: number;
  inventoryRiskCount: number;
  negativeReviewCount: number;
};

export type DashboardChannelSummary = {
  id: string;
  name: string;
  type:
    | "AMAZON"
    | "SHOPIFY"
    | "SHOPEE"
    | "RAKUTEN"
    | "EBAY"
    | "WALMART"
    | "TIKTOK_SHOP"
    | "YAHOO_SHOPPING"
    | "MERCARI";
  region: string;
  status: "HEALTHY" | "WARNING" | "ERROR";
  revenue7d: number;
  orders7d: number;
  margin7d: number;
  buyBoxShare: number;
  lastSyncAt: string | null;
};

export type DashboardAlert = {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  category: "inventory" | "pricing" | "reviews" | "automation" | "ops" | "billing";
};

export type DashboardSkuInsight = {
  sku: string;
  productName: string;
  channelName: string;
  metric: "TOP_SELLER" | "AT_RISK" | "LOW_MARGIN" | "RISING_STAR";
  metricValue: string;
  trend: "up" | "down" | "flat";
  marginPercent?: number;
  orders7d?: number;
  inventoryStatus?: "ok" | "low" | "oos";
};

export type DashboardAutomationSummary = {
  totalRules: number;
  activeRules: number;
  failedExecutions24h: number;
  lastExecutionAt: string | null;
  mostTriggeredRule?: {
    name: string;
    triggerDescription: string;
    executions24h: number;
  };
};

export type DashboardReviewSummary = {
  avgRating30d: number;
  negativeCount30d: number;
  positiveCount30d: number;
  topIssueKeywords: string[];
};

export type DashboardRevenueTimeseriesPoint = {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
};

export type DashboardSnapshot = {
  kpis: DashboardKpiSnapshot;
  channels: DashboardChannelSummary[];
  alerts: DashboardAlert[];
  topSkus: DashboardSkuInsight[];
  revenueSeries: DashboardRevenueTimeseriesPoint[];
  automation: DashboardAutomationSummary;
  reviews: DashboardReviewSummary;
};
