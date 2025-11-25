/**
 * Inventory Service
 * Manages inventory levels, stock tracking, and warehouse operations
 */

import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface InventoryFilters {
  search?: string;
  location?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
  category?: string;
}

export class InventoryService {
  /**
   * Get inventory items with filters
   */
  static async getInventory(
    orgId: string,
    filters: InventoryFilters = {},
    page: number = 1,
    limit: number = 50
  ) {
    const where: Prisma.InventoryItemWhereInput = {
      orgId,
    };

    if (filters.location) {
      where.location = filters.location;
    }

    if (filters.lowStock) {
      where.AND = [
        { available: { lte: prisma.inventoryItem.fields.safetyStock } },
        { available: { gt: 0 } },
      ];
    }

    if (filters.outOfStock) {
      where.available = { lte: 0 };
    }

    if (filters.search || filters.category) {
      where.sku = {};
      if (filters.search) {
        where.sku.OR = [
          { sku: { contains: filters.search } },
          { name: { contains: filters.search } },
          { product: { name: { contains: filters.search } } },
        ];
      }
      if (filters.category) {
        where.sku.product = { category: filters.category };
      }
    }

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        include: {
          sku: {
            include: {
              product: true,
              listings: {
                include: {
                  channel: true,
                },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inventoryItem.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get inventory item by SKU ID
   */
  static async getInventoryBySku(orgId: string, skuId: string, location: string = 'default') {
    return prisma.inventoryItem.findUnique({
      where: {
        orgId_skuId_location: {
          orgId,
          skuId,
          location,
        },
      },
      include: {
        sku: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /**
   * Update inventory levels
   */
  static async updateInventory(
    orgId: string,
    skuId: string,
    location: string = 'default',
    data: {
      available?: number;
      reserved?: number;
      incoming?: number;
      safetyStock?: number;
      reorderPoint?: number;
      reorderQuantity?: number;
      notes?: string;
    }
  ) {
    return prisma.inventoryItem.upsert({
      where: {
        orgId_skuId_location: {
          orgId,
          skuId,
          location,
        },
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        orgId,
        skuId,
        location,
        available: data.available || 0,
        reserved: data.reserved || 0,
        incoming: data.incoming || 0,
        safetyStock: data.safetyStock || 0,
        reorderPoint: data.reorderPoint || 0,
        reorderQuantity: data.reorderQuantity || 0,
        notes: data.notes,
      },
    });
  }

  /**
   * Adjust inventory (add/subtract)
   */
  static async adjustInventory(
    orgId: string,
    skuId: string,
    location: string = 'default',
    adjustment: number,
    reason?: string
  ) {
    const item = await this.getInventoryBySku(orgId, skuId, location);

    if (!item) {
      throw new Error('Inventory item not found');
    }

    const newAvailable = Math.max(0, item.available + adjustment);

    const updated = await prisma.inventoryItem.update({
      where: {
        orgId_skuId_location: {
          orgId,
          skuId,
          location,
        },
      },
      data: {
        available: newAvailable,
        notes: reason,
        lastCountDate: new Date(),
      },
    });

    // Log the adjustment
    await prisma.logEntry.create({
      data: {
        orgId,
        level: 'info',
        source: 'INVENTORY',
        message: `Inventory adjusted: ${item.sku.sku} by ${adjustment} (${item.available} → ${newAvailable})`,
        entityType: 'inventory',
        entityId: item.id,
        metadata: {
          skuId,
          location,
          previousAvailable: item.available,
          newAvailable,
          adjustment,
          reason,
        },
      },
    });

    return updated;
  }

  /**
   * Reserve inventory for order
   */
  static async reserveInventory(
    orgId: string,
    skuId: string,
    quantity: number,
    location: string = 'default'
  ) {
    const item = await this.getInventoryBySku(orgId, skuId, location);

    if (!item) {
      throw new Error('Inventory item not found');
    }

    if (item.available < quantity) {
      throw new Error(`Insufficient inventory: ${item.available} available, ${quantity} requested`);
    }

    return prisma.inventoryItem.update({
      where: {
        orgId_skuId_location: {
          orgId,
          skuId,
          location,
        },
      },
      data: {
        available: item.available - quantity,
        reserved: item.reserved + quantity,
      },
    });
  }

  /**
   * Release reserved inventory
   */
  static async releaseInventory(
    orgId: string,
    skuId: string,
    quantity: number,
    location: string = 'default'
  ) {
    const item = await this.getInventoryBySku(orgId, skuId, location);

    if (!item) {
      throw new Error('Inventory item not found');
    }

    return prisma.inventoryItem.update({
      where: {
        orgId_skuId_location: {
          orgId,
          skuId,
          location,
        },
      },
      data: {
        available: item.available + quantity,
        reserved: Math.max(0, item.reserved - quantity),
      },
    });
  }

  /**
   * Get low stock items
   */
  static async getLowStockItems(orgId: string) {
    return prisma.inventoryItem.findMany({
      where: {
        orgId,
        AND: [
          { available: { lte: prisma.inventoryItem.fields.safetyStock } },
          { available: { gt: 0 } },
        ],
      },
      include: {
        sku: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { available: 'asc' },
    });
  }

  /**
   * Get out of stock items
   */
  static async getOutOfStockItems(orgId: string) {
    return prisma.inventoryItem.findMany({
      where: {
        orgId,
        available: { lte: 0 },
      },
      include: {
        sku: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /**
   * Get inventory summary
   */
  static async getInventorySummary(orgId: string) {
    const [allItems, lowStock, outOfStock] = await Promise.all([
      prisma.inventoryItem.findMany({
        where: { orgId },
        include: {
          sku: true,
        },
      }),
      this.getLowStockItems(orgId),
      this.getOutOfStockItems(orgId),
    ]);

    const totalValue = allItems.reduce((sum, item) => {
      const costPrice = item.sku.costPrice || 0;
      return sum + item.available * costPrice;
    }, 0);

    const totalUnits = allItems.reduce((sum, item) => sum + item.available, 0);

    return {
      totalItems: allItems.length,
      totalUnits,
      totalValue,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      avgUnitsPerItem: allItems.length > 0 ? totalUnits / allItems.length : 0,
    };
  }

  /**
   * Sync inventory to channel
   */
  static async syncToChannel(orgId: string, skuId: string, channelId: string) {
    const inventory = await this.getInventoryBySku(orgId, skuId);

    if (!inventory) {
      throw new Error('Inventory not found');
    }

    // Update listing quantity
    await prisma.listing.updateMany({
      where: {
        orgId,
        skuId,
        channelId,
      },
      data: {
        quantity: inventory.available,
        lastSyncedAt: new Date(),
      },
    });

    // Log sync
    await prisma.logEntry.create({
      data: {
        orgId,
        level: 'info',
        source: 'INVENTORY',
        message: `Synced inventory to channel: ${inventory.sku.sku}`,
        entityType: 'inventory',
        entityId: inventory.id,
        metadata: {
          skuId,
          channelId,
          quantity: inventory.available,
        },
      },
    });

    return inventory;
  }

  /**
   * Bulk sync inventory to all channels
   */
  static async syncAllToChannels(orgId: string) {
    const items = await prisma.inventoryItem.findMany({
      where: { orgId },
      include: {
        sku: {
          include: {
            listings: true,
          },
        },
      },
    });

    let synced = 0;
    let failed = 0;

    for (const item of items) {
      for (const listing of item.sku.listings) {
        try {
          await prisma.listing.update({
            where: { id: listing.id },
            data: {
              quantity: item.available,
              lastSyncedAt: new Date(),
            },
          });
          synced++;
        } catch (error) {
          failed++;
          console.error(`Failed to sync ${item.sku.sku} to ${listing.channelId}:`, error);
        }
      }
    }

    await prisma.logEntry.create({
      data: {
        orgId,
        level: 'info',
        source: 'INVENTORY',
        message: `Bulk inventory sync completed: ${synced} succeeded, ${failed} failed`,
        metadata: {
          synced,
          failed,
        },
      },
    });

    return { synced, failed };
  }
}
