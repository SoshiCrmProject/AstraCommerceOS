import type {
  InventoryLocationSummary,
  InventorySkuSummary,
  InventorySkuDetail,
  InventoryOverviewSnapshot,
  InventoryFilter,
  ReplenishmentSuggestion,
} from './inventory-types';
import { mockInventoryData } from '../mocks/mock-inventory-data';

export type PaginatedInventorySkuResult = {
  items: InventorySkuSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ReplenishmentParams = {
  targetDaysOfCover?: number;
  priorityFilter?: 'HIGH' | 'MEDIUM' | 'LOW' | 'ALL';
  locationId?: string;
};

export class InventoryService {
  /**
   * Get high-level inventory overview snapshot
   * Returns KPIs, totals, and at-risk SKUs for dashboard
   */
  static async getInventoryOverview(
    orgId: string
  ): Promise<InventoryOverviewSnapshot> {
    // In production: fetch from Supabase with orgId filter
    // For now: return mock data
    await new Promise((r) => setTimeout(r, 100));

    const { skuList, locations } = mockInventoryData;

    // Calculate aggregates
    const totalOnHand = skuList.reduce(
      (sum, sku) => sum + sku.onHandTotal,
      0
    );
    const totalAvailable = skuList.reduce(
      (sum, sku) => sum + sku.availableTotal,
      0
    );

    const lowStockSkus = skuList.filter(
      (sku) => sku.status === 'LOW_STOCK'
    ).length;
    const outOfStockSkus = skuList.filter(
      (sku) => sku.status === 'OUT_OF_STOCK'
    ).length;
    const overstockedSkus = skuList.filter(
      (sku) => sku.status === 'OVERSTOCKED'
    ).length;

    // Top at-risk SKUs: LOW_STOCK or OUT_OF_STOCK, sorted by revenue impact
    const atRiskSkus = skuList
      .filter(
        (sku) => sku.status === 'LOW_STOCK' || sku.status === 'OUT_OF_STOCK'
      )
      .sort((a, b) => {
        // Prioritize OUT_OF_STOCK, then by revenue
        if (a.status === 'OUT_OF_STOCK' && b.status !== 'OUT_OF_STOCK')
          return -1;
        if (a.status !== 'OUT_OF_STOCK' && b.status === 'OUT_OF_STOCK')
          return 1;
        return (b.avgDailySales30d || 0) - (a.avgDailySales30d || 0);
      })
      .slice(0, 5);

    return {
      totalSkus: skuList.length,
      totalOnHand,
      totalAvailable,
      lowStockSkus,
      outOfStockSkus,
      overstockedSkus,
      topAtRiskSkus: atRiskSkus,
    };
  }

  /**
   * Get list of all inventory locations
   * Returns summary stats for each warehouse/FBA/3PL location
   */
  static async getInventoryLocations(
    orgId: string
  ): Promise<InventoryLocationSummary[]> {
    // In production: fetch from Supabase
    await new Promise((r) => setTimeout(r, 100));

    return mockInventoryData.locations;
  }

  /**
   * Get paginated list of SKUs with filtering
   * Main table view with search, status filters, location filters
   */
  static async getInventorySkuList(
    orgId: string,
    filter: InventoryFilter = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 25 }
  ): Promise<PaginatedInventorySkuResult> {
    // In production: fetch from Supabase with filters
    await new Promise((r) => setTimeout(r, 120));

    let { skuList } = mockInventoryData;

    // Apply filters
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      skuList = skuList.filter(
        (sku) =>
          sku.skuCode.toLowerCase().includes(searchLower) ||
          sku.productName.toLowerCase().includes(searchLower)
      );
    }

    if (filter.status && filter.status !== 'ALL') {
      skuList = skuList.filter((sku) => sku.status === filter.status);
    }

    if (filter.locationId) {
      skuList = skuList.filter((sku) =>
        sku.locationIds.includes(filter.locationId!)
      );
    }

    if (filter.onlyLowStock) {
      skuList = skuList.filter((sku) => sku.status === 'LOW_STOCK');
    }

    if (filter.onlyOverstock) {
      skuList = skuList.filter((sku) => sku.status === 'OVERSTOCKED');
    }

    if (filter.hasInbound) {
      skuList = skuList.filter((sku) => sku.inboundTotal > 0);
    }

    // Pagination
    const totalCount = skuList.length;
    const totalPages = Math.ceil(totalCount / pagination.pageSize);
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const items = skuList.slice(start, end);

    return {
      items,
      totalCount,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages,
    };
  }

  /**
   * Get detailed view of a single SKU
   * Includes locations breakdown, demand insights, aging, activity history
   */
  static async getInventorySkuDetail(
    orgId: string,
    skuId: string
  ): Promise<InventorySkuDetail> {
    // In production: fetch from Supabase with joins
    await new Promise((r) => setTimeout(r, 100));

    const detail = mockInventoryData.skuDetails.find(
      (d) => d.sku.skuId === skuId
    );

    if (!detail) {
      throw new Error(`SKU ${skuId} not found`);
    }

    return detail;
  }

  /**
   * Get replenishment suggestions for low-stock SKUs
   * AI-driven recommendations for stock transfers and reorders
   */
  static async getReplenishmentSuggestions(
    orgId: string,
    params: ReplenishmentParams = {}
  ): Promise<ReplenishmentSuggestion[]> {
    // In production: fetch from Supabase + run AI models
    await new Promise((r) => setTimeout(r, 150));

    let { suggestions } = mockInventoryData;

    // Apply filters
    if (params.priorityFilter && params.priorityFilter !== 'ALL') {
      suggestions = suggestions.filter(
        (s) => s.priority === params.priorityFilter
      );
    }

    if (params.locationId) {
      suggestions = suggestions.filter(
        (s) =>
          s.recommendedShipFromLocation === params.locationId ||
          s.recommendedShipToLocation === params.locationId
      );
    }

    if (params.targetDaysOfCover) {
      // Filter suggestions based on target days of cover
      suggestions = suggestions.filter((s) => {
        const daysOfCover =
          s.avgDailySales30d > 0
            ? s.currentAvailable / s.avgDailySales30d
            : 999;
        return daysOfCover < params.targetDaysOfCover!;
      });
    }

    // Sort by priority: HIGH > MEDIUM > LOW, then by quantity needed
    suggestions.sort((a, b) => {
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];

      if (aPriority !== bPriority) return bPriority - aPriority;
      return b.recommendedQty - a.recommendedQty;
    });

    return suggestions;
  }
}
