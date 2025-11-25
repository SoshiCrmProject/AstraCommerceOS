/**
 * Orders Service
 * Manages orders, fulfillment, and order lifecycle
 */

import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface OrderFilters {
  search?: string;
  status?: string;
  channel?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minTotal?: number;
  maxTotal?: number;
}

export class OrdersService {
  /**
   * Get orders with filters and pagination
   */
  static async getOrders(
    orgId: string,
    filters: OrderFilters = {},
    page: number = 1,
    limit: number = 50
  ) {
    const where: Prisma.OrderWhereInput = {
      orgId,
    };

    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { externalOrderId: { contains: filters.search, mode: 'insensitive' } },
        { customerName: { contains: filters.search, mode: 'insensitive' } },
        { customerEmail: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.channel) {
      where.channel = {
        channelType: filters.channel,
      };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.orderedAt = {};
      if (filters.dateFrom) where.orderedAt.gte = filters.dateFrom;
      if (filters.dateTo) where.orderedAt.lte = filters.dateTo;
    }

    if (filters.minTotal) {
      where.total = { ...where.total, gte: filters.minTotal };
    }

    if (filters.maxTotal) {
      where.total = { ...where.total, lte: filters.maxTotal };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          channel: true,
          lineItems: {
            include: {
              sku: {
                include: {
                  product: true,
                },
              },
            },
          },
          fulfillments: true,
        },
        orderBy: { orderedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single order by ID
   */
  static async getOrderById(orgId: string, orderId: string) {
    return prisma.order.findFirst({
      where: { id: orderId, orgId },
      include: {
        channel: true,
        lineItems: {
          include: {
            sku: {
              include: {
                product: true,
              },
            },
          },
        },
        fulfillments: true,
      },
    });
  }

  /**
   * Create new order
   */
  static async createOrder(
    orgId: string,
    data: {
      channelId?: string;
      orderNumber: string;
      externalOrderId?: string;
      customerName?: string;
      customerEmail?: string;
      shippingAddress?: any;
      billingAddress?: any;
      lineItems: Array<{
        skuId: string;
        productName: string;
        productSku: string;
        quantity: number;
        unitPrice: number;
      }>;
      shipping?: number;
      tax?: number;
      discount?: number;
      notes?: string;
    }
  ) {
    const subtotal = data.lineItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const shipping = data.shipping || 0;
    const tax = data.tax || 0;
    const discount = data.discount || 0;
    const total = subtotal + shipping + tax - discount;

    return prisma.order.create({
      data: {
        orgId,
        channelId: data.channelId,
        orderNumber: data.orderNumber,
        externalOrderId: data.externalOrderId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        currency: 'USD',
        status: 'pending',
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'unfulfilled',
        notes: data.notes,
        lineItems: {
          create: data.lineItems.map((item) => ({
            skuId: item.skuId,
            productName: item.productName,
            productSku: item.productSku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.unitPrice * item.quantity,
            tax: 0,
            discount: 0,
            total: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        lineItems: true,
      },
    });
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orgId: string,
    orderId: string,
    status: string,
    paymentStatus?: string,
    fulfillmentStatus?: string
  ) {
    const updateData: any = { status };

    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (fulfillmentStatus) updateData.fulfillmentStatus = fulfillmentStatus;

    // Update timestamps based on status
    if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    } else if (status === 'shipped' && !updateData.shippedAt) {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    if (paymentStatus === 'paid' && !updateData.paidAt) {
      updateData.paidAt = new Date();
    }

    return prisma.order.update({
      where: { id: orderId, orgId },
      data: updateData,
    });
  }

  /**
   * Create fulfillment for order
   */
  static async createFulfillment(
    orgId: string,
    orderId: string,
    data: {
      trackingNumber?: string;
      carrier?: string;
      method?: string;
      notes?: string;
    }
  ) {
    // Verify order belongs to org
    const order = await prisma.order.findFirst({
      where: { id: orderId, orgId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const fulfillment = await prisma.fulfillment.create({
      data: {
        orderId,
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        method: data.method || 'standard',
        status: 'in_transit',
        notes: data.notes,
        shippedAt: new Date(),
      },
    });

    // Update order status
    await this.updateOrderStatus(orgId, orderId, 'shipped', undefined, 'fulfilled');

    return fulfillment;
  }

  /**
   * Get order statistics
   */
  static async getOrderStats(orgId: string, days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const orders = await prisma.order.findMany({
      where: {
        orgId,
        orderedAt: { gte: since },
      },
      include: {
        lineItems: true,
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalUnits = orders.reduce(
      (sum, order) =>
        sum + order.lineItems.reduce((unitSum, item) => unitSum + item.quantity, 0),
      0
    );

    const byStatus = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byChannel = orders.reduce(
      (acc, order) => {
        const channel = order.channelId || 'direct';
        acc[channel] = (acc[channel] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalRevenue,
      totalOrders,
      totalUnits,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      byStatus,
      byChannel,
    };
  }

  /**
   * Export orders to CSV
   */
  static async exportToCSV(orgId: string, filters: OrderFilters = {}) {
    const { orders } = await this.getOrders(orgId, filters, 1, 10000);

    const headers = [
      'Order Number',
      'External ID',
      'Customer',
      'Email',
      'Status',
      'Channel',
      'Total',
      'Ordered At',
      'Items',
    ];

    const rows = orders.map((order) => [
      order.orderNumber,
      order.externalOrderId || '',
      order.customerName || '',
      order.customerEmail || '',
      order.status,
      order.channel?.channelName || 'Direct',
      order.total.toFixed(2),
      order.orderedAt.toISOString(),
      order.lineItems.length.toString(),
    ]);

    return {
      headers,
      rows,
      csv: [headers, ...rows].map((row) => row.join(',')).join('\n'),
    };
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orgId: string, orderId: string, reason?: string) {
    return prisma.order.update({
      where: { id: orderId, orgId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        notes: reason,
      },
    });
  }
}
