/**
 * Analytics Service
 * Provides business analytics and insights
 */

import prisma from '@/lib/prisma';

export class AnalyticsService {
  /**
   * Get analytics snapshot for a date range
   */
  static async getAnalytics(
    orgId: string,
    startDate: Date,
    endDate: Date,
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'
  ) {
    const snapshots = await prisma.analyticsSnapshot.findMany({
      where: {
        orgId,
        period,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return snapshots.map((snapshot) => ({
      date: snapshot.date,
      revenue: snapshot.revenue,
      orders: snapshot.orders,
      units: snapshot.units,
      profit: snapshot.profit,
      channelMetrics: snapshot.channelMetrics,
      topProducts: snapshot.topProducts,
    }));
  }

  /**
   * Get real-time analytics (computed from orders)
   */
  static async getRealTimeAnalytics(orgId: string, days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [orders, previousPeriodOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          orgId,
          orderedAt: { gte: since },
        },
        include: {
          lineItems: true,
          channel: true,
        },
      }),
      prisma.order.findMany({
        where: {
          orgId,
          orderedAt: {
            gte: new Date(since.getTime() - days * 24 * 60 * 60 * 1000),
            lt: since,
          },
        },
      }),
    ]);

    // Calculate current period metrics
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const ordersCount = orders.length;
    const units = orders.reduce(
      (sum, order) =>
        sum + order.lineItems.reduce((unitSum, item) => unitSum + item.quantity, 0),
      0
    );

    // Estimate profit (simplified)
    const profit = orders.reduce((sum, order) => {
      const cost = order.lineItems.reduce((costSum, item) => {
        return costSum + item.unitPrice * item.quantity * 0.4; // Estimate cost
      }, 0);
      return sum + (order.total - cost);
    }, 0);

