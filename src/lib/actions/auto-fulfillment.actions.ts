'use server';

import { AutoFulfillmentService } from '@/lib/services/auto-fulfillment.service';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Get auto-fulfillment configuration
 */
export async function getAutoFulfillmentConfig() {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const config = await AutoFulfillmentService.getConfig(user.currentOrgId);

    return { success: true, data: config };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update auto-fulfillment configuration
 */
export async function updateAutoFulfillmentConfig(formData: FormData) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const config = {
      enabled: formData.get('enabled') === 'true',
      sourceChannels: JSON.parse(formData.get('sourceChannels') as string || '[]'),
      targetMarketplace: formData.get('targetMarketplace') as any || 'amazon',
      minProfitAmount: parseFloat(formData.get('minProfitAmount') as string || '0'),
      maxDeliveryDays: parseInt(formData.get('maxDeliveryDays') as string || '14'),
      includePoints: formData.get('includePoints') === 'true',
      includeShippingCost: formData.get('includeShippingCost') === 'true',
      autoRetry: formData.get('autoRetry') === 'true',
      maxRetries: parseInt(formData.get('maxRetries') as string || '3'),
    };

    const updated = await AutoFulfillmentService.updateConfig(user.currentOrgId, config);

    revalidatePath('/[locale]/app/automation/auto-fulfillment');

    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if order line item is eligible for auto-fulfillment
 */
export async function checkFulfillmentEligibility(orderId: string, lineItemId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const eligibility = await AutoFulfillmentService.checkEligibility(
      user.currentOrgId,
      orderId,
      lineItemId
    );

    return { success: true, data: eligibility };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Process auto-fulfillment for an order
 */
export async function processAutoFulfillment(orderId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const results = await AutoFulfillmentService.processOrder(user.currentOrgId, orderId);

    revalidatePath('/[locale]/app/orders');
    revalidatePath(`/[locale]/app/orders/${orderId}`);
    revalidatePath('/[locale]/app/automation/auto-fulfillment');

    return { success: true, data: results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Process single line item for auto-fulfillment
 */
export async function processLineItemFulfillment(orderId: string, lineItemId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await AutoFulfillmentService.processLineItem(
      user.currentOrgId,
      orderId,
      lineItemId
    );

    revalidatePath('/[locale]/app/orders');
    revalidatePath(`/[locale]/app/orders/${orderId}`);
    revalidatePath('/[locale]/app/automation/auto-fulfillment');

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get fulfillment jobs with filters
 */
export async function getFulfillmentJobs(params?: {
  status?: string;
  fromDate?: Date;
  toDate?: Date;
  skip?: number;
  take?: number;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await AutoFulfillmentService.getJobs(user.currentOrgId, params);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get fulfillment statistics
 */
export async function getFulfillmentStats(filters?: {
  fromDate?: Date;
  toDate?: Date;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const stats = await AutoFulfillmentService.getStats(user.currentOrgId, filters);

    return { success: true, data: stats };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Retry failed fulfillment job
 */
export async function retryFulfillmentJob(jobId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await AutoFulfillmentService.retryJob(user.currentOrgId, jobId);

    revalidatePath('/[locale]/app/automation/auto-fulfillment');

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Export failed jobs to CSV
 */
export async function exportFailedJobs() {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const csv = await AutoFulfillmentService.exportFailedJobs(user.currentOrgId);

    return { success: true, data: csv };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
