// @ts-nocheck
'use server';

import { ReviewsService } from '@/lib/services/reviews.service';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { revalidatePath } from 'next/cache';

/**
 * Get reviews with filters
 */
export async function getReviews(params?: {
  channelId?: string;
  productId?: string;
  rating?: number;
  sentiment?: string;
  status?: string;
  skip?: number;
  take?: number;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const result = await ReviewsService.getReviews(user.currentOrgId, params);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Reply to review
 */
export async function replyToReview(reviewId: string, reply: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const review = await ReviewsService.replyToReview(user.currentOrgId, reviewId, reply);

    revalidatePath('/[locale]/app/reviews');

    return { success: true, data: review };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update review status
 */
export async function updateReviewStatus(reviewId: string, status: string) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const review = await ReviewsService.updateReview(user.currentOrgId, reviewId, { status });

    revalidatePath('/[locale]/app/reviews');

    return { success: true, data: review };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get review statistics
 */
export async function getReviewStats(filters?: {
  channelId?: string;
  productId?: string;
  fromDate?: Date;
  toDate?: Date;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const stats = await ReviewsService.getReviewStats(user.currentOrgId, filters);

    return { success: true, data: stats };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get trending topics from reviews
 */
export async function getTrendingTopics(limit: number = 10) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const topics = await ReviewsService.getTrendingTopics(user.currentOrgId, limit);

    return { success: true, data: topics };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
