/**
 * Base Connector Interface for Marketplace Integrations
 * All marketplace connectors must implement this interface
 */

export interface ConnectorHealth {
  status: 'healthy' | 'degraded' | 'error' | 'disconnected';
  lastChecked: Date;
  message?: string;
  latency?: number;
}

export interface SyncResult {
  success: boolean;
  itemsProcessed: number;
  itemsSucceeded: number;
  itemsFailed: number;
  errors?: Array<{
    item: string;
    error: string;
  }>;
  duration: number;
}

export interface OrderData {
  externalOrderId: string;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  lineItems: Array<{
    productSku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  orderedAt: Date;
  paidAt?: Date;
  status: string;
}

export interface ListingData {
  externalId: string;
  sku: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrls?: string[];
  status: 'active' | 'draft' | 'paused' | 'error';
  publishedAt?: Date;
}

export interface InventoryData {
  sku: string;
  available: number;
  reserved?: number;
  location?: string;
}

export interface PricingData {
  sku: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  effectiveDate: Date;
  fees?: {
    commission: number;
    shipping: number;
    other: number;
  };
}

export interface ProductResearchData {
  asin?: string;
  sku: string;
  title: string;
  currentPrice: number;
  salesRank?: number;
  reviewCount?: number;
  rating?: number;
  categoryBsr?: number;
  estimatedMonthlySales?: number;
}

/**
 * Base marketplace connector interface
 */
export interface MarketplaceConnector {
  /**
   * Get connector name/type
   */
  getName(): string;

  /**
   * Check connector health and connection status
   */
  getHealth(orgId: string, channelId: string): Promise<ConnectorHealth>;

  /**
   * Sync orders from marketplace
   */
  syncOrders(
    orgId: string,
    channelId: string,
    since?: Date
  ): Promise<{ orders: OrderData[]; result: SyncResult }>;

  /**
   * Sync listings to marketplace
   */
  syncListings(
    orgId: string,
    channelId: string
  ): Promise<{ listings: ListingData[]; result: SyncResult }>;

  /**
   * Sync inventory levels
   */
  syncInventory(
    orgId: string,
    channelId: string
  ): Promise<{ inventory: InventoryData[]; result: SyncResult }>;

  /**
   * Fetch current pricing for SKUs
   */
  fetchPricing(
    orgId: string,
    channelId: string,
    skuIds: string[]
  ): Promise<{ pricing: PricingData[]; result: SyncResult }>;

  /**
   * Create or update a listing
   */
  upsertListing?(
    orgId: string,
    channelId: string,
    listing: Partial<ListingData>
  ): Promise<{ success: boolean; externalId?: string; error?: string }>;

  /**
   * Update inventory for a SKU
   */
  updateInventory?(
    orgId: string,
    channelId: string,
    sku: string,
    quantity: number
  ): Promise<{ success: boolean; error?: string }>;

  /**
   * Update price for a SKU
   */
  updatePrice?(
    orgId: string,
    channelId: string,
    sku: string,
    price: number
  ): Promise<{ success: boolean; error?: string }>;

  /**
   * Product research capabilities (mainly for Amazon)
   */
  researchProduct?(
    orgId: string,
    channelId: string,
    asinOrKeyword: string
  ): Promise<{ products: ProductResearchData[]; result: SyncResult }>;
}

/**
 * Base connector class with common functionality
 */
export abstract class BaseConnector implements MarketplaceConnector {
  protected abstract connectorName: string;

  getName(): string {
    return this.connectorName;
  }

  protected async measureOperation<T>(
    operation: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await operation();
    const duration = Date.now() - start;
    return { result, duration };
  }

  protected createSuccessResult(
    itemsProcessed: number,
    duration: number
  ): SyncResult {
    return {
      success: true,
      itemsProcessed,
      itemsSucceeded: itemsProcessed,
      itemsFailed: 0,
      duration,
    };
  }

  protected createFailureResult(
    error: string,
    duration: number
  ): SyncResult {
    return {
      success: false,
      itemsProcessed: 0,
      itemsSucceeded: 0,
      itemsFailed: 0,
      errors: [{ item: 'connection', error }],
      duration,
    };
  }

  abstract getHealth(orgId: string, channelId: string): Promise<ConnectorHealth>;
  abstract syncOrders(orgId: string, channelId: string, since?: Date): Promise<{ orders: OrderData[]; result: SyncResult }>;
  abstract syncListings(orgId: string, channelId: string): Promise<{ listings: ListingData[]; result: SyncResult }>;
  abstract syncInventory(orgId: string, channelId: string): Promise<{ inventory: InventoryData[]; result: SyncResult }>;
  abstract fetchPricing(orgId: string, channelId: string, skuIds: string[]): Promise<{ pricing: PricingData[]; result: SyncResult }>;
}

/**
 * Connector registry
 */
export class ConnectorRegistry {
  private static connectors = new Map<string, MarketplaceConnector>();

  static register(type: string, connector: MarketplaceConnector) {
    this.connectors.set(type, connector);
  }

  static get(type: string): MarketplaceConnector | undefined {
    return this.connectors.get(type);
  }

  static getAll(): Map<string, MarketplaceConnector> {
    return new Map(this.connectors);
  }
}
