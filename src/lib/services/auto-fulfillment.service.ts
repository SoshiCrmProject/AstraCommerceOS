// @ts-nocheck
/**
 * Auto-Fulfillment Service
 * Amazon dropshipping automation with browser bots (Playwright)
 * 
 * Features:
 * - Automatic order placement on Amazon when Shopee/marketplace orders received
 * - Profit calculation with configurable thresholds
 * - Delivery time validation
 * - Browser automation for cart and checkout
 * - Tracking number sync back to source marketplace
 * - Error logging and retry logic
 */

import prisma from '@/lib/prisma';
import { BrowserAutomation } from '@/lib/automation/browser-automation';
import type { Prisma } from '@prisma/client';

export interface AutoFulfillmentConfig {
  enabled: boolean;
  sourceChannels: string[]; // Which Shopee/marketplace channels to monitor
  targetMarketplace: 'amazon' | 'rakuten' | 'yahoo'; // Where to purchase from
  minProfitAmount: number; // Minimum profit required (can be negative)
  maxDeliveryDays: number; // Maximum delivery time in days
  includePoints: boolean; // Include Amazon points in profit calculation
  includeShippingCost: boolean; // Include domestic shipping in profit calculation
  autoRetry: boolean; // Retry failed orders
  maxRetries: number; // Max retry attempts
}

export interface ProfitCalculation {
  salePrice: number; // What customer paid
  purchasePrice: number; // Amazon product price
  shippingCost: number; // Shipping to warehouse
  marketplaceFee: number; // Shopee commission
  paymentFee: number; // Payment processing
  amazonPoints: number; // Estimated points earned
  domesticShipping: number; // Shipping to Shopee warehouse
  estimatedProfit: number; // Net profit
  profitMargin: number; // Profit percentage
}

export interface FulfillmentEligibility {
  eligible: boolean;
  reason?: string;
  profitCalculation: ProfitCalculation;
  estimatedDeliveryDays: number;
  amazonProductUrl?: string;
  amazonAsin?: string;
}

export interface FulfillmentResult {
  success: boolean;
  orderId: string;
  lineItemId: string;
  amazonOrderId?: string;
  trackingNumber?: string;
  error?: string;
  profitCalculation?: ProfitCalculation;
  attempts: number;
}

export class AutoFulfillmentService {
  /**
   * Get auto-fulfillment configuration for organization
   */
  static async getConfig(orgId: string): Promise<AutoFulfillmentConfig | null> {
    const config = await prisma.autoFulfillmentConfig.findUnique({
      where: { orgId },
    });

    if (!config) return null;

    return {
      enabled: config.enabled,
      sourceChannels: config.sourceChannels as string[],
      targetMarketplace: config.targetMarketplace as any,
      minProfitAmount: config.minProfitAmount,
      maxDeliveryDays: config.maxDeliveryDays,
      includePoints: config.includePoints,
      includeShippingCost: config.includeShippingCost,
      autoRetry: config.autoRetry,
      maxRetries: config.maxRetries,
    };
  }

  /**
   * Update auto-fulfillment configuration
   */
  static async updateConfig(orgId: string, config: Partial<AutoFulfillmentConfig>) {
    return prisma.autoFulfillmentConfig.upsert({
      where: { orgId },
      create: {
        orgId,
        enabled: config.enabled ?? false,
        sourceChannels: config.sourceChannels || [],
        targetMarketplace: config.targetMarketplace || 'amazon',
        minProfitAmount: config.minProfitAmount ?? 0,
        maxDeliveryDays: config.maxDeliveryDays ?? 14,
        includePoints: config.includePoints ?? false,
        includeShippingCost: config.includeShippingCost ?? true,
        autoRetry: config.autoRetry ?? true,
        maxRetries: config.maxRetries ?? 3,
      },
      update: config,
    });
  }

  /**
   * Calculate profit for a potential fulfillment
   */
  static async calculateProfit(
    orgId: string,
    lineItem: {
      sku: string;
      quantity: number;
      unitPrice: number;
    },
    amazonPrice: number,
    config: AutoFulfillmentConfig
  ): Promise<ProfitCalculation> {
    // Get product details for costs
    const product = await prisma.product.findFirst({
      where: { 
        orgId,
        skus: {
          some: { sku: lineItem.sku }
        }
      },
      include: {
        skus: {
          where: { sku: lineItem.sku }
        }
      }
    });

    const sku = product?.skus[0];

    // Sale revenue
    const salePrice = lineItem.unitPrice * lineItem.quantity;

    // Purchase cost
    const purchasePrice = amazonPrice * lineItem.quantity;

    // Marketplace fees (Shopee typically 5-8%)
    const marketplaceFee = salePrice * 0.06;

    // Payment processing (typically 2-3%)
    const paymentFee = salePrice * 0.025;

    // Shipping cost (domestic to warehouse)
    const domesticShipping = config.includeShippingCost ? 500 : 0; // ¥500 avg

    // Amazon points (typically 1%)
    const amazonPoints = config.includePoints ? purchasePrice * 0.01 : 0;

    // Calculate net profit
    let estimatedProfit = salePrice 
      - purchasePrice 
      - marketplaceFee 
      - paymentFee 
      - domesticShipping 
      + amazonPoints;

    const profitMargin = (estimatedProfit / salePrice) * 100;

    return {
      salePrice,
      purchasePrice,
      shippingCost: 0, // International shipping usually covered by customer
      marketplaceFee,
      paymentFee,
      amazonPoints,
      domesticShipping,
      estimatedProfit,
      profitMargin,
    };
  }

