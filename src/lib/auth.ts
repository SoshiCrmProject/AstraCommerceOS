/**
 * Auth utilities for AstraCommerce OS
 * Handles user authentication, org context, and RBAC
 */

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import prisma from './prisma';
import type { User, Organization, Membership } from '@prisma/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface AuthContext {
  user: User;
  org: Organization;
  membership: Membership;
  role: UserRole;
}

/**
 * Get server-side Supabase client with cookie support
 */
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });
}

/**
 * Get current authenticated user from Supabase session
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
    
    if (error || !supabaseUser) {
      return null;
    }

    // Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { email: supabaseUser.email! },
    });

    if (!user) {
      // Create user if doesn't exist (first login after signup)
      user = await prisma.user.create({
        data: {
          email: supabaseUser.email!,
          authProviderId: supabaseUser.id,
          emailVerified: supabaseUser.email_confirmed_at !== null,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
          lastLoginAt: new Date(),
        },
      });
    } else {
      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get user's organization memberships
 */
export async function getUserMemberships(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

/**
 * Get user's primary/active organization
 * Uses cookie to store selected org, falls back to first membership
 */
export async function getCurrentOrg(user: User): Promise<Organization | null> {
  try {
    const cookieStore = await cookies();
    const selectedOrgId = cookieStore.get('selected-org-id')?.value;

    // If user has selected org, verify they have access
    if (selectedOrgId) {
      const membership = await prisma.membership.findUnique({
        where: {
          orgId_userId: {
            orgId: selectedOrgId,
            userId: user.id,
          },
        },
        include: { organization: true },
      });

      if (membership) {
        return membership.organization;
      }
    }

    // Fall back to first membership
    const memberships = await getUserMemberships(user.id);
    return memberships[0]?.organization || null;
  } catch (error) {
    console.error('Error getting current org:', error);
    return null;
  }
}

/**
 * Get full auth context (user + org + membership)
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const org = await getCurrentOrg(user);
  if (!org) return null;

  const membership = await prisma.membership.findUnique({
    where: {
      orgId_userId: {
        orgId: org.id,
        userId: user.id,
      },
    },
  });

  if (!membership) return null;

  return {
    user,
    org,
    membership,
    role: membership.role as UserRole,
  };
}

/**
 * Require auth context or throw error
 */
export async function requireAuth(): Promise<AuthContext> {
  const context = await getAuthContext();
  if (!context) {
    throw new Error('Unauthorized - user must be signed in');
  }
  return context;
}

/**
 * Check if user has required role
 */
export function hasRole(context: AuthContext, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    owner: 4,
    admin: 3,
    member: 2,
    viewer: 1,
  };

  return roleHierarchy[context.role] >= roleHierarchy[requiredRole];
}

/**
 * Require specific role or throw error
 */
export async function requireRole(role: UserRole): Promise<AuthContext> {
  const context = await requireAuth();
  
  if (!hasRole(context, role)) {
    throw new Error(`Forbidden - requires ${role} role or higher`);
  }

  return context;
}

/**
 * Check if user can access specific org
 */
export async function canAccessOrg(userId: string, orgId: string): Promise<boolean> {
  const membership = await prisma.membership.findUnique({
    where: {
      orgId_userId: {
        orgId,
        userId,
      },
    },
  });

  return !!membership;
}

/**
 * Set active organization in cookie
 */
export async function setActiveOrg(orgId: string) {
  const cookieStore = await cookies();
  cookieStore.set('selected-org-id', orgId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

/**
 * Create new organization and assign owner
 */
export async function createOrganization(params: {
  userId: string;
  name: string;
  slug: string;
}) {
  const { userId, name, slug } = params;

  // Create org and membership in transaction
  const org = await prisma.organization.create({
    data: {
      name,
      slug,
      ownerId: userId,
      memberships: {
        create: {
          userId,
          role: 'owner',
        },
      },
      // Create default settings
      orgSettings: {
        create: {},
      },
      brandingSettings: {
        create: {},
      },
      notificationSettings: {
        create: {},
      },
      integrationSettings: {
        create: {},
      },
    },
    include: {
      memberships: true,
    },
  });

  return org;
}

/**
 * Invite user to organization
 */
export async function inviteToOrganization(params: {
  orgId: string;
  inviterUserId: string;
  inviteeEmail: string;
  role: UserRole;
}) {
  const { orgId, inviterUserId, inviteeEmail, role } = params;

  // Verify inviter has permission
  const inviterMembership = await prisma.membership.findUnique({
    where: {
      orgId_userId: {
        orgId,
        userId: inviterUserId,
      },
    },
  });

  if (!inviterMembership || !['owner', 'admin'].includes(inviterMembership.role)) {
    throw new Error('Forbidden - only owners and admins can invite users');
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: inviteeEmail },
  });

  if (existingUser) {
    // Check if already a member
    const existingMembership = await prisma.membership.findUnique({
      where: {
        orgId_userId: {
          orgId,
          userId: existingUser.id,
        },
      },
    });

    if (existingMembership) {
      throw new Error('User is already a member of this organization');
    }

    // Add directly as member
    return prisma.membership.create({
      data: {
        orgId,
        userId: existingUser.id,
        role,
      },
    });
  }

  // TODO: Send invite email and create pending invite
  // For now, just return null - implement invite system separately
  return null;
}

/**
 * Remove user from organization
 */
export async function removeFromOrganization(params: {
  orgId: string;
  userId: string;
  removedByUserId: string;
}) {
  const { orgId, userId, removedByUserId } = params;

  // Verify remover has permission
  const removerMembership = await prisma.membership.findUnique({
    where: {
      orgId_userId: {
        orgId,
        userId: removedByUserId,
      },
    },
  });

  if (!removerMembership || removerMembership.role !== 'owner') {
    throw new Error('Forbidden - only owners can remove members');
  }

  // Can't remove owner
  const targetMembership = await prisma.membership.findUnique({
    where: {
      orgId_userId: {
        orgId,
        userId,
      },
    },
  });

  if (targetMembership?.role === 'owner') {
    throw new Error('Cannot remove organization owner');
  }

  return prisma.membership.delete({
    where: {
      orgId_userId: {
        orgId,
        userId,
      },
    },
  });
}

/**
 * Log audit event
 */
export async function logAudit(params: {
  orgId: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  changes?: unknown;
  metadata?: unknown;
  ipAddress?: string;
  userAgent?: string;
}) {
  return prisma.auditLog.create({
    data: {
      orgId: params.orgId,
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      changes: params.changes as any,
      metadata: params.metadata as any,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    },
  });
}
