'use server';

import { OrdersService } from '@/lib/services/orders.service';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Get orders with filters
 */
export async function getOrders(params?: {
  search?: string;
  status?: string;
  channel?: string;
  fromDate?: Date;
  toDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  skip?: number;
  take?: number;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await OrdersService.getOrders(user.currentOrgId, params);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get single order
 */
export async function getOrder(orderId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const order = await OrdersService.getOrderById(user.currentOrgId, orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    return { success: true, data: order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Create order
 */
export async function createOrder(data: {
  channelId: string;
  channelOrderId?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress?: any;
  lineItems: Array<{
    sku: string;
    quantity: number;
    unitPrice: number;
  }>;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const order = await OrdersService.createOrder(user.currentOrgId, data);

    revalidatePath('/[locale]/app/orders');

    return { success: true, data: order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const order = await OrdersService.updateOrderStatus(user.currentOrgId, orderId, status);

    revalidatePath('/[locale]/app/orders');
    revalidatePath(`/[locale]/app/orders/${orderId}`);

    return { success: true, data: order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Create fulfillment
 */
export async function createFulfillment(
  orderId: string,
  data: {
    trackingNumber: string;
    carrier: string;
    lineItems: Array<{ lineItemId: string; quantity: number }>;
  }
) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const fulfillment = await OrdersService.createFulfillment(user.currentOrgId, orderId, data);

    revalidatePath('/[locale]/app/orders');
    revalidatePath(`/[locale]/app/orders/${orderId}`);

    return { success: true, data: fulfillment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get order statistics
 */
export async function getOrderStats(filters?: {
  fromDate?: Date;
  toDate?: Date;
  status?: string;
  channel?: string;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const stats = await OrdersService.getOrderStats(user.currentOrgId, filters);

    return { success: true, data: stats };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Cancel order
 */
export async function cancelOrder(orderId: string, reason?: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const order = await OrdersService.cancelOrder(user.currentOrgId, orderId, reason);

    revalidatePath('/[locale]/app/orders');
    revalidatePath(`/[locale]/app/orders/${orderId}`);

    return { success: true, data: order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Export orders to CSV
 */
export async function exportOrders(filters?: {
  fromDate?: Date;
  toDate?: Date;
  status?: string;
  channel?: string;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const csv = await OrdersService.exportToCSV(user.currentOrgId, filters);

    return { success: true, data: csv };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
