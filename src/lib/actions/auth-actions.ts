'use server';

import { getUserWithOrg } from '@/lib/supabase/auth-utils';

/**
 * Get current user's organization ID
 * Can be called from client components
 */
export async function getCurrentOrgId(): Promise<string> {
  try {
    const user = await getUserWithOrg();
    
    if (!user || !user.currentOrgId) {
      throw new Error('No organization found for current user');
    }
    
    return user.currentOrgId;
  } catch (error) {
    console.error('Error getting current org ID:', error);
    throw new Error('Failed to get organization ID');
  }
}

/**
 * Get current user with organization
 * Can be called from client components
 */
export async function getCurrentUser() {
  try {
    const user = await getUserWithOrg();
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw new Error('Failed to get current user');
  }
}
