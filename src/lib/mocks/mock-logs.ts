/**
 * Logs Mock Data
 */

import type { LogEntry, LogTimeBucket, LogOverviewSnapshot } from '../services/log-types';

function generateLogId(): string {
  return `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateTimestamp(hoursAgo: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
}

/**
 * Generate realistic log entries
 */
export const mockLogEntries: LogEntry[] = [
  {
    id: generateLogId(),
    timestamp: generateTimestamp(0.5),
    level: 'ERROR',
    source: 'CONNECTOR',
    message: 'Amazon SP-API rate limit exceeded',
    context: 'Failed to sync inventory for SKU-12345 due to API throttling',
    entityType: 'SKU',
    entityId: 'sku-12345',
    entityLabel: 'Premium Yoga Mat - Purple',
    orgId: 'org-001',
    requestId: 'req-abc123',
    correlationId: 'corr-xyz789',
    metadata: {
      apiEndpoint: '/catalog/2020-12-01/items',
      statusCode: 429,
      retryAfter: 60,
      sku: 'SKU-12345',
    },
  },
  {
    id: generateLogId(),
    timestamp: generateTimestamp(1),
    level: 'WARN',
    source: 'AUTOMATION',
    message: 'Repricing rule execution delayed',
    context: 'Rule "Competitive Pricing - Electronics" took 45s to execute (threshold: 30s)',
    entityType: 'AUTOMATION_RULE',
    entityId: 'rule-456',
    entityLabel: 'Competitive Pricing - Electronics',
    orgId: 'org-001',
    requestId: 'req-def456',
    metadata: {
      ruleId: 'rule-456',
      executionTimeMs: 45000,
      thresholdMs: 30000,
      affectedSkus: 234,
    },
  },
  {
    id: generateLogId(),
    timestamp: generateTimestamp(2),
    level: 'INFO',
    source: 'JOB_QUEUE',
    message: 'Inventory sync job completed successfully',
    context: 'Synced 1,234 SKUs across 5 channels in 23s',
    entityType: 'JOB',
    entityId: 'job-789',
    entityLabel: 'Inventory Sync - Daily',
    orgId: 'org-001',
    requestId: 'req-ghi789',
    correlationId: 'corr-abc123',
    metadata: {
      jobType: 'INVENTORY_SYNC',
      skuCount: 1234,
      channelCount: 5,
      durationMs: 23000,
    },
  },
  {
    id: generateLogId(),
    timestamp: generateTimestamp(3),
    level: 'ERROR',
    source: 'BACKEND',
    message: 'Database connection timeout',
    context: 'Failed to connect to primary database after 3 retry attempts',
    entityType: 'NONE',
    orgId: 'org-001',
    requestId: 'req-jkl012',
    metadata: {
      host: 'postgres-primary.internal',
      port: 5432,
      retries: 3,
      timeoutMs: 5000,
      error: 'ETIMEDOUT',
    },
  },
  {
    id: generateLogId(),
    timestamp: generateTimestamp(4),
    level: 'WARN',
    source: 'CONNECTOR',
    message: 'Shopify webhook delivery failed',
    context: 'Order created webhook could not be delivered (HTTP 503)',
    entityType: 'ORDER',
    entityId: 'ord-12345',
    entityLabel: '#12345',
    orgId: 'org-001',
    requestId: 'req-mno345',
    metadata: {
      webhookTopic: 'orders/create',
      statusCode: 503,
      attempt: 2,
      maxAttempts: 5,
    },
  },
  {
    id: generateLogId(),
    timestamp: generateTimestamp(5),
    level: 'INFO',
    source: 'AUTH',
    message: 'User login successful',
    context: 'User john@example.com logged in from 203.0.113.45',
    entityType: 'USER',
    entityId: 'user-123',
    entityLabel: 'John Doe',
    orgId: 'org-001',
    requestId: 'req-pqr678',
    metadata: {
      email: 'john@example.com',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0...',
    },
  },
  {
    id: generateLogId(),
    timestamp: generateTimestamp(6),
    level: 'FATAL',
    source: 'BACKEND',
    message: 'Unhandled exception in order processing pipeline',
    context: 'Null reference error when calculating shipping cost',
    entityType: 'ORDER',
    entityId: 'ord-67890',
    entityLabel: '#67890',
    orgId: 'org-001',
    requestId: 'req-stu901',
    correlationId: 'corr-def456',
    metadata: {
      exception: 'NullReferenceError',
      stackTrace: 'at calculateShipping (shipping.ts:45)\\nat processOrder (orders.ts:123)',
      orderId: 'ord-67890',
    },
  },
  {
    id: generateLogId(),
    timestamp: generateTimestamp(8),
    level: 'DEBUG',
    source: 'FRONTEND',
    message: 'React component rendered',
    context: 'ProductCard component rendered in 12ms',
    entityType: 'PRODUCT',
    entityId: 'prod-456',
    entityLabel: 'SmartFit Watch Pro',
    orgId: 'org-001',
    requestId: 'req-vwx234',
    metadata: {
      component: 'ProductCard',
      renderTimeMs: 12,
      props: { productId: 'prod-456' },
    },
  },
  {
    id: generateLogId(),
    timestamp: generateTimestamp(10),
    level: 'WARN',
    source: 'BILLING',
    message: 'Payment method expiring soon',
    context: 'Credit card ending in 4242 expires in 15 days',
    entityType: 'ORG',
    entityId: 'org-001',
    entityLabel: 'Acme Corp',
    orgId: 'org-001',
    requestId: 'req-yza567',
    metadata: {
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      daysUntilExpiry: 15,
    },
  },
  {
    id: generateLogId(),
    timestamp: generateTimestamp(12),
    level: 'INFO',
    source: 'AUTOMATION',
    message: 'Price update applied successfully',
    context: 'Updated 45 SKU prices based on competitive intelligence',
    entityType: 'AUTOMATION_RULE',
    entityId: 'rule-789',
    entityLabel: 'Dynamic Pricing - All Categories',
    orgId: 'org-001',
    requestId: 'req-bcd890',
    correlationId: 'corr-ghi789',
    metadata: {
      ruleId: 'rule-789',
      skusUpdated: 45,
      avgPriceChange: -2.5,
      minPrice: 19.99,
      maxPrice: 299.99,
    },
  },
];

/**
 * Generate time series buckets
 */
export function generateLogTimeSeries(hours: number = 24): LogTimeBucket[] {
  const buckets: LogTimeBucket[] = [];
  const now = new Date();
  
  for (let i = hours - 1; i >= 0; i--) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - i);
    
    const count = Math.floor(50 + Math.random() * 100);
    const errorCount = Math.floor(count * (0.05 + Math.random() * 0.1));
    const warnCount = Math.floor(count * (0.1 + Math.random() * 0.15));
    
    buckets.push({
      timestamp: timestamp.toISOString(),
      count,
      errorCount,
      warnCount,
    });
  }
  
  return buckets;
}

/**
 * Mock log overview snapshot
 */
export const mockLogOverview: LogOverviewSnapshot = {
  stats: {
    timeRangeLabel: 'Last 24 hours',
    totalLogs: 2847,
    errorCount: 156,
    warnCount: 432,
    infoCount: 2259,
    uniqueRequestIds: 1834,
    uniqueCorrelationIds: 567,
  },
  timeSeries: generateLogTimeSeries(24),
};
