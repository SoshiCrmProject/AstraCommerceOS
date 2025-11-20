export type InventoryLocationType =
  | 'FBA'
  | 'FBM'
  | 'OWN_WAREHOUSE'
  | '3PL';

export type InventoryLocationSummary = {
  id: string;
  name: string;
  type: InventoryLocationType;
  country: string;
  region?: string;
  skuCount: number;
  totalOnHand: number;
  totalAvailable: number;
  lowStockCount: number;
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
  totalOnHand: number;
  totalAvailable: number;
  totalReserved: number;
  locationsCount: number;
  daysOfCoverEstimate?: number;
  avgDailySales30d?: number;
  pendingInboundUnits?: number;
};

export type InventorySkuLocationRow = {
  locationId: string;
  locationName: string;
  locationType: InventoryLocationType;
  onHand: number;
  reserved: number;
  available: number;
  incoming: number;
  lastUpdatedAt: string;
};

export type InventorySkuDemandInsight = {
  avgDailySales30d: number;
  avgDailySales90d: number;
  trend: 'UP' | 'DOWN' | 'FLAT';
  stockoutRiskDays?: number;
};

export type InventorySkuAgingBucket = {
  bucketLabel: string;
  units: number;
  percentage: number;
};

export type InventorySkuDetail = {
  sku: InventorySkuSummary;
  locations: InventorySkuLocationRow[];
  demand: InventorySkuDemandInsight;
  aging: InventorySkuAgingBucket[];
};

export type ReplenishmentSuggestion = {
  skuId: string;
  skuCode: string;
  productName: string;
  currentAvailable: number;
  avgDailySales30d: number;
  targetDaysOfCover: number;
  recommendedReplenishQty: number;
  recommendedShipFromLocation?: string;
  recommendedShipToLocation?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
};

export type InventoryFilter = {
  search?: string;
  status?: InventorySkuStatus | 'ALL';
  locationId?: string;
  hasLowStockOnly?: boolean;
  hasOverstockOnly?: boolean;
};