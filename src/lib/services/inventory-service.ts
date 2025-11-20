import {
  InventoryLocationSummary,
  InventorySkuSummary,
  InventorySkuDetail,
  ReplenishmentSuggestion,
  InventoryFilter
} from './inventory-types';
import { mockLocations, mockInventorySkus, mockReplenishmentSuggestions, getMockSkuDetail } from '../mocks/inventory';

export async function getInventoryOverview(
  orgId: string
): Promise<{
  totalSkus: number;
  totalOnHand: number;
  totalAvailable: number;
  lowStockSkus: number;
  outOfStockSkus: number;
  overstockedSkus: number;
  locations: InventoryLocationSummary[];
}> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const skus = mockInventorySkus;
  
  return {
    totalSkus: skus.length,
    totalOnHand: skus.reduce((sum, sku) => sum + sku.totalOnHand, 0),
    totalAvailable: skus.reduce((sum, sku) => sum + sku.totalAvailable, 0),
    lowStockSkus: skus.filter(sku => sku.status === 'LOW_STOCK').length,
    outOfStockSkus: skus.filter(sku => sku.status === 'OUT_OF_STOCK').length,
    overstockedSkus: skus.filter(sku => sku.status === 'OVERSTOCKED').length,
    locations: mockLocations
  };
}

export async function getInventorySkuList(
  orgId: string,
  filter: InventoryFilter,
  pagination: { page: number; pageSize: number }
): Promise<{ items: InventorySkuSummary[]; total: number }> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let skus = [...mockInventorySkus];
  
  if (filter.search) {
    const search = filter.search.toLowerCase();
    skus = skus.filter(sku => 
      sku.skuCode.toLowerCase().includes(search) ||
      sku.productName.toLowerCase().includes(search)
    );
  }
  
  if (filter.status && filter.status !== 'ALL') {
    skus = skus.filter(sku => sku.status === filter.status);
  }
  
  if (filter.hasLowStockOnly) {
    skus = skus.filter(sku => sku.status === 'LOW_STOCK');
  }
  
  if (filter.hasOverstockOnly) {
    skus = skus.filter(sku => sku.status === 'OVERSTOCKED');
  }
  
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  const paginatedItems = skus.slice(start, end);
  
  return {
    items: paginatedItems,
    total: skus.length
  };
}

export async function getInventorySkuDetail(
  orgId: string,
  skuId: string
): Promise<InventorySkuDetail> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return getMockSkuDetail(skuId);
}

export async function getReplenishmentSuggestions(
  orgId: string,
  params: { locationId?: string; maxCount?: number }
): Promise<ReplenishmentSuggestion[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let suggestions = [...mockReplenishmentSuggestions];
  
  if (params.maxCount) {
    suggestions = suggestions.slice(0, params.maxCount);
  }
  
  return suggestions;
}