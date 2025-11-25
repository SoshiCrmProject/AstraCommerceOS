/**
 * Connector Registry and Initialization
 * Registers all marketplace connectors
 */

import { ConnectorRegistry } from './base';
import { AmazonConnector } from './amazon';
import { ShopifyConnector } from './shopify';
// Import other connectors as we build them

// Register all connectors
ConnectorRegistry.register('amazon', new AmazonConnector());
ConnectorRegistry.register('shopify', new ShopifyConnector());

// Stub connectors for other marketplaces (implement similar to Amazon/Shopify)
import { BaseConnector, type ConnectorHealth, type SyncResult, type OrderData, type ListingData, type InventoryData, type PricingData } from './base';

class ShopeeConnector extends BaseConnector {
  protected connectorName = 'shopee';
  async getHealth(): Promise<ConnectorHealth> {
    return { status: 'disconnected', lastChecked: new Date(), message: 'Not implemented yet' };
  }
  async syncOrders(): Promise<{ orders: OrderData[]; result: SyncResult }> {
    return { orders: [], result: this.createSuccessResult(0, 0) };
  }
  async syncListings(): Promise<{ listings: ListingData[]; result: SyncResult }> {
    return { listings: [], result: this.createSuccessResult(0, 0) };
  }
  async syncInventory(): Promise<{ inventory: InventoryData[]; result: SyncResult }> {
    return { inventory: [], result: this.createSuccessResult(0, 0) };
  }
  async fetchPricing(): Promise<{ pricing: PricingData[]; result: SyncResult }> {
    return { pricing: [], result: this.createSuccessResult(0, 0) };
  }
}

class EbayConnector extends BaseConnector {
  protected connectorName = 'ebay';
  async getHealth(): Promise<ConnectorHealth> {
    return { status: 'disconnected', lastChecked: new Date(), message: 'Not implemented yet' };
  }
  async syncOrders(): Promise<{ orders: OrderData[]; result: SyncResult }> {
    return { orders: [], result: this.createSuccessResult(0, 0) };
  }
  async syncListings(): Promise<{ listings: ListingData[]; result: SyncResult }> {
    return { listings: [], result: this.createSuccessResult(0, 0) };
  }
  async syncInventory(): Promise<{ inventory: InventoryData[]; result: SyncResult }> {
    return { inventory: [], result: this.createSuccessResult(0, 0) };
  }
  async fetchPricing(): Promise<{ pricing: PricingData[]; result: SyncResult }> {
    return { pricing: [], result: this.createSuccessResult(0, 0) };
  }
}

class RakutenConnector extends BaseConnector {
  protected connectorName = 'rakuten';
  async getHealth(): Promise<ConnectorHealth> {
    return { status: 'disconnected', lastChecked: new Date(), message: 'Not implemented yet' };
  }
  async syncOrders(): Promise<{ orders: OrderData[]; result: SyncResult }> {
    return { orders: [], result: this.createSuccessResult(0, 0) };
  }
  async syncListings(): Promise<{ listings: ListingData[]; result: SyncResult }> {
    return { listings: [], result: this.createSuccessResult(0, 0) };
  }
  async syncInventory(): Promise<{ inventory: InventoryData[]; result: SyncResult }> {
    return { inventory: [], result: this.createSuccessResult(0, 0) };
  }
  async fetchPricing(): Promise<{ pricing: PricingData[]; result: SyncResult }> {
    return { pricing: [], result: this.createSuccessResult(0, 0) };
  }
}

