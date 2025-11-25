/**
 * Seed demo data for a specific organization
 * Usage: node scripts/seed-org-data.mjs <orgId>
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedOrgData(orgId) {
  console.log(`Seeding demo data for organization: ${orgId}`);

  // Check if org exists
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: { owner: true },
  });

  if (!org) {
    console.error(`Organization ${orgId} not found`);
    process.exit(1);
  }

  console.log(`Found organization: ${org.name} (Owner: ${org.owner.email})`);

  // Create demo channels
  console.log('Creating demo channels...');
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

  console.log(`Created ${channels.length} channels`);

  // Create demo products
  console.log('Creating demo products...');
  const products = [];
  for (let i = 1; i <= 5; i++) {
    const product = await prisma.product.create({
      data: {
        orgId,
        name: `Demo Product ${i}`,
        description: `This is a demo product for testing purposes`,
        brand: 'Demo Brand',
        category: 'Electronics',
        status: 'active',
        skus: {
          create: [{
            sku: `SKU-DEMO-${i}`,
            barcode: `123456789${i}`,
            cost: 50.00,
            price: 99.99,
            currency: 'USD',
          }],
        },
      },
    });
    products.push(product);
  }

  console.log(`Created ${products.length} products`);

  // Create demo orders
  console.log('Creating demo orders...');
  const now = new Date();
  const orders = [];
  
  for (let i = 0; i < 10; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    const order = await prisma.order.create({
      data: {
        orgId,
        channelId: channels[Math.floor(Math.random() * channels.length)].id,
        orderNumber: `ORD-${Date.now()}-${i}`,
        customerName: `Customer ${i + 1}`,
        customerEmail: `customer${i + 1}@example.com`,
        status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        orderedAt: orderDate,
        total: 99.99 + (i * 10),
        currency: 'USD',
        lineItems: {
          create: [{
            productSku: `SKU-DEMO-${(i % 5) + 1}`,
            productName: `Demo Product ${(i % 5) + 1}`,
            quantity: 1 + Math.floor(Math.random() * 3),
            unitPrice: 99.99,
            total: 99.99 + (i * 10),
          }],
        },
      },
    });
    orders.push(order);
  }

  console.log(`Created ${orders.length} orders`);

  // Create demo inventory
  console.log('Creating demo inventory...');
  for (const product of products) {
    const skus = await prisma.productSku.findMany({
      where: { productId: product.id },
    });

    for (const sku of skus) {
      await prisma.inventoryItem.create({
        data: {
          orgId,
          skuId: sku.id,
          warehouseLocation: 'Main Warehouse',
          available: 100 + Math.floor(Math.random() * 500),
          reserved: Math.floor(Math.random() * 20),
          inbound: Math.floor(Math.random() * 50),
          safetyStock: 50,
        },
      });
    }
  }

  console.log('Demo data seeded successfully! ✅');
}

// Get orgId from command line args
const orgId = process.argv[2];

if (!orgId) {
  console.error('Usage: node scripts/seed-org-data.mjs <orgId>');
  console.error('Example: node scripts/seed-org-data.mjs cm44x3hni000008l2c9xya1b2');
  process.exit(1);
}

seedOrgData(orgId)
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
