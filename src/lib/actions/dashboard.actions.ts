'use server';

import { DashboardService } from '@/lib/services/dashboard.service';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';

/**
 * Get dashboard snapshot with all KPIs, charts, and data
 */
export async function getDashboardSnapshot() {
  try {
    const user = await getUserWithOrg();
    
    if (!user.currentOrgId) {
      throw new Error('No organization selected');
    }

    const snapshot = await DashboardService.getDashboardSnapshot(user.currentOrgId);

    return { success: true, data: snapshot };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
