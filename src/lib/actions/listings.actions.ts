// @ts-nocheck
'use server';

import { ListingsService } from '@/lib/services/listings.service';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Get listings with filters
 */
export async function getListings(params?: {
  channelId?: string;
  status?: string;
  sku?: string;
  skip?: number;
  take?: number;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await ListingsService.getListings(user.currentOrgId, params);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Create listing
 */
export async function createListing(formData: FormData) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const data = {
      sku: formData.get('sku') as string,
      channelId: formData.get('channelId') as string,
      channelListingId: formData.get('channelListingId') as string || undefined,
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      price: parseFloat(formData.get('price') as string),
      compareAtPrice: formData.has('compareAtPrice') 
        ? parseFloat(formData.get('compareAtPrice') as string) 
        : undefined,
      quantity: parseInt(formData.get('quantity') as string),
      imageUrls: JSON.parse(formData.get('imageUrls') as string || '[]'),
      bullets: JSON.parse(formData.get('bullets') as string || '[]'),
      category: formData.get('category') as string || undefined,
      status: (formData.get('status') as string) || 'draft',
    };

    const listing = await ListingsService.createListing(user.currentOrgId, data);

    revalidatePath('/[locale]/app/listings');

    return { success: true, data: listing };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update listing
 */
export async function updateListing(listingId: string, formData: FormData) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const data: any = {};

    if (formData.has('title')) data.title = formData.get('title') as string;
    if (formData.has('description')) data.description = formData.get('description') as string;
    if (formData.has('price')) data.price = parseFloat(formData.get('price') as string);
    if (formData.has('compareAtPrice')) data.compareAtPrice = parseFloat(formData.get('compareAtPrice') as string);
    if (formData.has('quantity')) data.quantity = parseInt(formData.get('quantity') as string);
    if (formData.has('imageUrls')) data.imageUrls = JSON.parse(formData.get('imageUrls') as string);
    if (formData.has('bullets')) data.bullets = JSON.parse(formData.get('bullets') as string);
    if (formData.has('category')) data.category = formData.get('category') as string;
    if (formData.has('status')) data.status = formData.get('status') as string;

    const listing = await ListingsService.updateListing(user.currentOrgId, listingId, data);

    revalidatePath('/[locale]/app/listings');
    revalidatePath(`/[locale]/app/listings/${listingId}`);

    return { success: true, data: listing };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete listing
 */
export async function deleteListing(listingId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    await ListingsService.deleteListing(user.currentOrgId, listingId);

    revalidatePath('/[locale]/app/listings');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Publish listing
 */
export async function publishListing(listingId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const listing = await ListingsService.publishListing(user.currentOrgId, listingId);

    revalidatePath('/[locale]/app/listings');
    revalidatePath(`/[locale]/app/listings/${listingId}`);

    return { success: true, data: listing };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Pause listing
 */
export async function pauseListing(listingId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const listing = await ListingsService.pauseListing(user.currentOrgId, listingId);

    revalidatePath('/[locale]/app/listings');
    revalidatePath(`/[locale]/app/listings/${listingId}`);

    return { success: true, data: listing };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Optimize listing with AI
 */
export async function optimizeListing(listingId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const listing = await ListingsService.optimizeListing(user.currentOrgId, listingId);

    revalidatePath('/[locale]/app/listings');
    revalidatePath(`/[locale]/app/listings/${listingId}`);

    return { success: true, data: listing };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sync listing to marketplace
 */
export async function syncListing(listingId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await ListingsService.syncListing(user.currentOrgId, listingId);

    revalidatePath('/[locale]/app/listings');
    revalidatePath(`/[locale]/app/listings/${listingId}`);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get listing performance
 */
export async function getListingPerformance(listingId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const performance = await ListingsService.getListingPerformance(user.currentOrgId, listingId);

    return { success: true, data: performance };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
