'use server';
// @ts-nocheck

import { AnalyticsService } from '@/lib/services/analytics.service';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';

/**
 * Get analytics time series
 */
export async function getAnalytics(params: {
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  fromDate: Date;
  toDate: Date;
  channelId?: string;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const data = await AnalyticsService.getAnalytics(user.currentOrgId, params);

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get real-time analytics
 */
export async function getRealTimeAnalytics(filters?: {
  channelId?: string;
  fromDate?: Date;
  toDate?: Date;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const analytics = await AnalyticsService.getRealTimeAnalytics(user.currentOrgId, filters);

    return { success: true, data: analytics };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Generate analytics snapshot (background job)
 */
export async function generateSnapshot() {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const snapshot = await AnalyticsService.generateSnapshot(user.currentOrgId);

    return { success: true, data: snapshot };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Detect anomalies in metrics
 */
export async function detectAnomalies(params: {
  metric: 'revenue' | 'orders' | 'units';
  days?: number;
  sensitivity?: number;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const anomalies = await AnalyticsService.detectAnomalies(user.currentOrgId, params);

    return { success: true, data: anomalies };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get conversion funnel
 */
export async function getConversionFunnel(filters?: {
  fromDate?: Date;
  toDate?: Date;
  channelId?: string;
}) {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const funnel = await AnalyticsService.getConversionFunnel(user.currentOrgId, filters);

    return { success: true, data: funnel };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
