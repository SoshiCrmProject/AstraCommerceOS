import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in development only!)
  if (process.env.NODE_ENV !== 'production') {
    console.log('🧹 Clearing existing data...');
    await prisma.copilotMessage.deleteMany();
    await prisma.copilotThread.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.jobQueueItem.deleteMany();
    await prisma.autoFulfillmentJob.deleteMany();
    await prisma.autoFulfillmentConfig.deleteMany();
    await prisma.automationExecution.deleteMany();
    await prisma.automationRule.deleteMany();
    await prisma.repricingRun.deleteMany();
    await prisma.pricingRule.deleteMany();
    await prisma.channelSyncLog.deleteMany();
    await prisma.fulfillment.deleteMany();
    await prisma.orderLineItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.channelConnection.deleteMany();
    await prisma.review.deleteMany();
    await prisma.analyticsSnapshot.deleteMany();
    await prisma.logEntry.deleteMany();
    await prisma.integrationSettings.deleteMany();
    await prisma.notificationSettings.deleteMany();
    await prisma.brandingSettings.deleteMany();
    await prisma.orgSettings.deleteMany();
    await prisma.sku.deleteMany();
    await prisma.product.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();
  }

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123456', 10);
  
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@astracommerce.com',
      passwordHash: hashedPassword,
      name: 'Demo User',
      emailVerified: true,
      locale: 'en',
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create demo organization
  const demoOrg = await prisma.organization.create({
    data: {
      name: 'Acme Commerce',
      slug: 'acme-commerce',
      ownerId: demoUser.id,
      plan: 'professional',
      planStatus: 'active',
      billingEmail: 'billing@acmecommerce.com',
      mrr: 299,
      billingCycle: 'monthly',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      logoUrl: '/branding/acme-logo.png',
    },
  });

  console.log('✅ Created organization:', demoOrg.name);

  // Create membership
  await prisma.membership.create({
    data: {
      orgId: demoOrg.id,
      userId: demoUser.id,
      role: 'owner',
    },
  });

  // Create org settings
  await prisma.orgSettings.create({
    data: {
      orgId: demoOrg.id,
      companyName: 'Acme Commerce Inc.',
      website: 'https://acmecommerce.com',
      industry: 'Consumer Electronics',
      currency: 'USD',
      timezone: 'America/New_York',
      locale: 'en',
    },
  });

  await prisma.brandingSettings.create({
    data: {
      orgId: demoOrg.id,
      logoUrl: '/branding/acme-logo.png',
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
      emailFrom: 'noreply@acmecommerce.com',
      emailReplyTo: 'support@acmecommerce.com',
    },
  });

  await prisma.notificationSettings.create({
    data: {
      orgId: demoOrg.id,
      emailEnabled: true,
      emailAddress: 'alerts@acmecommerce.com',
      orderNotifications: true,
      inventoryNotifications: true,
      reviewNotifications: true,
      systemNotifications: true,
    },
  });

  await prisma.integrationSettings.create({
    data: {
      orgId: demoOrg.id,
    },
  });

  console.log('✅ Created organization settings');

  // Create channel connections
  const amazonChannel = await prisma.channelConnection.create({
    data: {
      orgId: demoOrg.id,
      channelType: 'amazon',
      channelName: 'Amazon US',
      credentials: {
        sellerId: 'A1EXAMPLE',
        marketplaceId: 'ATVPDKIKX0DER',
        region: 'us-east-1',
      },
      status: 'active',
      health: 'healthy',
      lastHealthCheck: new Date(),
      autoSync: true,
      syncFrequency: 3600,
      lastSyncedAt: new Date(),
    },
  });

  const shopifyChannel = await prisma.channelConnection.create({
    data: {
      orgId: demoOrg.id,
      channelType: 'shopify',
      channelName: 'Acme Store',
      credentials: {
        shopDomain: 'acme-store.myshopify.com',
        accessToken: 'shpat_example',
      },
      status: 'active',
      health: 'healthy',
      lastHealthCheck: new Date(),
      autoSync: true,
      syncFrequency: 3600,
      lastSyncedAt: new Date(),
    },
  });

  const shopeeChannel = await prisma.channelConnection.create({
    data: {
      orgId: demoOrg.id,
      channelType: 'shopee',
      channelName: 'Shopee SG',
      credentials: {
        shopId: '123456',
        partnerId: 'PARTNER123',
        region: 'sg',
      },
      status: 'active',
      health: 'healthy',
      lastHealthCheck: new Date(),
      autoSync: true,
      syncFrequency: 3600,
      lastSyncedAt: new Date(),
    },
  });

  console.log('✅ Created 3 channel connections');

  // Create products and SKUs
  const products = [];
  const skus = [];

  const productData = [
    {
      name: 'Wireless Gaming Headset Pro',
      brand: 'Acme Audio',
      category: 'Electronics',
      description: 'Premium wireless gaming headset with 7.1 surround sound',
      tags: ['gaming', 'wireless', 'electronics'],
      imageUrls: ['/products/headset-1.jpg'],
      skuData: [
        { sku: 'HEAD-WIRELESS-001', asin: 'B08XYZ1234', cost: 45.00 },
      ],
    },
    {
      name: 'Bluetooth Keyboard - Mechanical',
      brand: 'Acme Tech',
      category: 'Electronics',
      description: 'Mechanical keyboard with RGB backlight and Bluetooth 5.0',
      tags: ['keyboard', 'mechanical', 'bluetooth'],
      imageUrls: ['/products/keyboard-1.jpg'],
      skuData: [
        { sku: 'KEYB-MECH-001', asin: 'B08ABC5678', cost: 65.00 },
      ],
    },
    {
      name: 'Smart Fitness Watch',
      brand: 'Acme Fit',
      category: 'Wearables',
      description: 'Advanced fitness tracker with heart rate monitor and GPS',
      tags: ['fitness', 'smartwatch', 'health'],
      imageUrls: ['/products/watch-1.jpg'],
      skuData: [
        { sku: 'WATCH-SMART-001', asin: 'B08DEF9012', cost: 85.00 },
      ],
    },
    {
      name: 'USB-C Hub 7-in-1',
      brand: 'Acme Tech',
      category: 'Electronics',
      description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader',
      tags: ['usb-c', 'hub', 'adapter'],
      imageUrls: ['/products/hub-1.jpg'],
      skuData: [
        { sku: 'HUB-USBC-001', asin: 'B08GHI3456', cost: 22.00 },
      ],
    },
    {
      name: 'Portable Power Bank 20000mAh',
      brand: 'Acme Power',
      category: 'Electronics',
      description: 'High capacity power bank with fast charging',
      tags: ['power-bank', 'portable', 'charging'],
      imageUrls: ['/products/powerbank-1.jpg'],
      skuData: [
        { sku: 'POWER-20K-001', asin: 'B08JKL7890', cost: 28.00 },
      ],
    },
  ];

  for (const pd of productData) {
    const product = await prisma.product.create({
      data: {
        orgId: demoOrg.id,
        name: pd.name,
        brand: pd.brand,
        category: pd.category,
        description: pd.description,
        status: 'active',
        tags: pd.tags, // Store as JSON
        imageUrls: pd.imageUrls, // Store as JSON
      },
    });

    products.push(product);

    for (const sd of pd.skuData) {
      const sku = await prisma.sku.create({
        data: {
          orgId: demoOrg.id,
          productId: product.id,
          sku: sd.sku,
          name: product.name,
          costPrice: sd.cost,
          currency: 'USD',
          weight: 500,
          asin: sd.asin,
          status: 'active',
        },
      });

      skus.push(sku);

      // Create inventory
      await prisma.inventoryItem.create({
        data: {
          orgId: demoOrg.id,
          skuId: sku.id,
          location: 'default',
          available: Math.floor(Math.random() * 100) + 50,
          reserved: Math.floor(Math.random() * 10),
          incoming: Math.floor(Math.random() * 50),
          safetyStock: 20,
          reorderPoint: 30,
          reorderQuantity: 100,
        },
      });

      // Create listings on Amazon
      await prisma.listing.create({
        data: {
          orgId: demoOrg.id,
          skuId: sku.id,
          channelId: amazonChannel.id,
          externalId: sd.asin,
          title: product.name,
          description: product.description || '',
          bullets: ['Feature 1', 'Feature 2', 'Feature 3'],
          imageUrls: product.imageUrls || [],
          price: sd.cost * 2.5, // 2.5x markup
          currency: 'USD',
          quantity: Math.floor(Math.random() * 100) + 50,
          status: 'active',
          publishedAt: new Date(),
          lastSyncedAt: new Date(),
        },
      });

      // Create listings on Shopify
      await prisma.listing.create({
        data: {
          orgId: demoOrg.id,
          skuId: sku.id,
          channelId: shopifyChannel.id,
          externalId: `shopify-${sku.id}`,
          title: product.name,
          description: product.description || '',
          bullets: ['Feature 1', 'Feature 2', 'Feature 3'],
          imageUrls: product.imageUrls || [],
          price: sd.cost * 2.3, // 2.3x markup
          currency: 'USD',
          quantity: Math.floor(Math.random() * 100) + 50,
          status: 'active',
          publishedAt: new Date(),
          lastSyncedAt: new Date(),
        },
      });
    }
  }

  console.log(`✅ Created ${products.length} products with ${skus.length} SKUs`);

  // Create orders
  const now = new Date();
  const orderStatuses = ['pending', 'processing', 'shipped', 'delivered'];
  
  for (let i = 0; i < 25; i++) {
    const sku = skus[Math.floor(Math.random() * skus.length)];
    const channel = [amazonChannel, shopifyChannel, shopeeChannel][Math.floor(Math.random() * 3)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const unitPrice = (sku.costPrice || 50) * (Math.random() * 0.5 + 2); // 2-2.5x markup
    const subtotal = unitPrice * quantity;
    const shipping = Math.random() * 10 + 5;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    const orderDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

    const order = await prisma.order.create({
      data: {
        orgId: demoOrg.id,
        channelId: channel.id,
        orderNumber: `ORD-${Date.now()}-${i}`,
        externalOrderId: `EXT-${channel.channelType}-${i}`,
        customerName: `Customer ${i + 1}`,
        customerEmail: `customer${i + 1}@example.com`,
        shippingAddress: {
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'US',
        },
        subtotal,
        shipping,
        tax,
        total,
        currency: 'USD',
        status,
        paymentStatus: status === 'pending' ? 'unpaid' : 'paid',
        fulfillmentStatus: status === 'delivered' ? 'fulfilled' : status === 'shipped' ? 'fulfilled' : 'unfulfilled',
        orderedAt: orderDate,
        paidAt: status !== 'pending' ? orderDate : undefined,
        shippedAt: (status === 'shipped' || status === 'delivered') ? new Date(orderDate.getTime() + 24 * 60 * 60 * 1000) : undefined,
        deliveredAt: status === 'delivered' ? new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000) : undefined,
      },
    });

    await prisma.orderLineItem.create({
      data: {
        orderId: order.id,
        skuId: sku.id,
        productName: sku.name || 'Product',
        productSku: sku.sku,
        quantity,
        unitPrice,
        subtotal,
        tax,
        total: subtotal + tax,
      },
    });

    if (status === 'shipped' || status === 'delivered') {
      await prisma.fulfillment.create({
        data: {
          orderId: order.id,
          trackingNumber: `TRK-${Date.now()}-${i}`,
          carrier: 'USPS',
          method: 'standard',
          status: status === 'delivered' ? 'delivered' : 'in_transit',
          shippedAt: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000),
          deliveredAt: status === 'delivered' ? new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000) : undefined,
        },
      });
    }
  }

  console.log('✅ Created 25 orders with line items and fulfillments');

  // Create reviews
  const sentiments = ['positive', 'neutral', 'negative'];
  for (let i = 0; i < 15; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    const sentiment = rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'negative';
    
    await prisma.review.create({
      data: {
        orgId: demoOrg.id,
        productId: product.id,
        externalId: `REV-${i}`,
        channel: 'amazon',
        customerName: `Customer ${i + 1}`,
        title: rating >= 4 ? 'Great product!' : rating === 3 ? 'It\'s okay' : 'Not satisfied',
        body: rating >= 4 ? 'This product exceeded my expectations. Highly recommended!' : rating === 3 ? 'Product is decent but has some issues.' : 'Product quality is below expectations.',
        rating,
        sentiment,
        sentimentScore: rating >= 4 ? 0.8 : rating === 3 ? 0 : -0.8,
        status: Math.random() > 0.5 ? 'reviewed' : 'pending',
        priority: rating <= 2 ? 'high' : 'normal',
        reviewedAt: new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('✅ Created 15 reviews');

  // Create analytics snapshots
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    await prisma.analyticsSnapshot.create({
      data: {
        orgId: demoOrg.id,
        date,
        period: 'daily',
        revenue: Math.random() * 10000 + 5000,
        orders: Math.floor(Math.random() * 50) + 20,
        units: Math.floor(Math.random() * 100) + 50,
        profit: Math.random() * 3000 + 1500,
        channelMetrics: {
          amazon: { revenue: Math.random() * 5000, orders: Math.floor(Math.random() * 25) },
          shopify: { revenue: Math.random() * 3000, orders: Math.floor(Math.random() * 15) },
          shopee: { revenue: Math.random() * 2000, orders: Math.floor(Math.random() * 10) },
        },
      },
    });
  }

  console.log('✅ Created 30 analytics snapshots');

  // Create pricing rules
  await prisma.pricingRule.create({
    data: {
      orgId: demoOrg.id,
      name: 'Standard Margin Rule',
      description: 'Maintain 40% margin on all products',
      strategy: 'margin_target',
      targetMargin: 40,
      enabled: true,
      priority: 1,
    },
  });

  await prisma.pricingRule.create({
    data: {
      orgId: demoOrg.id,
      name: 'Min/Max Price Protection',
      description: 'Ensure prices stay within bounds',
      strategy: 'min_max',
      minPrice: 10,
      maxPrice: 500,
      enabled: true,
      priority: 2,
    },
  });

  console.log('✅ Created 2 pricing rules');

  // Create automation rules
  await prisma.automationRule.create({
    data: {
      orgId: demoOrg.id,
      name: 'Low Stock Alert',
      description: 'Alert when inventory falls below safety stock',
      triggerType: 'low_stock',
      triggerConfig: { threshold: 20 },
      conditions: [{ field: 'available', operator: '<', value: 20 }],
      actions: [{ type: 'send_email', config: { to: 'inventory@acmecommerce.com', subject: 'Low Stock Alert' } }],
      enabled: true,
      priority: 1,
    },
  });

  await prisma.automationRule.create({
    data: {
      orgId: demoOrg.id,
      name: 'Negative Review Alert',
      description: 'Alert on 1-2 star reviews',
      triggerType: 'negative_review',
      triggerConfig: { ratingThreshold: 2 },
      conditions: [{ field: 'rating', operator: '<=', value: 2 }],
      actions: [{ type: 'send_email', config: { to: 'support@acmecommerce.com', subject: 'Negative Review Alert' } }],
      enabled: true,
      priority: 2,
    },
  });

  console.log('✅ Created 2 automation rules');

  // Create log entries
  const logLevels = ['info', 'warn', 'error'];
  const logSources = ['CONNECTOR', 'AUTOMATION', 'JOB_QUEUE', 'API'];
  
  for (let i = 0; i < 50; i++) {
    await prisma.logEntry.create({
      data: {
        orgId: demoOrg.id,
        level: logLevels[Math.floor(Math.random() * logLevels.length)],
        source: logSources[Math.floor(Math.random() * logSources.length)],
        message: `Log entry ${i + 1}`,
        entityType: 'order',
        entityId: `order-${i}`,
        timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('✅ Created 50 log entries');

  // Create channel sync logs
  const channels = [amazonChannel, shopifyChannel, shopeeChannel];
  const syncTypes = ['orders', 'listings', 'inventory', 'pricing'];
  
  for (let i = 0; i < 20; i++) {
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const syncType = syncTypes[Math.floor(Math.random() * syncTypes.length)];
    const startedAt = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const duration = Math.floor(Math.random() * 30000) + 5000;
    const itemsProcessed = Math.floor(Math.random() * 100) + 10;
    const itemsFailed = Math.floor(Math.random() * 5);
    
    await prisma.channelSyncLog.create({
      data: {
        orgId: demoOrg.id,
        channelId: channel.id,
        syncType,
        status: itemsFailed > 0 ? 'partial' : 'success',
        itemsProcessed,
        itemsSucceeded: itemsProcessed - itemsFailed,
        itemsFailed,
        startedAt,
        completedAt: new Date(startedAt.getTime() + duration),
        duration,
      },
    });
  }

  console.log('✅ Created 20 channel sync logs');

  // Create auto-fulfillment config
  await prisma.autoFulfillmentConfig.create({
    data: {
      orgId: demoOrg.id,
      enabled: true,
      includeAmazonPoints: true,
      includeDomesticShipping: true,
      maxDeliveryDays: 7,
      minExpectedProfit: 5.0,
      eligibleChannels: ['shopee', 'shopify'],
      maxDailyOrders: 50,
      requireManualApproval: false,
    },
  });

  console.log('✅ Created auto-fulfillment config');

  // Create AI copilot thread
  const thread = await prisma.copilotThread.create({
    data: {
      orgId: demoOrg.id,
      userId: demoUser.id,
      title: 'Product pricing optimization',
      contextType: 'pricing',
      lastMessageAt: new Date(),
    },
  });

  await prisma.copilotMessage.create({
    data: {
      threadId: thread.id,
      role: 'user',
      content: 'How can I optimize pricing for my gaming headset?',
    },
  });

  await prisma.copilotMessage.create({
    data: {
      threadId: thread.id,
      role: 'assistant',
      content: 'Based on your current data, I recommend setting a competitive price of $112.50 for the Wireless Gaming Headset Pro. This maintains your target margin while staying competitive in the market.',
      model: 'gpt-4',
      tokensUsed: 150,
    },
  });

  console.log('✅ Created AI copilot thread with messages');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
