export type ChannelType =
  | "AMAZON"
  | "SHOPIFY"
  | "SHOPEE"
  | "RAKUTEN"
  | "EBAY"
  | "WALMART"
  | "YAHOO_SHOPPING"
  | "MERCARI"
  | "TIKTOK_SHOP";

export type ChannelStatus = "HEALTHY" | "DEGRADED" | "DISCONNECTED";

export type ChannelConnectionSummary = {
  id: string;
  name: string;
  type: ChannelType;
  region: string;
  status: ChannelStatus;
  icon: string;
  accountId?: string;
  accountType?: string;
  revenue7d: number;
  revenue30d?: number;
  orders7d: number;
  orders30d?: number;
  margin7d: number;
  buyBoxShare: number;
  lastSyncAt: string | null;
  nextSyncAt?: string | null;
  connectedAt: string;
  tags: string[];
  new?: boolean;
};

export type ChannelHealthSnapshot = {
  apiLatencyMs: number;
  lastErrorAt?: string | null;
  lastErrorMessage?: string | null;
  uptime30dPercent: number;
  syncSuccessRate30d: number;
  pendingJobs: number;
  incidentCount24h?: number;
};

export type ChannelFinancialSnapshot = {
  revenue7d: number;
  revenue30d: number;
  fees7d: number;
  fees30d: number;
  refunds7d: number;
  refunds30d: number;
  profit7d: number;
  profit30d: number;
  orders7d: number;
  orders30d: number;
  avgOrderValue: number;
  marginRate7d: number;
  marginRate30d: number;
};

export type ChannelSyncLog = {
  id: string;
  kind: "PRODUCTS" | "INVENTORY" | "ORDERS" | "PRICING" | "REVIEWS";
  status: "SUCCESS" | "FAILED" | "PARTIAL" | "RUNNING";
  startedAt: string;
  finishedAt?: string | null;
  itemCount?: number;
  errorMessage?: string | null;
};

export type ChannelListingSummary = {
  id: string;
  sku: string;
  productName: string;
  status: "ACTIVE" | "PAUSED" | "OUT_OF_STOCK" | "PENDING" | "ERROR";
  price: number;
  currency: string;
  stock: number;
  orders7d: number;
  buyBoxShare?: number;
};

export type ChannelOrderSummary = {
  id: string;
  orderedAt: string;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED" | "RETURNED";
  totalAmount: number;
  currency: string;
  fulfillment: "FBA" | "FBM" | "OWN";
  sla: "ON_TIME" | "LATE";
};

export type ChannelPerformancePoint = {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
};

export type ChannelSyncPreferences = {
  autoSync: {
    products: boolean;
    inventory: boolean;
    orders: boolean;
    pricing: boolean;
    reviews: boolean;
  };
  cadenceMinutes: {
    products: number;
    inventory: number;
    orders: number;
    pricing: number;
    reviews: number;
  };
  notifyOnFailure: boolean;
};

export type ChannelDetailSnapshot = {
  channel: ChannelConnectionSummary;
  health: ChannelHealthSnapshot;
  financials: ChannelFinancialSnapshot;
  recentSyncs: ChannelSyncLog[];
  topListings: ChannelListingSummary[];
  orders: ChannelOrderSummary[];
  timeline: ChannelPerformancePoint[];
  syncPreferences: ChannelSyncPreferences;
};
