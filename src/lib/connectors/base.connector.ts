/**
 * Base Marketplace Connector Interface
 * All marketplace connectors must implement this interface
 */

import type { ChannelConnection } from '@prisma/client';

export interface ConnectorHealth {
  status: 'healthy' | 'degraded' | 'error' | 'unknown';
  lastCheck: Date;
  message?: string;
  responseTime?: number;
}

export interface SyncResult {
  success: boolean;
  itemsProcessed: number;
  itemsSucceeded: number;
  itemsFailed: number;
  errors?: Array<{ item: string; error: string }>;
  duration: number;
}

export interface PricingResult {
  skuId: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  competitorPrices?: Array<{
    seller: string;
    price: number;
  }>;
}

export interface OrderData {
  externalOrderId: string;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    zip: string;
    country: string;
  };
  lineItems: Array<{
    externalProductId: string;
    productName: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  orderedAt: Date;
  metadata?: any;
}

export interface ListingData {
  externalId: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrls?: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
  metadata?: any;
}

export interface MarketplaceConnector {
  /**
   * Get connector name
   */
  getName(): string;

  /**
   * Get connector type (amazon, shopify, etc.)
   */
  getType(): string;

  /**
   * Initialize connector with credentials
   */
  initialize(credentials: any, config?: any): Promise<void>;

  /**
   * Check connector health
   */
  getHealth(): Promise<ConnectorHealth>;

  /**
   * Sync orders from marketplace
   */
  syncOrders(since?: Date): Promise<SyncResult>;

  /**
   * Sync listings from marketplace
   */
  syncListings(): Promise<SyncResult>;

  /**
   * Sync inventory levels
   */
  syncInventory(): Promise<SyncResult>;

  /**
   * Fetch pricing data for SKUs
   */
  fetchPricing(skuIds: string[]): Promise<PricingResult[]>;

  /**
   * Push listing to marketplace
   */
  pushListing(listing: {
    sku: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    imageUrls: string[];
  }): Promise<{ success: boolean; externalId?: string; error?: string }>;

  /**
   * Update listing on marketplace
   */
  updateListing(
    externalId: string,
    updates: {
      price?: number;
      quantity?: number;
      title?: string;
      description?: string;
    }
  ): Promise<{ success: boolean; error?: string }>;

  /**
   * Delete/delist item from marketplace
   */
  deleteListing(externalId: string): Promise<{ success: boolean; error?: string }>;
}

export abstract class BaseConnector implements MarketplaceConnector {
  protected credentials: any;
  protected config: any;
  protected lastHealthCheck?: Date;

  abstract getName(): string;
  abstract getType(): string;

  async initialize(credentials: any, config?: any): Promise<void> {
    this.credentials = credentials;
    this.config = config || {};
  }

  abstract getHealth(): Promise<ConnectorHealth>;
  abstract syncOrders(since?: Date): Promise<SyncResult>;
  abstract syncListings(): Promise<SyncResult>;
  abstract syncInventory(): Promise<SyncResult>;
  abstract fetchPricing(skuIds: string[]): Promise<PricingResult[]>;
  abstract pushListing(listing: any): Promise<any>;
  abstract updateListing(externalId: string, updates: any): Promise<any>;
  abstract deleteListing(externalId: string): Promise<any>;

  /**
   * Helper to measure sync duration
   */
  protected async measureSync<T>(
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return { result, duration };
  }

  /**
   * Helper to create sync result
   */
  protected createSyncResult(
    processed: number,
    succeeded: number,
    failed: number,
    duration: number,
    errors: Array<{ item: string; error: string }> = []
  ): SyncResult {
    return {
      success: failed === 0,
      itemsProcessed: processed,
      itemsSucceeded: succeeded,
      itemsFailed: failed,
      errors: errors.length > 0 ? errors : undefined,
      duration,
    };
  }
}
