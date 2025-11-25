/**
 * Supabase Auth Utilities
 * Helper functions for authentication and organization context
 */

import { supabaseServer } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { cache } from 'react';

export interface UserWithOrg {
  id: string;
  email: string;
  name: string | null;
  currentOrgId: string | null;
}

/**
 * Get current user with organization context
 * Cached per request
 */
export const getUserWithOrg = cache(async (): Promise<UserWithOrg> => {
  try {
    const supabase = await supabaseServer();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // If authenticated via Supabase, return user
    if (!error && user) {
      // Get or create user in Prisma database
      let dbUser = await prisma.user.findUnique({
        where: { email: user.email || '' },
      });

      // Auto-create user in database on first login
      if (!dbUser && user.email) {
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.user_metadata?.name || user.email.split('@')[0],
            authProviderId: user.id,
            emailVerified: true,
          },
        });

        // Create default organization for new user
        const org = await prisma.organization.create({
          data: {
            name: `${dbUser.name}'s Workspace`,
            slug: `${dbUser.email.split('@')[0]}-${Date.now()}`,
            ownerId: dbUser.id,
            plan: 'trial',
            planStatus: 'active',
          },
        });

        // Create membership
        await prisma.membership.create({
          data: {
            orgId: org.id,
            userId: dbUser.id,
            role: 'owner',
          },
        });
      }

      // Get user's organization from Prisma
      const membership = await prisma.membership.findFirst({
        where: { userId: dbUser?.id },
        include: { organization: true },
      });

      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || dbUser?.name || null,
        currentOrgId: membership?.orgId || null,
      };
    }
  } catch (err) {
    // Supabase not configured or error - fall through to demo mode
    console.log('Supabase auth error:', err);
  }

  // For development: Return demo user when Supabase auth is not available
  // This allows the app to run without Supabase configured
  if (process.env.NODE_ENV === 'development') {
    // Get the demo organization from database
    const demoOrg = await prisma.organization.findFirst({
      where: { slug: 'acme-commerce' },
    });

    return {
      id: 'demo-user-id',
      email: 'demo@astracommerce.com',
      name: 'Demo User',
      currentOrgId: demoOrg?.id || null,
    };
  }

  // In production, require authentication
  throw new Error('Not authenticated');
});

/**
 * Require authentication, throw if not logged in
 */
export async function requireAuth() {
  const user = await getUserWithOrg();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Check if user has permission for action
 */
export async function hasPermission(
  permission: string
): Promise<boolean> {
  const user = await getUserWithOrg();
  
  // In production, would check role-based permissions from database
  // For now, all authenticated users have all permissions
  return true;
}
