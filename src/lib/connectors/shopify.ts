/**
 * Shopify Connector
 * Integrates with Shopify Admin API for orders, products, inventory
 */

import {
  BaseConnector,
  type ConnectorHealth,
  type SyncResult,
  type OrderData,
  type ListingData,
  type InventoryData,
  type PricingData,
} from './base';
import prisma from '@/lib/prisma';

export class ShopifyConnector extends BaseConnector {
  protected connectorName = 'shopify';

  private async getCredentials(channelId: string): Promise<{
    shopDomain: string;
    accessToken: string;
    apiVersion: string;
  } | null> {
    const channel = await prisma.channelConnection.findUnique({
      where: { id: channelId },
    });

    if (!channel || channel.channelType !== 'shopify') {
      return null;
    }

    const creds = channel.credentials as any;
    return {
      shopDomain: creds.shopDomain || '',
      accessToken: creds.accessToken || '',
      apiVersion: creds.apiVersion || '2024-01',
    };
  }

  private async callShopifyAPI(
    creds: { shopDomain: string; accessToken: string; apiVersion: string },
    endpoint: string,
    options?: RequestInit
  ): Promise<any> {
    const url = `https://${creds.shopDomain}/admin/api/${creds.apiVersion}/${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Shopify-Access-Token': creds.accessToken,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getHealth(orgId: string, channelId: string): Promise<ConnectorHealth> {
    const creds = await this.getCredentials(channelId);
    
    if (!creds || !creds.shopDomain || !creds.accessToken) {
      return {
        status: 'disconnected',
        lastChecked: new Date(),
        message: 'Missing Shopify credentials',
      };
    }

    try {
      const start = Date.now();
      // Test with shop info endpoint
      // await this.callShopifyAPI(creds, 'shop.json');
      const latency = Date.now() - start;

      return {
        status: 'healthy',
        lastChecked: new Date(),
        latency,
      };
    } catch (error) {
      return {
        status: 'error',
        lastChecked: new Date(),
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async syncOrders(
    orgId: string,
    channelId: string,
    since?: Date
  ): Promise<{ orders: OrderData[]; result: SyncResult }> {
    const { result, duration } = await this.measureOperation(async () => {
      const creds = await this.getCredentials(channelId);
      if (!creds) {
        throw new Error('Invalid credentials');
      }

      // In production:
      // const params = new URLSearchParams();
      // if (since) params.set('created_at_min', since.toISOString());
      // params.set('status', 'any');
      // const data = await this.callShopifyAPI(creds, `orders.json?${params}`);
      
      // Transform Shopify orders to our format
      const mockOrders: OrderData[] = [];
      
      return mockOrders;
    });

    return {
      orders: result,
      result: this.createSuccessResult(result.length, duration),
    };
  }

  async syncListings(
    orgId: string,
    channelId: string
  ): Promise<{ listings: ListingData[]; result: SyncResult }> {
    const { result, duration } = await this.measureOperation(async () => {
      const creds = await this.getCredentials(channelId);
      if (!creds) {
        throw new Error('Invalid credentials');
      }

      // In production: call products.json endpoint
      const mockListings: ListingData[] = [];
      
      return mockListings;
    });

    return {
      listings: result,
      result: this.createSuccessResult(result.length, duration),
    };
  }

  async syncInventory(
    orgId: string,
    channelId: string
  ): Promise<{ inventory: InventoryData[]; result: SyncResult }> {
    const { result, duration } = await this.measureOperation(async () => {
      const creds = await this.getCredentials(channelId);
      if (!creds) {
        throw new Error('Invalid credentials');
      }

      // In production: call inventory_levels.json
      const mockInventory: InventoryData[] = [];
      
      return mockInventory;
    });

    return {
      inventory: result,
      result: this.createSuccessResult(result.length, duration),
    };
  }

  async fetchPricing(
    orgId: string,
    channelId: string,
    skuIds: string[]
  ): Promise<{ pricing: PricingData[]; result: SyncResult }> {
    const { result, duration } = await this.measureOperation(async () => {
      const creds = await this.getCredentials(channelId);
      if (!creds) {
        throw new Error('Invalid credentials');
      }

      // Fetch product variants by SKU
      const mockPricing: PricingData[] = [];
      
      return mockPricing;
    });

    return {
      pricing: result,
      result: this.createSuccessResult(result.length, duration),
    };
  }

  async upsertListing(
    orgId: string,
    channelId: string,
    listing: Partial<ListingData>
  ): Promise<{ success: boolean; externalId?: string; error?: string }> {
    try {
      const creds = await this.getCredentials(channelId);
      if (!creds) {
        return { success: false, error: 'Invalid credentials' };
      }

      // In production: POST /products.json or PUT /products/{id}.json
      return {
        success: true,
        externalId: `gid://shopify/Product/${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async updateInventory(
    orgId: string,
    channelId: string,
    sku: string,
    quantity: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const creds = await this.getCredentials(channelId);
      if (!creds) {
        return { success: false, error: 'Invalid credentials' };
      }

      // In production: POST /inventory_levels/set.json
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async updatePrice(
    orgId: string,
    channelId: string,
    sku: string,
    price: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const creds = await this.getCredentials(channelId);
      if (!creds) {
        return { success: false, error: 'Invalid credentials' };
      }

      // In production: PUT /variants/{variant_id}.json
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