    // Calculate trends
    const prevRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);
    const revenueTrend = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;
    const ordersTrend =
      previousPeriodOrders.length > 0
        ? ((ordersCount - previousPeriodOrders.length) / previousPeriodOrders.length) * 100
        : 0;

    // Channel breakdown
    const channelMetrics = orders.reduce(
      (acc, order) => {
        const channelType = order.channel?.channelType || 'direct';
        if (!acc[channelType]) {
          acc[channelType] = { revenue: 0, orders: 0, units: 0 };
        }
        acc[channelType].revenue += order.total;
        acc[channelType].orders++;
        acc[channelType].units += order.lineItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        return acc;
      },
      {} as Record<string, { revenue: number; orders: number; units: number }>
    );

    // Top SKUs
    const skuMetrics = new Map<
      string,
      { sku: string; name: string; revenue: number; units: number }
    >();

    orders.forEach((order) => {
      order.lineItems.forEach((item) => {
        const existing = skuMetrics.get(item.productSku) || {
          sku: item.productSku,
          name: item.productName,
          revenue: 0,
          units: 0,
        };
        existing.revenue += item.total;
        existing.units += item.quantity;
        skuMetrics.set(item.productSku, existing);
      });
    });

    const topSkus = Array.from(skuMetrics.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Revenue by day
    const revenueByDay = orders.reduce(
      (acc, order) => {
        const day = order.orderedAt.toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + order.total;
        return acc;
      },
      {} as Record<string, number>
    );

    const timeSeriesData = Object.entries(revenueByDay)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      summary: {
        revenue,
        profit,
        orders: ordersCount,
        units,
        avgOrderValue: ordersCount > 0 ? revenue / ordersCount : 0,
        revenueTrend,
        ordersTrend,
      },
      channelMetrics,
      topSkus,
      timeSeriesData,
    };
  }

  /**
   * Generate analytics snapshot (for background job)
   */
  static async generateSnapshot(orgId: string, date: Date, period: 'daily' | 'weekly' | 'monthly') {
    // Calculate date range based on period
    let startDate: Date;
    let endDate: Date;

    if (period === 'daily') {
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === 'weekly') {
      const day = date.getDay();
      startDate = new Date(date);
      startDate.setDate(date.getDate() - day);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // monthly
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    // Get orders in period
    const orders = await prisma.order.findMany({
      where: {
        orgId,
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        lineItems: true,
        channel: true,
      },
    });

    // Calculate metrics
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const ordersCount = orders.length;
    const units = orders.reduce(
      (sum, order) =>
        sum + order.lineItems.reduce((unitSum, item) => unitSum + item.quantity, 0),
      0
    );

    const profit = orders.reduce((sum, order) => {
      const cost = order.lineItems.reduce((costSum, item) => {
        return costSum + item.unitPrice * item.quantity * 0.4;
      }, 0);
      return sum + (order.total - cost);
    }, 0);

    // Channel breakdown
    const channelMetrics: Record<string, any> = {};
    orders.forEach((order) => {
      const channelType = order.channel?.channelType || 'direct';
      if (!channelMetrics[channelType]) {
        channelMetrics[channelType] = { revenue: 0, orders: 0 };
      }
      channelMetrics[channelType].revenue += order.total;
      channelMetrics[channelType].orders++;
    });

    // Top products
    const productMetrics = new Map<string, { name: string; revenue: number }>();
    orders.forEach((order) => {
      order.lineItems.forEach((item) => {
        const existing = productMetrics.get(item.productSku) || {
          name: item.productName,
          revenue: 0,
        };
        existing.revenue += item.total;
        productMetrics.set(item.productSku, existing);
      });
    });

    const topProducts = Array.from(productMetrics.entries())
      .map(([sku, data]) => ({ sku, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Create or update snapshot
    return prisma.analyticsSnapshot.upsert({
      where: {
        orgId_date_period: {
          orgId,
          date: startDate,
          period,
        },
      },
      update: {
        revenue,
        orders: ordersCount,
        units,
        profit,
        channelMetrics,
        topProducts,
      },
      create: {
        orgId,
        date: startDate,
        period,
        revenue,
        orders: ordersCount,
        units,
        profit,
        channelMetrics,
        topProducts,
      },
    });
  }

  /**
   * Detect anomalies in analytics data
   */
  static async detectAnomalies(orgId: string, days: number = 30) {
    const snapshots = await prisma.analyticsSnapshot.findMany({
      where: {
        orgId,
        period: 'daily',
        date: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { date: 'asc' },
    });

    if (snapshots.length < 7) {
      return []; // Need at least a week of data
    }

    const anomalies: Array<{
      date: Date;
      metric: string;
      value: number;
      expected: number;
      deviation: number;
      severity: 'low' | 'medium' | 'high';
    }> = [];

    // Calculate moving average and detect outliers
    const revenueValues = snapshots.map((s) => s.revenue);
    const avgRevenue = revenueValues.reduce((sum, val) => sum + val, 0) / revenueValues.length;
    const stdDev = Math.sqrt(
      revenueValues.reduce((sum, val) => sum + Math.pow(val - avgRevenue, 2), 0) /
        revenueValues.length
    );

    snapshots.forEach((snapshot) => {
      const deviation = Math.abs(snapshot.revenue - avgRevenue) / stdDev;

      if (deviation > 2) {
        anomalies.push({
          date: snapshot.date,
          metric: 'revenue',
          value: snapshot.revenue,
          expected: avgRevenue,
          deviation,
          severity: deviation > 3 ? 'high' : deviation > 2.5 ? 'medium' : 'low',
        });
      }
    });

    return anomalies;
  }

  /**
   * Get conversion funnel data
   */
  static async getConversionFunnel(orgId: string, days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [listings, orders] = await Promise.all([
      prisma.listing.count({
        where: { orgId, status: 'active' },
      }),
      prisma.order.count({
        where: { orgId, orderedAt: { gte: since } },
      }),
    ]);

    // In a real system, we'd track views, clicks, add-to-carts, etc.
    // For now, simplified funnel
    return {
      activeListings: listings,
      views: listings * 100, // Estimated
      clicks: listings * 20, // Estimated
      orders,
      conversionRate: listings > 0 ? (orders / (listings * 100)) * 100 : 0,
    };
  }
}
