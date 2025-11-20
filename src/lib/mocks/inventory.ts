import {
  InventoryLocationSummary,
  InventorySkuSummary,
  InventorySkuDetail,
  ReplenishmentSuggestion,
  InventorySkuLocationRow,
  InventorySkuDemandInsight,
  InventorySkuAgingBucket
} from '../services/inventory-types';

export const mockLocations: InventoryLocationSummary[] = [
  {
    id: 'loc_001',
    name: 'Amazon FBA JP',
    type: 'FBA',
    country: 'JP',
    region: 'Tokyo',
    skuCount: 245,
    totalOnHand: 12450,
    totalAvailable: 11200,
    lowStockCount: 23
  },
  {
    id: 'loc_002',
    name: 'Central Warehouse US',
    type: 'OWN_WAREHOUSE',
    country: 'US',
    region: 'California',
    skuCount: 189,
    totalOnHand: 8900,
    totalAvailable: 8100,
    lowStockCount: 15
  },
  {
    id: 'loc_003',
    name: 'Shopify FBM',
    type: 'FBM',
    country: 'US',
    skuCount: 156,
    totalOnHand: 3400,
    totalAvailable: 3200,
    lowStockCount: 8
  },
  {
    id: 'loc_004',
    name: '3PL Singapore',
    type: '3PL',
    country: 'SG',
    region: 'Singapore',
    skuCount: 98,
    totalOnHand: 2100,
    totalAvailable: 1950,
    lowStockCount: 12
  }
];

export const mockInventorySkus: InventorySkuSummary[] = [
  {
    skuId: 'sku_001',
    skuCode: 'WH-001-BLK',
    productId: 'prod_001',
    productName: 'Premium Wireless Headphones',
    mainImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    status: 'HEALTHY',
    totalOnHand: 450,
    totalAvailable: 420,
    totalReserved: 30,
    locationsCount: 3,
    daysOfCoverEstimate: 45,
    avgDailySales30d: 9.2,
    pendingInboundUnits: 200
  },
  {
    skuId: 'sku_002',
    skuCode: 'FT-002-RED',
    productId: 'prod_002',
    productName: 'Smart Fitness Tracker',
    mainImageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300',
    status: 'LOW_STOCK',
    totalOnHand: 45,
    totalAvailable: 35,
    totalReserved: 10,
    locationsCount: 2,
    daysOfCoverEstimate: 8,
    avgDailySales30d: 4.5,
    pendingInboundUnits: 100
  },
  {
    skuId: 'sku_003',
    skuCode: 'TS-003-WHT-M',
    productId: 'prod_003',
    productName: 'Organic Cotton T-Shirt',
    mainImageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    status: 'OUT_OF_STOCK',
    totalOnHand: 0,
    totalAvailable: 0,
    totalReserved: 0,
    locationsCount: 0,
    daysOfCoverEstimate: 0,
    avgDailySales30d: 12.3,
    pendingInboundUnits: 500
  },
  {
    skuId: 'sku_004',
    skuCode: 'SP-004-BLU',
    productId: 'prod_004',
    productName: 'Bluetooth Speaker Pro',
    mainImageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
    status: 'OVERSTOCKED',
    totalOnHand: 890,
    totalAvailable: 850,
    totalReserved: 40,
    locationsCount: 4,
    daysOfCoverEstimate: 180,
    avgDailySales30d: 4.9,
    pendingInboundUnits: 0
  }
];

export const mockReplenishmentSuggestions: ReplenishmentSuggestion[] = [
  {
    skuId: 'sku_002',
    skuCode: 'FT-002-RED',
    productName: 'Smart Fitness Tracker',
    currentAvailable: 35,
    avgDailySales30d: 4.5,
    targetDaysOfCover: 30,
    recommendedReplenishQty: 100,
    recommendedShipFromLocation: 'Central Warehouse US',
    recommendedShipToLocation: 'Amazon FBA JP',
    priority: 'HIGH',
    reason: 'Stockout risk within 8 days'
  },
  {
    skuId: 'sku_003',
    skuCode: 'TS-003-WHT-M',
    productName: 'Organic Cotton T-Shirt',
    currentAvailable: 0,
    avgDailySales30d: 12.3,
    targetDaysOfCover: 30,
    recommendedReplenishQty: 370,
    recommendedShipFromLocation: 'Central Warehouse US',
    recommendedShipToLocation: 'Amazon FBA JP',
    priority: 'HIGH',
    reason: 'Currently out of stock'
  }
];

export const getMockSkuDetail = (skuId: string): InventorySkuDetail => {
  const sku = mockInventorySkus.find(s => s.skuId === skuId) || mockInventorySkus[0];
  
  const locations: InventorySkuLocationRow[] = [
    {
      locationId: 'loc_001',
      locationName: 'Amazon FBA JP',
      locationType: 'FBA',
      onHand: Math.floor(sku.totalOnHand * 0.6),
      reserved: Math.floor(sku.totalReserved * 0.7),
      available: Math.floor(sku.totalAvailable * 0.6),
      incoming: sku.pendingInboundUnits || 0,
      lastUpdatedAt: '2024-01-15T10:30:00Z'
    },
    {
      locationId: 'loc_002',
      locationName: 'Central Warehouse US',
      locationType: 'OWN_WAREHOUSE',
      onHand: Math.floor(sku.totalOnHand * 0.4),
      reserved: Math.floor(sku.totalReserved * 0.3),
      available: Math.floor(sku.totalAvailable * 0.4),
      incoming: 0,
      lastUpdatedAt: '2024-01-15T08:15:00Z'
    }
  ];

  const demand: InventorySkuDemandInsight = {
    avgDailySales30d: sku.avgDailySales30d || 0,
    avgDailySales90d: (sku.avgDailySales30d || 0) * 0.9,
    trend: 'UP',
    stockoutRiskDays: sku.daysOfCoverEstimate
  };

  const aging: InventorySkuAgingBucket[] = [
    { bucketLabel: '0–30 days', units: Math.floor(sku.totalOnHand * 0.6), percentage: 60 },
    { bucketLabel: '31–60 days', units: Math.floor(sku.totalOnHand * 0.25), percentage: 25 },
    { bucketLabel: '61–90 days', units: Math.floor(sku.totalOnHand * 0.1), percentage: 10 },
    { bucketLabel: '90+ days', units: Math.floor(sku.totalOnHand * 0.05), percentage: 5 }
  ];

  return { sku, locations, demand, aging };
};