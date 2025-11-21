import type { Locale } from './config';

export type InventoryDictionary = {
  title: string;
  subtitle: string;
  tabs: {
    overview: string;
    locations: string;
    replenishment: string;
  };
  kpis: {
    totalSkus: string;
    onHand: string;
    available: string;
    lowStock: string;
    lowStockDesc: string;
    outOfStock: string;
    outOfStockDesc: string;
    overstocked: string;
    overstockedDesc: string;
  };
  filters: {
    search: string;
    searchPlaceholder: string;
    status: string;
    allStatuses: string;
    location: string;
    allLocations: string;
    quickFilters: string;
    lowStock: string;
    overstock: string;
    hasInbound: string;
  };
  statuses: {
    healthy: string;
    lowStock: string;
    outOfStock: string;
    overstocked: string;
    blocked: string;
  };
  table: {
    product: string;
    status: string;
    onHand: string;
    reserved: string;
    available: string;
    inbound: string;
    locations: string;
    avgSales: string;
    noItems: string;
    tryAdjusting: string;
    topSeller: string;
    slowMover: string;
  };
  detail: {
    title: string;
    onHand: string;
    reserved: string;
    available: string;
    inbound: string;
    locationsBreakdown: string;
    demandForecast: string;
    avgSales30d: string;
    avgSales90d: string;
    demandTrend: string;
    daysOfCover: string;
    daysOfCoverDesc: string;
    stockoutRisk: string;
    stockoutInDays: string;
    forecastConfidence: string;
    inventoryAging: string;
    noAgingData: string;
    freshInventory: string;
    agedInventory: string;
    recentActivity: string;
    noActivity: string;
    quickActions: string;
    adjustStock: string;
    createTransfer: string;
    generatePO: string;
    viewSalesHistory: string;
  };
  trend: {
    increasing: string;
    decreasing: string;
    stable: string;
  };
  locations: {
    title: string;
    subtitle: string;
    totalLocations: string;
    totalOnHand: string;
    totalAvailable: string;
    totalInbound: string;
    noLocations: string;
    skuCount: string;
    types: {
      fba: string;
      fbm: string;
      ownWarehouse: string;
      thirdParty3pl: string;
    };
  };
  replenishment: {
    title: string;
    subtitle: string;
    totalSuggestions: string;
    highPriority: string;
    mediumPriority: string;
    totalUnitsNeeded: string;
    priorityFilter: string;
    allPriorities: string;
    targetDaysOfCover: string;
    generateBulkPO: string;
    noSuggestions: string;
    allWellStocked: string;
    table: {
      priority: string;
      product: string;
      currentAvailable: string;
      dailySales: string;
      targetDays: string;
      recommendedQty: string;
      transferRoute: string;
      reason: string;
      transfer: string;
      to: string;
    };
    priorities: {
      high: string;
      medium: string;
      low: string;
    };
  };
  atRisk: {
    title: string;
    subtitle: string;
    noAtRisk: string;
    available: string;
    dailySales: string;
    inbound: string;
    viewAll: string;
  };
  aiCopilot: {
    title: string;
    subtitle: string;
    askAI: string;
    criticalAlert: string;
    demandSurge: string;
    optimization: string;
    demandForecast: string;
    pricingInsight: string;
    bulkOptimization: string;
    leadTimeWarning: string;
    actions: {
      viewReplenishment: string;
      analyzeTrend: string;
      createTransfer: string;
      generatePO: string;
      reviewPricing: string;
      createBulkPO: string;
      adjustSettings: string;
    };
  };
  activity: {
    inbound: string;
    outbound: string;
    adjustment: string;
    transfer: string;
    reservation: string;
    cancellation: string;
    today: string;
    daysAgo: string;
    weeksAgo: string;
    monthsAgo: string;
  };
  pagination: {
    showing: string;
    previous: string;
    next: string;
  };
};

export async function getInventoryDictionary(
  locale: Locale
): Promise<InventoryDictionary> {
  const dict = await import(`./locales/${locale}/app.inventory.json`);
  return dict.default;
}