  /**
   * Check if order line item is eligible for auto-fulfillment
   */
  static async checkEligibility(
    orgId: string,
    orderId: string,
    lineItemId: string
  ): Promise<FulfillmentEligibility> {
    const config = await this.getConfig(orgId);

    if (!config || !config.enabled) {
      return {
        eligible: false,
        reason: 'Auto-fulfillment is disabled',
        profitCalculation: {} as any,
        estimatedDeliveryDays: 0,
      };
    }

    // Get order and line item
    const order = await prisma.order.findFirst({
      where: { id: orderId, orgId },
      include: {
        lineItems: {
          where: { id: lineItemId }
        },
        channel: true,
      },
    });

    if (!order || !order.lineItems[0]) {
      return {
        eligible: false,
        reason: 'Order or line item not found',
        profitCalculation: {} as any,
        estimatedDeliveryDays: 0,
      };
    }

    const lineItem = order.lineItems[0];

    // Check if channel is enabled for auto-fulfillment
    if (!config.sourceChannels.includes(order.channelId)) {
      return {
        eligible: false,
        reason: `Channel ${order.channel.channelName} not enabled for auto-fulfillment`,
        profitCalculation: {} as any,
        estimatedDeliveryDays: 0,
      };
    }

    // Get Amazon product info (from listing or search)
    const amazonListing = await prisma.listing.findFirst({
      where: {
        orgId,
        sku: lineItem.sku,
        channel: {
          channelType: 'amazon'
        },
        status: 'active',
      },
    });

    if (!amazonListing) {
      return {
        eligible: false,
        reason: 'No active Amazon listing found for this SKU',
        profitCalculation: {} as any,
        estimatedDeliveryDays: 0,
      };
    }

    // Calculate profit
    const profitCalc = await this.calculateProfit(
      orgId,
      {
        sku: lineItem.sku,
        quantity: lineItem.quantity,
        unitPrice: lineItem.unitPrice,
      },
      amazonListing.price,
      config
    );

    // Check profit threshold
    if (profitCalc.estimatedProfit < config.minProfitAmount) {
      return {
        eligible: false,
        reason: `Profit ¥${profitCalc.estimatedProfit.toFixed(0)} below minimum ¥${config.minProfitAmount}`,
        profitCalculation: profitCalc,
        estimatedDeliveryDays: 0,
      };
    }

    // Estimate delivery days (simplified - would query Amazon API in production)
    const estimatedDeliveryDays = 7; // Default estimate

    // Check delivery time
    if (estimatedDeliveryDays > config.maxDeliveryDays) {
      return {
        eligible: false,
        reason: `Delivery time ${estimatedDeliveryDays} days exceeds maximum ${config.maxDeliveryDays} days`,
        profitCalculation: profitCalc,
        estimatedDeliveryDays,
      };
    }

    return {
      eligible: true,
      profitCalculation: profitCalc,
      estimatedDeliveryDays,
      amazonProductUrl: amazonListing.channelListingId 
        ? `https://www.amazon.co.jp/dp/${amazonListing.channelListingId}`
        : undefined,
      amazonAsin: amazonListing.channelListingId || undefined,
    };
  }

