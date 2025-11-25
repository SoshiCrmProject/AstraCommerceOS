/**
 * Order Monitoring Service
 * Monitors new orders and triggers auto-fulfillment evaluation
 */

import { PrismaClient } from '@prisma/client';
import { queueAutoFulfillmentJob, type AutoFulfillmentJobData } from '../automation/fulfillment-worker';

const prisma = new PrismaClient();

/**
 * Process a new order for auto-fulfillment
 */
export async function processNewOrder(orderId: string) {
  try {
    // Get order details with all relations
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        channel: true,
        organization: {
          include: {
            autoFulfillmentConfigs: {
              where: { enabled: true },
            },
          },
        },
      },
    });
    
    if (!order) {
      console.log(`[OrderMonitor] Order ${orderId} not found`);
      return { success: false, reason: 'Order not found' };
    }
    
    // Check if auto-fulfillment is enabled for this organization
    const config = order.organization.autoFulfillmentConfigs[0];
    if (!config) {
      console.log(`[OrderMonitor] Auto-fulfillment not enabled for org ${order.orgId}`);
      return { success: false, reason: 'Not enabled' };
    }
    
    // Check if channel is eligible
    if (config.eligibleChannels.length > 0 && !config.eligibleChannels.includes(order.channelId)) {
      console.log(`[OrderMonitor] Channel ${order.channelId} not eligible`);
      return { success: false, reason: 'Channel not eligible' };
    }
    
    // Parse order items (assuming JSON format)
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    
    if (!Array.isArray(items) || items.length === 0) {
      console.log(`[OrderMonitor] No items in order ${orderId}`);
      return { success: false, reason: 'No items' };
    }
    
    // Process each item
    const jobs = [];
    for (const item of items) {
      // Create auto-fulfillment job record
      const job = await prisma.autoFulfillmentJob.create({
        data: {
          orgId: order.orgId,
          orderId: order.id,
          shopeeProductId: item.productId || item.id,
          shopeeSku: item.sku || item.productId,
          quantity: item.quantity || 1,
          shopeePrice: item.price || order.total / items.length,
          status: 'pending',
          purchaseMethod: 'headless_browser',
        },
      });
      
      // Parse shipping address
      const shippingAddress = typeof order.shippingAddress === 'string' 
        ? JSON.parse(order.shippingAddress) 
        : order.shippingAddress;
      
      // Queue the job for processing
      const jobData: AutoFulfillmentJobData = {
        jobId: job.id,
        orgId: order.orgId,
        orderId: order.id,
        shopeeProductId: item.productId || item.id,
        shopeeSku: item.sku || item.productId,
        quantity: item.quantity || 1,
        shopeePrice: item.price || order.total / items.length,
        customerAddress: {
          name: shippingAddress?.name || order.customerName || 'Customer',
          addressLine1: shippingAddress?.addressLine1 || shippingAddress?.address || '',
          addressLine2: shippingAddress?.addressLine2,
          city: shippingAddress?.city || '',
          state: shippingAddress?.state || shippingAddress?.province || '',
          postalCode: shippingAddress?.postalCode || shippingAddress?.zip || '',
          country: shippingAddress?.country || 'JP',
          phone: shippingAddress?.phone || order.customerEmail || '',
        },
      };
      
      await queueAutoFulfillmentJob(jobData);
      jobs.push(job.id);
      
      console.log(`[OrderMonitor] Queued job ${job.id} for order ${orderId}`);
    }
    
    return { success: true, jobIds: jobs };
    
  } catch (error: any) {
    console.error(`[OrderMonitor] Error processing order ${orderId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Monitor all new orders (can be called via cron job)
 */
export async function monitorNewOrders() {
  try {
    // Get all organizations with auto-fulfillment enabled
    const orgs = await prisma.organization.findMany({
      where: {
        autoFulfillmentConfigs: {
          some: { enabled: true },
        },
      },
      include: {
        autoFulfillmentConfigs: {
          where: { enabled: true },
        },
      },
    });
    
    console.log(`[OrderMonitor] Monitoring ${orgs.length} organizations`);
    
    let totalProcessed = 0;
    
    for (const org of orgs) {
      const config = org.autoFulfillmentConfigs[0];
      
      // Get new orders from last 5 minutes that haven't been processed
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const newOrders = await prisma.order.findMany({
        where: {
          orgId: org.id,
          createdAt: { gte: fiveMinutesAgo },
          status: { in: ['pending', 'processing'] },
          // Only orders from eligible channels
          ...(config.eligibleChannels.length > 0 && {
            channelId: { in: config.eligibleChannels },
          }),
        },
      });
      
      console.log(`[OrderMonitor] Found ${newOrders.length} new orders for org ${org.id}`);
      
      for (const order of newOrders) {
        // Check if already has auto-fulfillment jobs
        const existingJob = await prisma.autoFulfillmentJob.findFirst({
          where: { orderId: order.id },
        });
        
        if (!existingJob) {
          await processNewOrder(order.id);
          totalProcessed++;
        }
      }
    }
    
    console.log(`[OrderMonitor] Processed ${totalProcessed} new orders`);
    return { success: true, processed: totalProcessed };
    
  } catch (error: any) {
    console.error('[OrderMonitor] Error monitoring orders:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Manually trigger auto-fulfillment for a specific order
 */
export async function manuallyTriggerFulfillment(orderId: string, userId: string) {
  try {
    // Verify user has access to this order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        organization: {
          include: {
            users: { where: { userId } },
          },
        },
      },
    });
    
    if (!order || order.organization.users.length === 0) {
      return { success: false, error: 'Unauthorized' };
    }
    
    return await processNewOrder(orderId);
    
  } catch (error: any) {
    console.error('[OrderMonitor] Manual trigger error:', error);
    return { success: false, error: error.message };
  }
}
