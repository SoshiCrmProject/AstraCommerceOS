/**
 * Auto-Fulfillment Job Queue Worker
 * Processes Amazon purchase jobs in the background using BullMQ
 */

import { Queue, Worker, QueueEvents } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { AmazonAutomation } from './amazon.automation';
import { calculateProfit } from '../services/profit-calculator';
import { decryptAmazonCredentials } from '../services/encryption';

const prisma = new PrismaClient();

// Redis connection configuration
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  // For Upstash or other Redis services, use URL instead:
  // url: process.env.REDIS_URL,
};

// Create job queue
export const autoFulfillmentQueue = new Queue('auto-fulfillment', {
  connection: process.env.REDIS_URL ? { url: process.env.REDIS_URL } : connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 500, // Keep last 500 failed jobs
  },
});

// Queue events for monitoring
const queueEvents = new QueueEvents('auto-fulfillment', {
  connection: process.env.REDIS_URL ? { url: process.env.REDIS_URL } : connection,
});

// Job data interface
export interface AutoFulfillmentJobData {
  jobId: string;
  orgId: string;
  orderId: string;
  shopeeProductId: string;
  shopeeSku: string;
  quantity: number;
  shopeePrice: number;
  customerAddress: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

/**
 * Process a single auto-fulfillment job
 */
async function processAutoFulfillmentJob(job: any) {
  const data: AutoFulfillmentJobData = job.data;
  console.log(`[AutoFulfillment] Processing job ${data.jobId}`);
  
  try {
    // Update job status to evaluating
    await prisma.autoFulfillmentJob.update({
      where: { id: data.jobId },
      data: { status: 'evaluating' },
    });
    
    // Get organization config
    const config = await prisma.autoFulfillmentConfig.findFirst({
      where: { 
        orgId: data.orgId,
        enabled: true,
      },
    });
    
    if (!config) {
      throw new Error('Auto-fulfillment not enabled for this organization');
    }
    
    // Check if eligible channel
    if (config.eligibleChannels.length > 0) {
      const order = await prisma.order.findUnique({
        where: { id: data.orderId },
        include: { channel: true },
      });
      
      if (order && !config.eligibleChannels.includes(order.channel.id)) {
        await prisma.autoFulfillmentJob.update({
          where: { id: data.jobId },
          data: { 
            status: 'rejected',
            errorMessage: 'Channel not eligible for auto-fulfillment',
          },
        });
        return { success: false, reason: 'Channel not eligible' };
      }
    }
    
    // Check daily order limit
    if (config.maxDailyOrders > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayJobsCount = await prisma.autoFulfillmentJob.count({
        where: {
          orgId: data.orgId,
          status: { in: ['completed', 'purchasing'] },
          createdAt: { gte: today },
        },
      });
      
      if (todayJobsCount >= config.maxDailyOrders) {
        await prisma.autoFulfillmentJob.update({
          where: { id: data.jobId },
          data: { 
            status: 'rejected',
            errorMessage: `Daily order limit reached (${config.maxDailyOrders})`,
          },
        });
        return { success: false, reason: 'Daily limit reached' };
      }
    }
    
    // Get or search for product mapping
    let mapping = await prisma.productMapping.findFirst({
      where: {
        orgId: data.orgId,
        shopeeSku: data.shopeeSku,
        isActive: true,
      },
    });
    
    let amazonAsin = mapping?.amazonAsin;
    let amazonUrl = mapping?.amazonUrl;
    
    // If no mapping exists, search Amazon (auto-mapping)
    if (!amazonAsin && config.amazonCredentials) {
      console.log(`[AutoFulfillment] No mapping found, searching Amazon for SKU: ${data.shopeeSku}`);
      
      const credentials = decryptAmazonCredentials(config.amazonCredentials);
      const automation = new AmazonAutomation(credentials);
      
      try {
        await automation.initialize();
        
        // Search for product
        const searchResults = await automation.searchProduct(data.shopeeSku);
        
        if (searchResults.length > 0) {
          const firstResult = searchResults[0];
          amazonAsin = firstResult.asin;
          amazonUrl = firstResult.url;
          
          // Create auto-mapping
          mapping = await prisma.productMapping.create({
            data: {
              orgId: data.orgId,
              shopeeProductId: data.shopeeProductId,
              shopeeSku: data.shopeeSku,
              amazonAsin,
              amazonUrl,
              mappingType: 'automatic',
              confidence: 0.7, // Auto-mapped, medium confidence
              verificationStatus: 'pending',
              isActive: true,
            },
          });
          
          console.log(`[AutoFulfillment] Auto-mapped ${data.shopeeSku} -> ${amazonAsin}`);
        }
      } finally {
        await automation.close();
      }
    }
    
    if (!amazonAsin) {
      await prisma.autoFulfillmentJob.update({
        where: { id: data.jobId },
        data: { 
          status: 'rejected',
          errorMessage: 'No Amazon product mapping found',
        },
      });
      return { success: false, reason: 'No mapping' };
    }
    
    // Get Amazon product details
    const credentials = decryptAmazonCredentials(config.amazonCredentials!);
    const automation = new AmazonAutomation(credentials);
    
    try {
      await automation.initialize();
      
      const productDetails = await automation.getProductDetails(amazonAsin);
      
      if (!productDetails.available) {
        await prisma.autoFulfillmentJob.update({
          where: { id: data.jobId },
          data: { 
            status: 'rejected',
            errorMessage: 'Product not available on Amazon',
          },
        });
        return { success: false, reason: 'Not available' };
      }
      
      // Calculate profit
      const profitResult = calculateProfit({
        shopeePrice: data.shopeePrice,
        amazonPrice: productDetails.price,
        amazonShipping: productDetails.shipping || 0,
        amazonTax: productDetails.estimatedTax || 0,
        amazonPoints: productDetails.points || 0,
        domesticShipping: 0, // TODO: Get from config
        shopeeCommissionRate: config.shopeeCommissionRate || 0.05,
        includeAmazonPoints: config.includeAmazonPoints,
        includeDomesticShipping: config.includeDomesticShipping,
      });
      
      // Update job with profit calculation
      await prisma.autoFulfillmentJob.update({
        where: { id: data.jobId },
        data: {
          asin: amazonAsin,
          amazonPrice: productDetails.price,
          sourceCost: profitResult.amazonTotal,
          estimatedShipping: productDetails.shipping || 0,
          estimatedFees: profitResult.shopeeCommission,
          expectedProfit: profitResult.netProfit,
        },
      });
      
      // Check if meets profit threshold
      if (!profitResult.isEligible) {
        await prisma.autoFulfillmentJob.update({
          where: { id: data.jobId },
          data: { 
            status: 'rejected',
            errorMessage: profitResult.rejectionReason,
          },
        });
        return { success: false, reason: profitResult.rejectionReason };
      }
      
      // Check if requires manual approval
      if (config.requireManualApproval) {
        await prisma.autoFulfillmentJob.update({
          where: { id: data.jobId },
          data: { status: 'approved' },
        });
        console.log(`[AutoFulfillment] Job ${data.jobId} requires manual approval`);
        return { success: true, requiresApproval: true };
      }
      
      // Proceed with automated purchase
      await prisma.autoFulfillmentJob.update({
        where: { id: data.jobId },
        data: { status: 'purchasing' },
      });
      
      console.log(`[AutoFulfillment] Purchasing ${amazonAsin} for job ${data.jobId}`);
      
      // Add to cart
      await automation.addToCart(amazonAsin, data.quantity);
      
      // Checkout with customer address
      const purchaseResult = await automation.checkout({
        name: data.customerAddress.name,
        addressLine1: data.customerAddress.addressLine1,
        addressLine2: data.customerAddress.addressLine2,
        city: data.customerAddress.city,
        state: data.customerAddress.state,
        postalCode: data.customerAddress.postalCode,
        country: data.customerAddress.country,
        phone: data.customerAddress.phone,
      });
      
      if (purchaseResult.success) {
        await prisma.autoFulfillmentJob.update({
          where: { id: data.jobId },
          data: { 
            status: 'completed',
            amazonOrderId: purchaseResult.orderId,
            trackingNumber: purchaseResult.trackingNumber,
            completedAt: new Date(),
          },
        });
        
        console.log(`[AutoFulfillment] Job ${data.jobId} completed successfully`);
        return { success: true, orderId: purchaseResult.orderId };
      } else {
        throw new Error(purchaseResult.error || 'Checkout failed');
      }
      
    } finally {
      await automation.close();
    }
    
  } catch (error: any) {
    console.error(`[AutoFulfillment] Job ${data.jobId} failed:`, error);
    
    await prisma.autoFulfillmentJob.update({
      where: { id: data.jobId },
      data: { 
        status: 'failed',
        errorMessage: error.message || 'Unknown error',
      },
    });
    
    throw error; // Re-throw for retry mechanism
  }
}

/**
 * Create and start the worker
 */
export function createAutoFulfillmentWorker() {
  const worker = new Worker('auto-fulfillment', processAutoFulfillmentJob, {
    connection: process.env.REDIS_URL ? { url: process.env.REDIS_URL } : connection,
    concurrency: 2, // Process 2 jobs at a time
    limiter: {
      max: 10, // Max 10 jobs
      duration: 60000, // Per minute (rate limiting)
    },
  });
  
  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed`);
  });
  
  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err.message);
  });
  
  worker.on('error', (err) => {
    console.error('[Worker] Error:', err);
  });
  
  return worker;
}

/**
 * Add a job to the queue
 */
export async function queueAutoFulfillmentJob(data: AutoFulfillmentJobData) {
  const job = await autoFulfillmentQueue.add('process', data, {
    jobId: data.jobId,
  });
  
  console.log(`[Queue] Added job ${data.jobId} to queue`);
  return job;
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string) {
  const job = await autoFulfillmentQueue.getJob(jobId);
  return job ? await job.getState() : null;
}

// Export queue events for monitoring
export { queueEvents };
