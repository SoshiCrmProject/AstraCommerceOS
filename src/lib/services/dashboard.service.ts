/**
 * Dashboard Service
 * Provides real-time dashboard data from Prisma
 */

import prisma from '@/lib/prisma';

export class DashboardService {
  /**
   * Get complete dashboard snapshot
   */
  static async getDashboardSnapshot(orgId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get all data in parallel
    const [
      orders,
      recentOrders,
      products,
      activeListings,
      lowStockItems,
      channels,
      recentReviews,
      automationRules,
      recentAutomationExecutions,
      analyticsSnapshots,
      recentLogs,
    ] = await Promise.all([
      // Orders for KPIs
      prisma.order.findMany({
        where: {
          orgId,
          orderedAt: { gte: thirtyDaysAgo },
        },
        include: {
          lineItems: true,
        },
      }),

      // Recent orders for timeline
      prisma.order.findMany({
        where: { orgId },
        include: {
          lineItems: true,
          channel: true,
        },
        orderBy: { orderedAt: 'desc' },
        take: 10,
      }),

      // Products count
      prisma.product.count({
        where: { orgId, status: 'active' },
      }),

      // Active listings
      prisma.listing.count({
        where: { orgId, status: 'active' },
      }),

      // Low stock items
      prisma.inventoryItem.findMany({
        where: {
          orgId,
          available: { lte: prisma.inventoryItem.fields.safetyStock },
        },
        include: {
          sku: {
            include: { product: true },
          },
        },
        take: 10,
      }),

      // Channels health
      prisma.channelConnection.findMany({
        where: { orgId },
        include: {
          _count: {
            select: {
              listings: true,
              orders: true,
            },
          },
        },
      }),

      // Recent reviews
      prisma.review.findMany({
        where: { orgId },
        include: { product: true },
        orderBy: { reviewedAt: 'desc' },
        take: 5,
      }),

      // Automation rules
      prisma.automationRule.findMany({
        where: { orgId, enabled: true },
      }),

      // Recent automation executions
      prisma.automationExecution.findMany({
        where: {
          orgId,
          executedAt: { gte: yesterday },
        },
        include: { rule: true },
        orderBy: { executedAt: 'desc' },
        take: 10,
      }),

      // Analytics for revenue chart
      prisma.analyticsSnapshot.findMany({
        where: {
          orgId,
          period: 'daily',
          date: { gte: thirtyDaysAgo },
        },
        orderBy: { date: 'asc' },
      }),

      // Recent error logs
      prisma.logEntry.findMany({
        where: {
          orgId,
          level: { in: ['error', 'warn'] },
        },
        orderBy: { timestamp: 'desc' },
        take: 20,
      }),
    ]);

    // Calculate KPIs
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const orders24h = orders.filter(o => o.orderedAt >= last24Hours);
    const orders7d = orders.filter(o => o.orderedAt >= last7Days);
    
    const revenue24h = orders24h.reduce((sum, order) => sum + order.total, 0);
    const revenue7d = orders7d.reduce((sum, order) => sum + order.total, 0);
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalUnits = orders.reduce(
      (sum, order) =>
        sum + order.lineItems.reduce((unitSum, item) => unitSum + item.quantity, 0),
      0
    );

    // Calculate profit (simplified - in production would use actual cost data)
    const profit7d = orders7d.reduce((sum, order) => {
      const orderCost = order.lineItems.reduce((costSum, item) => {
        // Estimate cost as 40% of unit price
        return costSum + item.unitPrice * item.quantity * 0.4;
      }, 0);
      return sum + (order.total - orderCost);
    }, 0);
    
    const totalProfit = orders.reduce((sum, order) => {
      const orderCost = order.lineItems.reduce((costSum, item) => {
        return costSum + item.unitPrice * item.quantity * 0.4;
      }, 0);
      return sum + (order.total - orderCost);
    }, 0);
    
    // Calculate average order value
    const avgOrderValue = orders24h.length > 0 ? revenue24h / orders24h.length : 0;

    // Calculate trends (compare with previous period)
    const prev24h = new Date(last24Hours.getTime() - 24 * 60 * 60 * 1000);
    const prev7d = new Date(last7Days.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const prevOrders24h = await prisma.order.count({
      where: { orgId, orderedAt: { gte: prev24h, lt: last24Hours } }
    });
    
    const prevRevenue24h = await prisma.order.aggregate({
      where: { orgId, orderedAt: { gte: prev24h, lt: last24Hours } },
      _sum: { total: true }
    });
    
    const prevRevenue7d = await prisma.order.aggregate({
      where: { orgId, orderedAt: { gte: prev7d, lt: last7Days } },
      _sum: { total: true }
    });
    
    const revenue24hTrend = prevRevenue24h._sum.total 
      ? ((revenue24h - prevRevenue24h._sum.total) / prevRevenue24h._sum.total) * 100 
      : 0;
    const profit7dTrend = prevRevenue7d._sum.total
      ? ((profit7d - (prevRevenue7d._sum.total * 0.6)) / (prevRevenue7d._sum.total * 0.6)) * 100
      : 0;
    const orders24hTrend = prevOrders24h > 0 
      ? ((orders24h.length - prevOrders24h) / prevOrders24h) * 100 
      : 0;

    // System health from channels and logs
    const healthyChannels = channels.filter((c) => c.health === 'healthy').length;
    const systemHealth =
      channels.length > 0 ? (healthyChannels / channels.length) * 100 : 100;

    const errorLogs = recentLogs.filter((log) => log.level === 'error');

    // Top SKUs from recent orders
    const skuSales = new Map<string, { sku: string; revenue: number; units: number }>();
    orders.forEach((order) => {
      order.lineItems.forEach((item) => {
        const existing = skuSales.get(item.productSku) || {
          sku: item.productSku,
          revenue: 0,
          units: 0,
        };
        existing.revenue += item.total;
        existing.units += item.quantity;
        skuSales.set(item.productSku, existing);
      });
    });

    const topSkus = Array.from(skuSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Prepare revenue chart data
    const revenueData = analyticsSnapshots.map((snapshot) => ({
      date: snapshot.date.toISOString().split('T')[0],
      revenue: snapshot.revenue,
      orders: snapshot.orders,
      profit: snapshot.profit,
    }));

    // Alerts
    const alerts: Array<{ id: string; type: string; severity: string; message: string; timestamp: Date }> = [];

    // Low stock alerts
    lowStockItems.forEach((item) => {
      alerts.push({
        id: `low-stock-${item.id}`,
        type: 'inventory',
        severity: 'warning',
        message: `Low stock: ${item.sku.name || item.sku.sku} (${item.available} remaining)`,
        timestamp: new Date(),
      });
    });

    // Failed automation alerts
    recentAutomationExecutions
      .filter((exec) => exec.status === 'failed')
      .forEach((exec) => {
        alerts.push({
          id: `automation-${exec.id}`,
          type: 'automation',
          severity: 'error',
          message: `Automation failed: ${exec.rule.name}`,
          timestamp: exec.executedAt,
        });
      });

    // Channel errors
    channels
      .filter((channel) => channel.health === 'error')
      .forEach((channel) => {
        alerts.push({
          id: `channel-${channel.id}`,
          type: 'channel',
          severity: 'error',
          message: `Channel error: ${channel.channelName}`,
          timestamp: channel.lastHealthCheck || new Date(),
        });
      });

    // Sort alerts by timestamp (newest first)
    alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Format trend as string with sign
    const formatTrend = (value: number) => {
      const sign = value >= 0 ? '+' : '';
      return `${sign}${value.toFixed(1)}%`;
    };

    return {
      kpis: {
        revenue24h: revenue24h,
        revenue24hChange: formatTrend(revenue24hTrend),
        netProfit7d: profit7d,
        netProfit7dChange: formatTrend(profit7dTrend),
        orders24h: orders24h.length,
        orders24hChange: formatTrend(orders24hTrend),
        avgOrderValue: avgOrderValue,
        avgOrderValueChange: formatTrend(revenue24hTrend * 0.8),
        buyBoxShare: 94, // Mock - would come from channel API
        buyBoxShareChange: '+0.4%',
        fulfillmentSla: 98, // Mock - would calculate from fulfillment data
        fulfillmentSlaChange: '+0.5%',
        revenue: {
          value: totalRevenue,
          trend: revenue24hTrend,
          label: 'Revenue (30d)',
        },
        profit: {
          value: totalProfit,
          trend: profit7dTrend,
          label: 'Profit (30d)',
        },
        orders: {
          value: totalOrders,
          trend: orders24hTrend,
          label: 'Orders (30d)',
        },
        units: {
          value: totalUnits,
          trend: orders24hTrend * 1.1, // Approximate
          label: 'Units Sold (30d)',
        },
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName || 'Unknown',
        total: order.total,
        status: order.status,
        channel: order.channel?.channelName || 'Direct',
        orderedAt: order.orderedAt,
        items: order.lineItems.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      })),
      systemHealth: {
        overall: systemHealth,
        channels: channels.map((channel) => ({
          id: channel.id,
          name: channel.channelName,
          type: channel.channelType,
          status: channel.status,
          health: channel.health,
          lastSync: channel.lastSyncedAt,
          listingsCount: channel._count.listings,
          ordersCount: channel._count.orders,
        })),
        errors: errorLogs.length,
        warnings: recentLogs.filter((log) => log.level === 'warn').length,
      },
      alerts: alerts.slice(0, 10), // Top 10 alerts
      topSkus: topSkus.map((sku) => ({
        sku: sku.sku,
        revenue: sku.revenue,
        units: sku.units,
        avgPrice: sku.revenue / sku.units,
      })),
      revenueData,
      automation: {
        totalRules: automationRules.length,
        activeRules: automationRules.filter((r) => r.enabled).length,
        totalExecutions: recentAutomationExecutions.length,
        recentExecutions: recentAutomationExecutions.length,
        failedExecutions24h: recentAutomationExecutions.filter((e) => e.status === 'failed').length,
        lastExecutionAt: recentAutomationExecutions[0]?.executedAt || null,
        successRate:
          recentAutomationExecutions.length > 0
            ? (recentAutomationExecutions.filter((e) => e.status === 'success').length /
                recentAutomationExecutions.length) *
              100
            : 100,
        mostTriggeredRule: recentAutomationExecutions.length > 0 ? (() => {
          const ruleCounts = recentAutomationExecutions.reduce((acc, exec) => {
            acc[exec.ruleId] = (acc[exec.ruleId] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const mostTriggeredRuleId = Object.entries(ruleCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
          const rule = automationRules.find(r => r.id === mostTriggeredRuleId);
          return rule ? {
            name: rule.name,
            triggerDescription: rule.description || `Triggers on ${rule.triggerType}`,
            executions24h: ruleCounts[mostTriggeredRuleId] || 0,
          } : null;
        })() : null,
      },
      channels: await Promise.all(channels.map(async (channel) => {
        // Get 7-day stats for each channel
        const channelOrders7d = await prisma.order.findMany({
          where: {
            channelId: channel.id,
            orderedAt: { gte: last7Days },
          },
          include: {
            lineItems: true,
          },
        });
        
        const revenue7d = channelOrders7d.reduce((sum, order) => sum + order.total, 0);
        const orders7d = channelOrders7d.length;
        
        // Calculate margin (profit / revenue * 100)
        const cost7d = channelOrders7d.reduce((sum, order) => {
          return sum + order.lineItems.reduce((costSum, item) => {
            return costSum + item.unitPrice * item.quantity * 0.4; // 40% cost estimate
          }, 0);
        }, 0);
        const profit7d = revenue7d - cost7d;
        const margin7d = revenue7d > 0 ? (profit7d / revenue7d) * 100 : 0;
        
        // Extract region from config or channel name
        const config = channel.config as any;
        let region = config?.region || config?.marketplace || 'US';
        
        // If region not in config, try to extract from channel name (e.g., "Amazon US", "Shopee SG")
        if (!config?.region && !config?.marketplace) {
          const nameMatch = channel.channelName.match(/\b([A-Z]{2})\b/);
          region = nameMatch ? nameMatch[1] : 'US';
        }
        
        return {
          id: channel.id,
          name: channel.channelName,
          type: channel.channelType,
          region: region,
          status: (channel.health === 'healthy' ? 'HEALTHY' : channel.health === 'degraded' ? 'WARNING' : 'ERROR') as 'HEALTHY' | 'WARNING' | 'ERROR',
          health: channel.health || 'unknown',
          revenue7d: revenue7d || 0,
          orders7d: orders7d || 0,
          margin7d: margin7d,
          buyBoxShare: 94, // Mock - would come from channel API
          lastSyncAt: channel.lastSyncedAt || null,
          lastSync: channel.lastSyncedAt || null,
          listingsCount: channel._count.listings || 0,
          ordersCount: channel._count.orders || 0,
        };
      })),
      revenueSeries: revenueData,
      reviews: {
        total: recentReviews.length,
        pending: recentReviews.filter((r) => r.status === 'pending').length,
        avgRating:
          recentReviews.length > 0
            ? recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length
            : 0,
        avgRating30d:
          recentReviews.length > 0
            ? recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length
            : 0,
        positiveCount30d: recentReviews.filter((r) => r.sentiment === 'positive').length,
        negativeCount30d: recentReviews.filter((r) => r.sentiment === 'negative').length,
        topIssueKeywords: (() => {
          // Extract keywords from negative reviews
          const negativeReviews = recentReviews.filter((r) => r.sentiment === 'negative');
          if (negativeReviews.length === 0) return [];
          
          // Common issue keywords to look for
          const issueKeywords = ['quality', 'shipping', 'damage', 'defect', 'late', 'wrong', 'missing', 'broken', 'poor', 'slow'];
          const foundKeywords: string[] = [];
          
          negativeReviews.forEach((review) => {
            const text = (review.body || '').toLowerCase();
            issueKeywords.forEach((keyword) => {
              if (text.includes(keyword) && !foundKeywords.includes(keyword)) {
                foundKeywords.push(keyword);
              }
            });
          });
          
          return foundKeywords.slice(0, 5); // Return top 5
        })(),
        recent: recentReviews.map((review) => ({
          id: review.id,
          productName: review.product?.name || 'Unknown',
          rating: review.rating,
          sentiment: review.sentiment,
          body: review.body,
          reviewedAt: review.reviewedAt,
        })),
      },
      products: {
        total: products,
        activeListings,
        lowStockCount: lowStockItems.length,
      },
    };
  }
}