  /**
   * Process auto-fulfillment for an order
   * This is the main entry point called when new orders arrive
   */
  static async processOrder(orgId: string, orderId: string): Promise<FulfillmentResult[]> {
    const results: FulfillmentResult[] = [];

    const order = await prisma.order.findFirst({
      where: { id: orderId, orgId },
      include: {
        lineItems: true,
        channel: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Process each line item
    for (const lineItem of order.lineItems) {
      const result = await this.processLineItem(orgId, orderId, lineItem.id);
      results.push(result);
    }

    return results;
  }

  /**
   * Process single line item for auto-fulfillment
   */
  static async processLineItem(
    orgId: string,
    orderId: string,
    lineItemId: string
  ): Promise<FulfillmentResult> {
    // Check if already processed
    const existingJob = await prisma.autoFulfillmentJob.findFirst({
      where: {
        orgId,
        orderId,
        lineItemId,
        status: { in: ['pending', 'processing', 'completed'] },
      },
    });

    if (existingJob && existingJob.status === 'completed') {
      return {
        success: true,
        orderId,
        lineItemId,
        amazonOrderId: existingJob.amazonOrderId || undefined,
        trackingNumber: existingJob.trackingNumber || undefined,
        attempts: existingJob.attempts,
      };
    }

    // Check eligibility
    const eligibility = await this.checkEligibility(orgId, orderId, lineItemId);

    if (!eligibility.eligible) {
      // Create failed job record
      await prisma.autoFulfillmentJob.create({
        data: {
          orgId,
          orderId,
          lineItemId,
          status: 'failed',
          error: eligibility.reason,
          profitCalculation: eligibility.profitCalculation as any,
          attempts: 1,
        },
      });

      return {
        success: false,
        orderId,
        lineItemId,
        error: eligibility.reason,
        profitCalculation: eligibility.profitCalculation,
        attempts: 1,
      };
    }

    // Create or update job
    const job = await prisma.autoFulfillmentJob.upsert({
      where: {
        orderId_lineItemId: {
          orderId,
          lineItemId,
        },
      },
      create: {
        orgId,
        orderId,
        lineItemId,
        status: 'pending',
        profitCalculation: eligibility.profitCalculation as any,
        estimatedDeliveryDays: eligibility.estimatedDeliveryDays,
        attempts: 0,
      },
      update: {
        status: 'pending',
      },
    });

    // Execute browser automation
    try {
      const result = await this.executeBrowserAutomation(
        orgId,
        orderId,
        lineItemId,
        eligibility
      );

      // Update job with success
      await prisma.autoFulfillmentJob.update({
        where: { id: job.id },
        data: {
          status: 'completed',
          amazonOrderId: result.amazonOrderId,
          trackingNumber: result.trackingNumber,
          completedAt: new Date(),
          attempts: job.attempts + 1,
        },
      });

      return {
        success: true,
        orderId,
        lineItemId,
        amazonOrderId: result.amazonOrderId,
        trackingNumber: result.trackingNumber,
        profitCalculation: eligibility.profitCalculation,
        attempts: job.attempts + 1,
      };
    } catch (error: any) {
      // Update job with failure
      await prisma.autoFulfillmentJob.update({
        where: { id: job.id },
        data: {
          status: 'failed',
          error: error.message,
          attempts: job.attempts + 1,
        },
      });

      return {
        success: false,
        orderId,
        lineItemId,
        error: error.message,
        profitCalculation: eligibility.profitCalculation,
        attempts: job.attempts + 1,
      };
    }
  }

  /**
   * Execute browser automation to fulfill order on Amazon
   */
  private static async executeBrowserAutomation(
    orgId: string,
    orderId: string,
    lineItemId: string,
    eligibility: FulfillmentEligibility
  ): Promise<{ amazonOrderId: string; trackingNumber?: string }> {
    // Get organization's Amazon credentials
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    // Get order details
    const order = await prisma.order.findFirst({
      where: { id: orderId, orgId },
      include: {
        lineItems: {
          where: { id: lineItemId }
        }
      },
    });

    if (!order || !order.lineItems[0]) {
      throw new Error('Order or line item not found');
    }

    const lineItem = order.lineItems[0];

    // Initialize browser automation
    const browser = new BrowserAutomation();

    try {
      // Launch browser
      await browser.launch();

      // Login to Amazon
      await browser.loginToAmazon({
        email: process.env.AMAZON_BUYER_EMAIL || '',
        password: process.env.AMAZON_BUYER_PASSWORD || '',
      });

      // Navigate to product
      if (!eligibility.amazonAsin) {
        throw new Error('Amazon ASIN not found');
      }

      await browser.navigateToProduct(eligibility.amazonAsin);

      // Check stock availability
      const inStock = await browser.checkStock();
      if (!inStock) {
        throw new Error('Product out of stock on Amazon');
      }

      // Add to cart
      await browser.addToCart(lineItem.quantity);

      // Set shipping address (from order)
      await browser.setShippingAddress({
        name: order.customerName,
        address: order.shippingAddress as any,
      });

      // Proceed to checkout
      await browser.proceedToCheckout();

      // Complete purchase
      const amazonOrderId = await browser.completePurchase();

      // Get tracking number (may not be available immediately)
      let trackingNumber: string | undefined;
      try {
        trackingNumber = await browser.getTrackingNumber(amazonOrderId);
      } catch (err) {
        // Tracking not available yet, will sync later
      }

      // Close browser
      await browser.close();

      // If we have tracking, sync it back to source marketplace
      if (trackingNumber) {
        await this.syncTrackingToMarketplace(orgId, orderId, trackingNumber);
      }

      return { amazonOrderId, trackingNumber };
    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  /**
   * Sync tracking number back to source marketplace (Shopee, etc.)
   */
  private static async syncTrackingToMarketplace(
    orgId: string,
    orderId: string,
    trackingNumber: string
  ) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, orgId },
      include: { channel: true },
    });

    if (!order) return;

    // Create fulfillment record
    await prisma.fulfillment.create({
      data: {
        orderId,
        trackingNumber,
        carrier: 'Amazon Logistics',
        status: 'in_transit',
        lineItems: [], // Would map specific line items
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'fulfilled' },
    });

    // TODO: Call marketplace API to update tracking
    // This would use ConnectorRegistry to get the appropriate connector
    // and call its updateTracking() method
  }

  /**
   * Get fulfillment jobs with filters
   */
  static async getJobs(
    orgId: string,
    filters?: {
      status?: string;
      fromDate?: Date;
      toDate?: Date;
      skip?: number;
      take?: number;
    }
  ) {
    const where: Prisma.AutoFulfillmentJobWhereInput = { orgId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.fromDate || filters?.toDate) {
      where.createdAt = {};
      if (filters.fromDate) where.createdAt.gte = filters.fromDate;
      if (filters.toDate) where.createdAt.lte = filters.toDate;
    }

    const [jobs, total] = await Promise.all([
      prisma.autoFulfillmentJob.findMany({
        where,
        include: {
          order: {
            include: {
              channel: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: filters?.skip || 0,
        take: filters?.take || 50,
      }),
      prisma.autoFulfillmentJob.count({ where }),
    ]);

    return { jobs, total };
  }

  /**
   * Get fulfillment statistics
   */
  static async getStats(
    orgId: string,
    filters?: {
      fromDate?: Date;
      toDate?: Date;
    }
  ) {
    const where: Prisma.AutoFulfillmentJobWhereInput = { orgId };

    if (filters?.fromDate || filters?.toDate) {
      where.createdAt = {};
      if (filters.fromDate) where.createdAt.gte = filters.fromDate;
      if (filters.toDate) where.createdAt.lte = filters.toDate;
    }

    const [total, completed, failed, pending] = await Promise.all([
      prisma.autoFulfillmentJob.count({ where }),
      prisma.autoFulfillmentJob.count({ where: { ...where, status: 'completed' } }),
      prisma.autoFulfillmentJob.count({ where: { ...where, status: 'failed' } }),
      prisma.autoFulfillmentJob.count({ where: { ...where, status: 'pending' } }),
    ]);

    const successRate = total > 0 ? (completed / total) * 100 : 0;

    // Calculate total profit
    const jobs = await prisma.autoFulfillmentJob.findMany({
      where: { ...where, status: 'completed' },
      select: { profitCalculation: true },
    });

    const totalProfit = jobs.reduce((sum, job) => {
      const calc = job.profitCalculation as any;
      return sum + (calc?.estimatedProfit || 0);
    }, 0);

    return {
      total,
      completed,
      failed,
      pending,
      successRate,
      totalProfit,
    };
  }

  /**
   * Retry failed job
   */
  static async retryJob(orgId: string, jobId: string) {
    const job = await prisma.autoFulfillmentJob.findFirst({
      where: { id: jobId, orgId },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const config = await this.getConfig(orgId);

    if (!config?.autoRetry) {
      throw new Error('Auto-retry is disabled');
    }

    if (job.attempts >= config.maxRetries) {
      throw new Error(`Maximum retry attempts (${config.maxRetries}) exceeded`);
    }

    return this.processLineItem(orgId, job.orderId, job.lineItemId);
  }

  /**
   * Export failed jobs to CSV for manual review
   */
  static async exportFailedJobs(orgId: string): Promise<string> {
    const jobs = await prisma.autoFulfillmentJob.findMany({
      where: {
        orgId,
        status: 'failed',
      },
      include: {
        order: {
          include: {
            lineItems: true,
            channel: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Order ID',
      'Channel',
      'SKU',
      'Quantity',
      'Sale Price',
      'Estimated Profit',
      'Error',
      'Attempts',
      'Created At',
    ];

    const rows = jobs.map(job => {
      const lineItem = job.order.lineItems.find(li => li.id === job.lineItemId);
      const calc = job.profitCalculation as any;

      return [
        job.order.channelOrderId || job.orderId,
        job.order.channel.channelName,
        lineItem?.sku || '',
        lineItem?.quantity || 0,
        calc?.salePrice || 0,
        calc?.estimatedProfit || 0,
        job.error || '',
        job.attempts,
        job.createdAt.toISOString(),
      ];
    });

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}
