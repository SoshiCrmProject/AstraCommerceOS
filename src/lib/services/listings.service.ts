/**
 * Listings Service
 * Manages product listings across marketplaces
 */

import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface ListingFilters {
  search?: string;
  channelId?: string;
  channelType?: string;
  status?: string;
  skuId?: string;
}

export class ListingsService {
  /**
   * Get listings with filters
   */
  static async getListings(
    orgId: string,
    filters: ListingFilters = {},
    page: number = 1,
    limit: number = 50
  ) {
    const where: Prisma.ListingWhereInput = {
      orgId,
    };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { externalId: { contains: filters.search } },
        { sku: { sku: { contains: filters.search } } },
      ];
    }

    if (filters.channelId) {
      where.channelId = filters.channelId;
    }

    if (filters.channelType) {
      where.channel = { channelType: filters.channelType };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.skuId) {
      where.skuId = filters.skuId;
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          sku: {
            include: {
              product: true,
            },
          },
          channel: true,
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single listing
   */
  static async getListingById(orgId: string, listingId: string) {
    return prisma.listing.findFirst({
      where: { id: listingId, orgId },
      include: {
        sku: {
          include: {
            product: true,
          },
        },
        channel: true,
      },
    });
  }

  /**
   * Create listing
   */
  static async createListing(
    orgId: string,
    data: {
      skuId: string;
      channelId: string;
      title: string;
      description?: string;
      bullets?: string[];
      imageUrls?: string[];
      price: number;
      compareAtPrice?: number;
      quantity?: number;
      externalId?: string;
    }
  ) {
    return prisma.listing.create({
      data: {
        orgId,
        skuId: data.skuId,
        channelId: data.channelId,
        title: data.title,
        description: data.description,
        bullets: data.bullets || [],
        imageUrls: data.imageUrls || [],
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        quantity: data.quantity || 0,
        currency: 'USD',
        status: 'draft',
        externalId: data.externalId,
      },
    });
  }

  /**
   * Update listing
   */
  static async updateListing(
    orgId: string,
    listingId: string,
    data: Partial<{
      title: string;
      description: string;
      bullets: string[];
      imageUrls: string[];
      price: number;
      compareAtPrice: number;
      quantity: number;
      status: string;
    }>
  ) {
    return prisma.listing.update({
      where: { id: listingId, orgId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Publish listing
   */
  static async publishListing(orgId: string, listingId: string) {
    return prisma.listing.update({
      where: { id: listingId, orgId },
      data: {
        status: 'active',
        publishedAt: new Date(),
      },
    });
  }

  /**
   * Pause listing
   */
  static async pauseListing(orgId: string, listingId: string) {
    return prisma.listing.update({
      where: { id: listingId, orgId },
      data: {
        status: 'paused',
      },
    });
  }

  /**
   * Delete listing
   */
  static async deleteListing(orgId: string, listingId: string) {
    return prisma.listing.delete({
      where: { id: listingId, orgId },
    });
  }

  /**
   * Optimize listing with AI
   */
  static async optimizeListing(orgId: string, listingId: string, aiSuggestions: {
    title?: string;
    description?: string;
    bullets?: string[];
  }) {
    const listing = await this.getListingById(orgId, listingId);

    if (!listing) {
      throw new Error('Listing not found');
    }

    const updateData: any = {};

    if (aiSuggestions.title) updateData.title = aiSuggestions.title;
    if (aiSuggestions.description) updateData.description = aiSuggestions.description;
    if (aiSuggestions.bullets) updateData.bullets = aiSuggestions.bullets;

    return this.updateListing(orgId, listingId, updateData);
  }

  /**
   * Sync listing to marketplace
   */
  static async syncListing(orgId: string, listingId: string) {
    const listing = await this.getListingById(orgId, listingId);

    if (!listing) {
      throw new Error('Listing not found');
    }

    // TODO: Call actual marketplace API
    // For now, just update lastSyncedAt

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        lastSyncedAt: new Date(),
      },
    });

    // Log sync
    await prisma.logEntry.create({
      data: {
        orgId,
        level: 'info',
        source: 'CONNECTOR',
        message: `Listing synced: ${listing.title} to ${listing.channel.channelName}`,
        entityType: 'listing',
        entityId: listingId,
      },
    });

    return listing;
  }

  /**
   * Get listing performance
   */
  static async getListingPerformance(orgId: string, listingId: string, days: number = 30) {
    const listing = await this.getListingById(orgId, listingId);

    if (!listing) {
      throw new Error('Listing not found');
    }

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const orders = await prisma.order.findMany({
      where: {
        orgId,
        channelId: listing.channelId,
        orderedAt: { gte: since },
        lineItems: {
          some: {
            skuId: listing.skuId,
          },
        },
      },
      include: {
        lineItems: {
          where: {
            skuId: listing.skuId,
          },
        },
      },
    });

    const revenue = orders.reduce((sum, order) => {
      return sum + order.lineItems.reduce((itemSum, item) => itemSum + item.total, 0);
    }, 0);

    const units = orders.reduce((sum, order) => {
      return sum + order.lineItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    return {
      revenue,
      units,
      ordersCount: orders.length,
      avgPrice: units > 0 ? revenue / units : 0,
      conversionRate: 0, // Would need view data
    };
  }
}
