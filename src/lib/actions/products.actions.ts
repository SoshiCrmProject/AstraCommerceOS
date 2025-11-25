'use server';

import { ProductsService } from '@/lib/services/products.service';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Get products with filters
 */
export async function getProducts(params?: {
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  skip?: number;
  take?: number;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await ProductsService.getProducts(user.currentOrgId, params);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get single product
 */
export async function getProduct(productId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const product = await ProductsService.getProductById(user.currentOrgId, productId);

    if (!product) {
      throw new Error('Product not found');
    }

    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Create product
 */
export async function createProduct(formData: FormData) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      brand: formData.get('brand') as string || undefined,
      description: formData.get('description') as string || undefined,
      imageUrls: JSON.parse(formData.get('imageUrls') as string || '[]'),
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      status: (formData.get('status') as string) || 'draft',
      skus: JSON.parse(formData.get('skus') as string || '[]'),
    };

    const product = await ProductsService.createProduct(user.currentOrgId, data);

    revalidatePath('/[locale]/app/products');

    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update product
 */
export async function updateProduct(productId: string, formData: FormData) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const data: any = {};

    if (formData.has('name')) data.name = formData.get('name') as string;
    if (formData.has('category')) data.category = formData.get('category') as string;
    if (formData.has('brand')) data.brand = formData.get('brand') as string;
    if (formData.has('description')) data.description = formData.get('description') as string;
    if (formData.has('imageUrls')) data.imageUrls = JSON.parse(formData.get('imageUrls') as string);
    if (formData.has('tags')) data.tags = JSON.parse(formData.get('tags') as string);
    if (formData.has('status')) data.status = formData.get('status') as string;

    const product = await ProductsService.updateProduct(user.currentOrgId, productId, data);

    revalidatePath('/[locale]/app/products');
    revalidatePath(`/[locale]/app/products/${productId}`);

    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    await ProductsService.deleteProduct(user.currentOrgId, productId);

    revalidatePath('/[locale]/app/products');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get filter options
 */
export async function getProductFilters() {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const [categories, brands] = await Promise.all([
      ProductsService.getCategories(user.currentOrgId),
      ProductsService.getBrands(user.currentOrgId),
    ]);

    return { success: true, data: { categories, brands } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Bulk update products
 */
export async function bulkUpdateProducts(productIds: string[], updates: any) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    await ProductsService.bulkUpdateProducts(user.currentOrgId, productIds, updates);

    revalidatePath('/[locale]/app/products');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
