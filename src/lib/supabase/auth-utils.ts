/**
 * Supabase Auth Utilities
 * Helper functions for authentication and organization context
 */

import { supabaseServer } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { cache } from 'react';

/**
 * Seed demo data for a new organization
 */
async function seedDemoDataForOrg(orgId: string) {
  console.log(`Seeding demo data for organization: ${orgId}`);

  // Create demo channels
  const channels = await Promise.all([
    prisma.channelConnection.create({
      data: {
        orgId,
        channelType: 'amazon',
        channelName: 'Amazon US',
        credentials: {},
        config: { region: 'US', marketplace: 'amazon.com' },
        health: 'healthy',
        lastSyncedAt: new Date(),
      },
    }),
    prisma.channelConnection.create({
      data: {
        orgId,
        channelType: 'shopify',
        channelName: 'Shopify Store',
        credentials: {},
        config: { storeName: 'demo-store' },
        health: 'healthy',
        lastSyncedAt: new Date(),
      },
    }),
  ]);

  // Create demo products
  const products = [];
  for (let i = 1; i <= 5; i++) {
    const product = await prisma.product.create({
      data: {
        orgId,
        name: `Demo Product ${i}`,
        description: `Sample product for getting started with AstraCommerce OS`,
        brand: 'Demo Brand',
        category: 'Electronics',
        status: 'active',
        skus: {
          create: [{
            orgId,
            sku: `SKU-DEMO-${i}`,
            costPrice: 50.00,
            currency: 'USD',
          }],
        },
      },
    });
    products.push(product);
  }

  // Create demo orders
  const now = new Date();
  for (let i = 0; i < 10; i++) {
    const daysAgo = Math.floor(Math.random() * 7); // Last 7 days
    const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    await prisma.order.create({
      data: {
        orgId,
        channelId: channels[Math.floor(Math.random() * channels.length)].id,
        orderNumber: `ORD-${Date.now()}-${i}`,
        customerName: `Sample Customer ${i + 1}`,
        customerEmail: `customer${i + 1}@example.com`,
        status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        orderedAt: orderDate,
        subtotal: 99.99 + (i * 10),
        total: 99.99 + (i * 10),
        currency: 'USD',
        lineItems: {
          create: [{
            productSku: `SKU-DEMO-${(i % 5) + 1}`,
            productName: `Demo Product ${(i % 5) + 1}`,
            quantity: 1 + Math.floor(Math.random() * 2),
            unitPrice: 99.99,
            subtotal: 99.99 + (i * 10),
            total: 99.99 + (i * 10),
          }],
        },
      },
    });
  }

  // Create demo inventory
  for (const product of products) {
    const skus = await prisma.sku.findMany({
      where: { productId: product.id },
    });

    for (const sku of skus) {
      await prisma.inventoryItem.create({
        data: {
          orgId,
          skuId: sku.id,
          location: 'Main Warehouse',
          available: 100 + Math.floor(Math.random() * 400),
          reserved: Math.floor(Math.random() * 20),
          incoming: Math.floor(Math.random() * 50),
          safetyStock: 50,
        },
      });
    }
  }

  console.log('Demo data seeded: 2 channels, 5 products, 10 orders');
}

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
    console.log('=== getUserWithOrg START ===');
    console.log('Environment check:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('- DATABASE_URL:', !!process.env.DATABASE_URL);
    
    const supabase = await supabaseServer();
    console.log('Supabase client created');
    
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('Supabase auth.getUser() result:');
    console.log('- User:', user ? `ID: ${user.id}, Email: ${user.email}` : 'null');
    console.log('- Error:', error ? error.message : 'none');
    
    // If authenticated via Supabase, return user
    if (!error && user) {
      console.log('User authenticated via Supabase, looking up in Prisma...');
      // Get or create user in Prisma database
      let dbUser = await prisma.user.findUnique({
        where: { email: user.email || '' },
      });
      console.log('Prisma user lookup:', dbUser ? `Found: ${dbUser.id}` : 'Not found');

      // Auto-create user in database on first login
      let isNewUser = false;
      if (!dbUser && user.email) {
        console.log('Creating new user in Prisma database...');
        isNewUser = true;
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.user_metadata?.name || user.email.split('@')[0],
            authProviderId: user.id,
            emailVerified: true,
          },
        });
        console.log('User created in Prisma:', dbUser.id);

        // Create default organization for new user
        console.log('Creating default organization...');
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

        // Seed demo data for new organization
        console.log('Seeding demo data for new organization...');
        try {
          await seedDemoDataForOrg(org.id);
          console.log('Demo data seeded successfully');
        } catch (seedError) {
          console.error('Error seeding demo data:', seedError);
          // Don't fail user creation if seeding fails
        }
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
    // Log the actual error for debugging
    console.error('getUserWithOrg error:', err);
    
    // In production, log detailed error information
    if (err instanceof Error) {
      console.error('Full error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        cause: err.cause,
      });
    }
    
    // Check if it's a Prisma connection error
    if (err instanceof Error && (err.message.includes('PrismaClient') || err.message.includes('database'))) {
      console.error('Database connection error - check DATABASE_URL and DIRECT_URL environment variables');
    }
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
