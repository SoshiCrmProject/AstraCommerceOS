export type InventoryLocationType =
  | 'FBA'
  | 'FBM'
  | 'OWN_WAREHOUSE'
  | 'THIRD_PARTY_3PL';

export type InventoryLocationSummary = {
  locationId: string;
  locationName: string;
  locationType: InventoryLocationType;
  code?: string;
  region?: string;
  city?: string;
  skuCount: number;
  totalOnHand: number;
  totalReserved: number;
  totalAvailable: number;
  totalInbound: number;
};

export type InventorySkuStatus =
  | 'HEALTHY'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'OVERSTOCKED'
  | 'BLOCKED';

export type InventorySkuSummary = {
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  mainImageUrl?: string;
  status: InventorySkuStatus;
  onHandTotal: number;
  reservedTotal: number;
  availableTotal: number;
  inboundTotal: number;
  locationIds: string[];
  avgDailySales30d?: number;
  isTopSeller?: boolean;
  isSlowMover?: boolean;
};

export type InventorySkuLocationRow = {
  locationId: string;
  locationName: string;
  locationType: InventoryLocationType;
  onHand: number;
  reserved: number;
  available: number;
  inbound: number;
  lastUpdatedAt?: string;
};

export type InventorySkuDemandInsight = {
  avgDailySales30d: number;
  avgDailySales90d: number;
  trend: 'UP' | 'DOWN' | 'FLAT';
  forecastStockoutDays?: number;
  forecastConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
};

export type InventorySkuAgingBucket = {
  bucketLabel: string;
  units: number;
  percentage: number;
};

export type InventorySkuActivityEvent = {
  id: string;
  kind:
    | 'INBOUND'
    | 'OUTBOUND'
    | 'ADJUSTMENT'
    | 'TRANSFER'
    | 'RESERVATION'
    | 'CANCELLATION';
  description: string;
  quantity: number;
  locationName?: string;
  createdAt: string;
};

export type InventorySkuDetail = {
  sku: InventorySkuSummary;
  locations: InventorySkuLocationRow[];
  demand: InventorySkuDemandInsight;
  aging: InventorySkuAgingBucket[];
  activity: InventorySkuActivityEvent[];
};

export type ReplenishmentSuggestionPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type ReplenishmentSuggestion = {
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  mainImageUrl?: string;
  currentAvailable: number;
  avgDailySales30d: number;
  targetDaysOfCover: number;
  recommendedQty: number;
  recommendedShipFromLocation?: string;
  recommendedShipToLocation?: string;
  priority: ReplenishmentSuggestionPriority;
  reason: string;
};

export type InventoryOverviewSnapshot = {
  totalSkus: number;
  totalOnHand: number;
  totalAvailable: number;
  lowStockSkus: number;
  outOfStockSkus: number;
  overstockedSkus: number;
  topAtRiskSkus: InventorySkuSummary[];
};

export type InventoryFilter = {
  search?: string;
  status?: InventorySkuStatus | 'ALL';
  locationId?: string;
  onlyLowStock?: boolean;
  onlyOverstock?: boolean;
  hasInbound?: boolean;
};