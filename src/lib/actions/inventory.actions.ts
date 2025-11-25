'use server';
// @ts-nocheck

import { InventoryService } from '@/lib/services/inventory.service';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Get inventory with filters
 */
export async function getInventory(params?: {
  location?: string;
  category?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
  skip?: number;
  take?: number;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await InventoryService.getInventory(user.currentOrgId, params);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get inventory by SKU
 */
export async function getInventoryBySku(sku: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const item = await InventoryService.getInventoryBySku(user.currentOrgId, sku);

    return { success: true, data: item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update inventory
 */
export async function updateInventory(sku: string, formData: FormData) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const data = {
      location: formData.get('location') as string,
      available: parseInt(formData.get('available') as string),
      reserved: formData.has('reserved') ? parseInt(formData.get('reserved') as string) : undefined,
      inTransit: formData.has('inTransit') ? parseInt(formData.get('inTransit') as string) : undefined,
      damaged: formData.has('damaged') ? parseInt(formData.get('damaged') as string) : undefined,
      lowStockThreshold: formData.has('lowStockThreshold') 
        ? parseInt(formData.get('lowStockThreshold') as string) 
        : undefined,
    };

    const item = await InventoryService.updateInventory(user.currentOrgId, sku, data);

    revalidatePath('/[locale]/app/inventory');

    return { success: true, data: item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Adjust inventory
 */
export async function adjustInventory(
  sku: string, 
  location: string, 
  adjustment: number, 
  reason?: string
) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const item = await InventoryService.adjustInventory(
      user.currentOrgId, 
      sku, 
      location, 
      adjustment, 
      reason
    );

    revalidatePath('/[locale]/app/inventory');

    return { success: true, data: item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get low stock items
 */
export async function getLowStockItems() {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const items = await InventoryService.getLowStockItems(user.currentOrgId);

    return { success: true, data: items };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get out of stock items
 */
export async function getOutOfStockItems() {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const items = await InventoryService.getOutOfStockItems(user.currentOrgId);

    return { success: true, data: items };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get inventory summary
 */
export async function getInventorySummary() {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const summary = await InventoryService.getInventorySummary(user.currentOrgId);

    return { success: true, data: summary };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sync inventory to channel
 */
export async function syncInventoryToChannel(sku: string, channelId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await InventoryService.syncToChannel(user.currentOrgId, sku, channelId);

    revalidatePath('/[locale]/app/inventory');
    revalidatePath('/[locale]/app/channels');

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sync all inventory to all channels
 */
export async function syncAllInventory() {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const results = await InventoryService.syncAllToChannels(user.currentOrgId);

    revalidatePath('/[locale]/app/inventory');
    revalidatePath('/[locale]/app/channels');

    return { success: true, data: results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
