/**
 * Database Seed Script
 * Creates demo data for development and testing
 */

import prisma from '../src/lib/prisma';
import { hash } from 'bcrypt';

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data (development only!)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.copilotMessage.deleteMany();
    await prisma.copilotThread.deleteMany();
    await prisma.autoFulfillmentJob.deleteMany();
    await prisma.autoFulfillmentConfig.deleteMany();
    await prisma.automationExecution.deleteMany();
    await prisma.automationRule.deleteMany();
    await prisma.repricingRun.deleteMany();
    await prisma.pricingRule.deleteMany();
    await prisma.analyticsSnapshot.deleteMany();
    await prisma.review.deleteMany();
    await prisma.fulfillment.deleteMany();
    await prisma.orderLineItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.channelSyncLog.deleteMany();
    await prisma.channelConnection.deleteMany();
    await prisma.sku.deleteMany();
    await prisma.product.deleteMany();
    await prisma.logEntry.deleteMany();
    await prisma.jobQueueItem.deleteMany();
    await prisma.integrationSettings.deleteMany();
    await prisma.notificationSettings.deleteMany();
    await prisma.brandingSettings.deleteMany();
    await prisma.orgSettings.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();
  }

  // Create admin user
  console.log('👤 Creating admin user...');
  const passwordHash = await hash(process.env.SUPER_ADMIN_PASSWORD || 'admin123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@astracommerce.com',
      passwordHash,
      name: 'Admin User',
      emailVerified: true,
      locale: 'en',
    },
  });

  // Create demo organization
  console.log('🏢 Creating demo organization...');
  const demoOrg = await prisma.organization.create({
    data: {
      name: 'Demo Commerce Inc',
      slug: 'demo-commerce',
      ownerId: adminUser.id,
      plan: 'professional',
      planStatus: 'active',
      mrr: 199,
      memberships: {
        create: {
          userId: adminUser.id,
          role: 'owner',
        },
      },
      orgSettings: {
        create: {
          companyName: 'Demo Commerce Inc',
          currency: 'USD',
          timezone: 'America/New_York',
          locale: 'en',
        },
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
  });

  // Create products
  console.log('📦 Creating products...');
  const products = await Promise.all([
    prisma.product.create({
      data: {
        orgId: demoOrg.id,
        name: 'Premium Wireless Headphones',
        brand: 'TechAudio',
        category: 'Electronics',
        description: 'High-quality wireless headphones with noise cancellation',
        status: 'active',
        tags: ['electronics', 'audio', 'wireless'],
        imageUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
        skus: {
          create: [
            {
              orgId: demoOrg.id,
              sku: 'WH-1000-BLK',
              name: 'Premium Wireless Headphones - Black',
              costPrice: 89.99,
              currency: 'USD',
              variant: { color: 'Black' },
              status: 'active',
            },
            {
              orgId: demoOrg.id,
              sku: 'WH-1000-WHT',
              name: 'Premium Wireless Headphones - White',
              costPrice: 89.99,
              currency: 'USD',
              variant: { color: 'White' },
              status: 'active',
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        orgId: demoOrg.id,
        name: 'Smart Watch Pro',
        brand: 'FitTech',
        category: 'Wearables',
        description: 'Advanced fitness tracking smartwatch',
        status: 'active',
        tags: ['wearables', 'fitness', 'smart'],
        imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'],
        skus: {
          create: [
            {
              orgId: demoOrg.id,
              sku: 'SW-PRO-42',
              name: 'Smart Watch Pro - 42mm',
              costPrice: 149.99,
              currency: 'USD',
              variant: { size: '42mm' },
              status: 'active',
            },
          ],
        },
      },
    }),
  ]);

  // Get SKUs
  const skus = await prisma.sku.findMany({
    where: { orgId: demoOrg.id },
  });

  // Create channel connections
  console.log('🔌 Creating channel connections...');
  const amazonChannel = await prisma.channelConnection.create({
    data: {
      orgId: demoOrg.id,
      channelType: 'amazon',
      channelName: 'Amazon US',
      credentials: {
        clientId: 'demo-client-id',
        clientSecret: 'demo-secret',
        refreshToken: 'demo-refresh-token',
        region: 'us-east-1',
      },
      status: 'active',
      health: 'healthy',
      lastHealthCheck: new Date(),
      autoSync: true,
    },
  });

  const shopifyChannel = await prisma.channelConnection.create({
    data: {
      orgId: demoOrg.id,
      channelType: 'shopify',
      channelName: 'My Shopify Store',
      credentials: {
        shopDomain: 'demo-store.myshopify.com',
        accessToken: 'demo-access-token',
      },
      status: 'active',
      health: 'healthy',
      lastHealthCheck: new Date(),
      autoSync: true,
    },
  });

  // Create listings
  console.log('📝 Creating listings...');
  for (const sku of skus) {
    await prisma.listing.create({
      data: {
        orgId: demoOrg.id,
        skuId: sku.id,
        channelId: amazonChannel.id,
        externalId: `AMZN-${sku.sku}`,
        title: sku.name || 'Product Title',
        description: 'Premium quality product with excellent reviews',
        bullets: [
          'High-quality construction',
          'Fast shipping',
          'Excellent customer service',
          '1-year warranty included',
        ],
        price: (sku.costPrice || 0) * 2.2,
        quantity: 50,
        status: 'active',
        publishedAt: new Date(),
      },
    });
  }

  // Create inventory
  console.log('📊 Creating inventory...');
  for (const sku of skus) {
    await prisma.inventoryItem.create({
      data: {
        orgId: demoOrg.id,
        skuId: sku.id,
        available: 50,
        reserved: 5,
        incoming: 100,
        safetyStock: 10,
        reorderPoint: 20,
        reorderQuantity: 100,
      },
    });
  }

  // Create orders
  console.log('🛒 Creating orders...');
  await prisma.order.create({
    data: {
      orgId: demoOrg.id,
      channelId: amazonChannel.id,
      orderNumber: 'ORD-001',
      externalOrderId: '123-4567890-1234567',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      shippingAddress: {
        line1: '123 Main St',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        country: 'US',
      },
      subtotal: 199.98,
      shipping: 9.99,
      tax: 18.90,
      total: 228.87,
      status: 'processing',
      paymentStatus: 'paid',
      fulfillmentStatus: 'unfulfilled',
      orderedAt: new Date(),
      paidAt: new Date(),
      lineItems: {
        create: [
          {
            skuId: skus[0].id,
            productName: skus[0].name || 'Product',
            productSku: skus[0].sku,
            quantity: 1,
            unitPrice: 199.98,
            subtotal: 199.98,
            total: 199.98,
          },
        ],
      },
    },
  });

  // Create automation rules
  console.log('🤖 Creating automation rules...');
  await prisma.automationRule.create({
    data: {
      orgId: demoOrg.id,
      name: 'Low Stock Alert',
      description: 'Send alert when inventory falls below safety stock',
      triggerType: 'low_stock',
      triggerConfig: { threshold: 10 },
      conditions: [{ field: 'available', operator: 'lt', value: 10 }],
      actions: [
        { type: 'send_email', config: { to: adminUser.email, template: 'low_stock_alert' } },
      ],
      enabled: true,
    },
  });

  // Create reviews
  console.log('⭐ Creating reviews...');
  await prisma.review.create({
    data: {
      orgId: demoOrg.id,
      productId: products[0].id,
      channel: 'amazon',
      customerName: 'Jane Smith',
      title: 'Great product!',
      body: 'These headphones are amazing. Great sound quality and comfortable to wear.',
      rating: 5,
      sentiment: 'positive',
      sentimentScore: 0.95,
      status: 'pending',
      reviewedAt: new Date(),
    },
  });

  // Create analytics snapshots
  console.log('📈 Creating analytics data...');
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    await prisma.analyticsSnapshot.create({
      data: {
        orgId: demoOrg.id,
        date,
        period: 'daily',
        revenue: 500 + Math.random() * 500,
        orders: 5 + Math.floor(Math.random() * 10),
        units: 10 + Math.floor(Math.random() * 20),
        profit: 200 + Math.random() * 300,
        channelMetrics: {
          amazon: { revenue: 300, orders: 3 },
          shopify: { revenue: 200, orders: 2 },
        },
      },
    });
  }

  // Create logs
  console.log('📋 Creating log entries...');
  await prisma.logEntry.create({
    data: {
      orgId: demoOrg.id,
      level: 'info',
      source: 'CONNECTOR',
      message: 'Successfully synced orders from Amazon',
      entityType: 'channel',
      entityId: amazonChannel.id,
      metadata: { ordersCount: 5 },
    },
  });

  console.log('✅ Database seeding completed!');
  console.log('');
  console.log('Demo credentials:');
  console.log(`  Email: ${adminUser.email}`);
  console.log(`  Password: ${process.env.SUPER_ADMIN_PASSWORD || 'admin123'}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