class WalmartConnector extends BaseConnector {
  protected connectorName = 'walmart';
  async getHealth(): Promise<ConnectorHealth> {
    return { status: 'disconnected', lastChecked: new Date(), message: 'Not implemented yet' };
  }
  async syncOrders(): Promise<{ orders: OrderData[]; result: SyncResult }> {
    return { orders: [], result: this.createSuccessResult(0, 0) };
  }
  async syncListings(): Promise<{ listings: ListingData[]; result: SyncResult }> {
    return { listings: [], result: this.createSuccessResult(0, 0) };
  }
  async syncInventory(): Promise<{ inventory: InventoryData[]; result: SyncResult }> {
    return { inventory: [], result: this.createSuccessResult(0, 0) };
  }
  async fetchPricing(): Promise<{ pricing: PricingData[]; result: SyncResult }> {
    return { pricing: [], result: this.createSuccessResult(0, 0) };
  }
}

class YahooConnector extends BaseConnector {
  protected connectorName = 'yahoo';
  async getHealth(): Promise<ConnectorHealth> {
    return { status: 'disconnected', lastChecked: new Date(), message: 'Not implemented yet' };
  }
  async syncOrders(): Promise<{ orders: OrderData[]; result: SyncResult }> {
    return { orders: [], result: this.createSuccessResult(0, 0) };
  }
  async syncListings(): Promise<{ listings: ListingData[]; result: SyncResult }> {
    return { listings: [], result: this.createSuccessResult(0, 0) };
  }
  async syncInventory(): Promise<{ inventory: InventoryData[]; result: SyncResult }> {
    return { inventory: [], result: this.createSuccessResult(0, 0) };
  }
  async fetchPricing(): Promise<{ pricing: PricingData[]; result: SyncResult }> {
    return { pricing: [], result: this.createSuccessResult(0, 0) };
  }
}

class MercariConnector extends BaseConnector {
  protected connectorName = 'mercari';
  async getHealth(): Promise<ConnectorHealth> {
    return { status: 'disconnected', lastChecked: new Date(), message: 'Not implemented yet' };
  }
  async syncOrders(): Promise<{ orders: OrderData[]; result: SyncResult }> {
    return { orders: [], result: this.createSuccessResult(0, 0) };
  }
  async syncListings(): Promise<{ listings: ListingData[]; result: SyncResult }> {
    return { listings: [], result: this.createSuccessResult(0, 0) };
  }
  async syncInventory(): Promise<{ inventory: InventoryData[]; result: SyncResult }> {
    return { inventory: [], result: this.createSuccessResult(0, 0) };
  }
  async fetchPricing(): Promise<{ pricing: PricingData[]; result: SyncResult }> {
    return { pricing: [], result: this.createSuccessResult(0, 0) };
  }
}

class TikTokConnector extends BaseConnector {
  protected connectorName = 'tiktok';
  async getHealth(): Promise<ConnectorHealth> {
    return { status: 'disconnected', lastChecked: new Date(), message: 'Not implemented yet' };
  }
  async syncOrders(): Promise<{ orders: OrderData[]; result: SyncResult }> {
    return { orders: [], result: this.createSuccessResult(0, 0) };
  }
  async syncListings(): Promise<{ listings: ListingData[]; result: SyncResult }> {
    return { listings: [], result: this.createSuccessResult(0, 0) };
  }
  async syncInventory(): Promise<{ inventory: InventoryData[]; result: SyncResult }> {
    return { inventory: [], result: this.createSuccessResult(0, 0) };
  }
  async fetchPricing(): Promise<{ pricing: PricingData[]; result: SyncResult }> {
    return { pricing: [], result: this.createSuccessResult(0, 0) };
  }
}

// Register stub connectors
ConnectorRegistry.register('shopee', new ShopeeConnector());
ConnectorRegistry.register('ebay', new EbayConnector());
ConnectorRegistry.register('rakuten', new RakutenConnector());
ConnectorRegistry.register('walmart', new WalmartConnector());
ConnectorRegistry.register('yahoo', new YahooConnector());
ConnectorRegistry.register('mercari', new MercariConnector());
ConnectorRegistry.register('tiktok', new TikTokConnector());

export { ConnectorRegistry };
export * from './base';
export * from './amazon';
export * from './shopify';
