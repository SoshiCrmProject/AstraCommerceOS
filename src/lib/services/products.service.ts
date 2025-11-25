/**
 * Products Service
 * Manages products, SKUs, and their lifecycle
 */

import prisma from '@/lib/prisma';
import type { Product, Sku, Listing, Prisma } from '@prisma/client';

export interface ProductWithDetails extends Product {
  skus: Array<
    Sku & {
      listings: Listing[];
      inventoryItems: Array<{
        available: number;
        reserved: number;
        incoming: number;
      }>;
    }
  >;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  tags?: string[];
  channel?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export class ProductsService {
  /**
   * Get products with filters and pagination
   */
  static async getProducts(
    orgId: string,
    filters: ProductFilters = {},
    page: number = 1,
    limit: number = 50
  ) {
    const where: Prisma.ProductWhereInput = {
      orgId,
    };

    // Apply filters
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.brand) {
      where.brand = filters.brand;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          skus: {
            include: {
              listings: {
                where: filters.channel
                  ? {
                      channel: {
                        channelType: filters.channel,
                      },
                    }
                  : undefined,
              },
              inventoryItems: {
                select: {
                  available: true,
                  reserved: true,
                  incoming: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single product by ID
   */
  static async getProductById(orgId: string, productId: string) {
    return prisma.product.findFirst({
      where: { id: productId, orgId },
      include: {
        skus: {
          include: {
            listings: {
              include: {
                channel: true,
              },
            },
            inventoryItems: true,
          },
        },
        reviews: {
          orderBy: { reviewedAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  /**
   * Create new product
   */
  static async createProduct(
    orgId: string,
    data: {
      name: string;
      brand?: string;
      category?: string;
      description?: string;
      tags?: string[];
      imageUrls?: string[];
      skus?: Array<{
        sku: string;
        name?: string;
        costPrice?: number;
        weight?: number;
        barcode?: string;
        asin?: string;
      }>;
    }
  ) {
    return prisma.product.create({
      data: {
        orgId,
        name: data.name,
        brand: data.brand,
        category: data.category,
        description: data.description,
        tags: data.tags || [],
        imageUrls: data.imageUrls || [],
        status: 'active',
        skus: data.skus
          ? {
              create: data.skus.map((sku) => ({
                orgId,
                sku: sku.sku,
                name: sku.name,
                costPrice: sku.costPrice,
                weight: sku.weight,
                barcode: sku.barcode,
                asin: sku.asin,
                currency: 'USD',
                status: 'active',
              })),
            }
          : undefined,
      },
      include: {
        skus: true,
      },
    });
  }

  /**
   * Update product
   */
  static async updateProduct(
    orgId: string,
    productId: string,
    data: Partial<{
      name: string;
      brand: string;
      category: string;
      description: string;
      tags: string[];
      imageUrls: string[];
      status: string;
    }>
  ) {
    return prisma.product.update({
      where: { id: productId, orgId },
      data,
    });
  }

  /**
   * Delete product (soft delete by setting status to archived)
   */
  static async deleteProduct(orgId: string, productId: string) {
    return prisma.product.update({
      where: { id: productId, orgId },
      data: { status: 'archived' },
    });
  }

  /**
   * Get product categories
   */
  static async getCategories(orgId: string) {
    const products = await prisma.product.findMany({
      where: { orgId },
      select: { category: true },
      distinct: ['category'],
    });

    return products
      .map((p) => p.category)
      .filter((c): c is string => !!c)
      .sort();
  }

  /**
   * Get product brands
   */
  static async getBrands(orgId: string) {
    const products = await prisma.product.findMany({
      where: { orgId },
      select: { brand: true },
      distinct: ['brand'],
    });

    return products
      .map((p) => p.brand)
      .filter((b): b is string => !!b)
      .sort();
  }

  /**
   * Bulk update products
   */
  static async bulkUpdateProducts(
    orgId: string,
    productIds: string[],
    data: Partial<{
      tags: string[];
      status: string;
      category: string;
      brand: string;
    }>
  ) {
    return prisma.product.updateMany({
      where: {
        id: { in: productIds },
        orgId,
      },
      data,
    });
  }

  /**
   * Get product performance metrics
   */
  static async getProductMetrics(orgId: string, productId: string, days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [orders, reviews] = await Promise.all([
      prisma.order.findMany({
        where: {
          orgId,
          orderedAt: { gte: since },
          lineItems: {
            some: {
              sku: {
                productId,
              },
            },
          },
        },
        include: {
          lineItems: {
            where: {
              sku: {
                productId,
              },
            },
          },
        },
      }),
      prisma.review.findMany({
        where: {
          orgId,
          productId,
          reviewedAt: { gte: since },
        },
      }),
    ]);

    const revenue = orders.reduce((sum, order) => {
      const productItems = order.lineItems.filter((item) => item.sku?.productId === productId);
      return sum + productItems.reduce((itemSum, item) => itemSum + item.total, 0);
    }, 0);

    const units = orders.reduce((sum, order) => {
      const productItems = order.lineItems.filter((item) => item.sku?.productId === productId);
      return sum + productItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    const avgRating =
      reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    return {
      revenue,
      units,
      ordersCount: orders.length,
      avgRating,
      reviewsCount: reviews.length,
      positiveReviews: reviews.filter((r) => r.rating >= 4).length,
      negativeReviews: reviews.filter((r) => r.rating <= 2).length,
    };
  }
}
