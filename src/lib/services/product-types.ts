export type ProductStatus = "ACTIVE" | "PAUSED" | "OOS" | "ERROR";

export type ProductCore = {
  id: string;
  name: string;
  brand?: string;
  primarySku: string;
  category?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  status: ProductStatus;
  tags?: string[];
  defaultListingUrl?: string;
};

export type ProductSalesSnapshot = {
  revenue7d: number;
  revenue30d: number;
  orders7d: number;
  orders30d: number;
  profit7d: number;
  profit30d: number;
  avgSellingPrice: number;
  refundRate30d: number;
};

export type ProductInventorySnapshot = {
  totalOnHand: number;
  totalReserved: number;
  locations: {
    locationId: string;
    locationName: string;
    type: "FBA" | "FBM" | "THIRD_PARTY" | "OWN_WAREHOUSE";
    onHand: number;
    reserved: number;
    reorderPoint: number;
  }[];
  lowStock: boolean;
  outOfStock: boolean;
};

export type ProductChannelListing = {
  channelId: string;
  channelName: string;
  channelType:
    | "AMAZON"
    | "SHOPIFY"
    | "SHOPEE"
    | "RAKUTEN"
    | "EBAY"
    | "WALMART"
    | "YAHOO_SHOPPING"
    | "MERCARI"
    | "TIKTOK_SHOP";
  region: string;
  status: "ACTIVE" | "PAUSED" | "OUT_OF_STOCK" | "PENDING" | "ERROR";
  price: number;
  currency: string;
  buyBoxShare?: number;
  orders7d: number;
};

export type ProductReviewSummary = {
  avgRating30d: number;
  totalReviews: number;
  negativeReviews30d: number;
  positiveReviews30d: number;
  topKeywords: string[];
};

export type ProductResearchMetrics = {
  bsrRank?: number;
  estimatedDailySales?: number;
  competitionLevel?: "LOW" | "MEDIUM" | "HIGH";
  roiPercent?: number;
  marginPercent?: number;
  landedCostEstimate?: number;
  feesEstimate?: number;
  notes?: string;
};

export type ProductRow = {
  core: ProductCore;
  sales: ProductSalesSnapshot;
  inventory: ProductInventorySnapshot;
  review: ProductReviewSummary;
  research?: ProductResearchMetrics;
  listings?: ProductChannelListing[];
};

export type ProductPerformancePoint = {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
};

export type ProductActivityType = "SYNC" | "PRICE_CHANGE" | "AUTOMATION" | "REVIEW" | "LISTING";

export type ProductActivityLog = {
  id: string;
  timestamp: string;
  type: ProductActivityType;
  source: string;
  description: string;
};

export type ProductDetail = ProductRow & {
  listings: ProductChannelListing[];
  research: ProductResearchMetrics;
  performance: ProductPerformancePoint[];
  activities: ProductActivityLog[];
  aiSummary: string;
};

export type ProductListFilter = {
  search?: string;
  brand?: string;
  category?: string;
  tag?: string;
  channelType?: ProductChannelListing["channelType"];
  status?: ProductStatus;
  stockStatus?: "OK" | "LOW" | "OOS";
  sort?: "REVENUE_7D" | "REVENUE_30D" | "ORDERS_7D" | "PROFIT_30D" | "CREATED_AT";
};

export type ProductListResult = {
  items: ProductRow[];
  totalCount: number;
};

export type ProductCopilotSuggestion = {
  title: string;
  details: string;
  skus: string[];
};
