import type {
  AutomationRuleSummary,
  AutomationRuleDetail,
  AutomationExecution,
  AutomationKpiSnapshot,
} from '../services/automation-types';

export const mockAutomationRules: AutomationRuleSummary[] = [
  {
    id: 'rule-001',
    name: 'Alert on Low Inventory',
    status: 'ACTIVE',
    triggerType: 'INVENTORY_BELOW_THRESHOLD',
    description: 'Send Slack notification when inventory drops below 7 days of cover',
    lastRunAt: '2024-06-20T08:30:00Z',
    lastRunStatus: 'SUCCESS',
    runsLast7d: 12,
    actionsCount: 2,
  },
  {
    id: 'rule-002',
    name: 'Price Margin Guard',
    status: 'ACTIVE',
    triggerType: 'PRICE_BELOW_MIN_MARGIN',
    description: 'Adjust pricing when margin falls below 20% on Amazon',
    lastRunAt: '2024-06-20T10:15:00Z',
    lastRunStatus: 'SUCCESS',
    runsLast7d: 8,
    actionsCount: 1,
  },
  {
    id: 'rule-003',
    name: 'High-Value Order Tagging',
    status: 'ACTIVE',
    triggerType: 'ORDER_CREATED',
    description: 'Tag orders over $500 as "High Value" for priority fulfillment',
    lastRunAt: '2024-06-20T11:45:00Z',
    lastRunStatus: 'SUCCESS',
    runsLast7d: 24,
    actionsCount: 2,
  },
  {
    id: 'rule-004',
    name: 'Negative Review Alert',
    status: 'ACTIVE',
    triggerType: 'NEW_NEGATIVE_REVIEW',
    description: 'Email ops team when rating < 3 stars received',
    lastRunAt: '2024-06-19T14:20:00Z',
    lastRunStatus: 'SUCCESS',
    runsLast7d: 3,
    actionsCount: 1,
  },
  {
    id: 'rule-005',
    name: 'Daily Channel Sync',
    status: 'ACTIVE',
    triggerType: 'DAILY_SCHEDULE',
    description: 'Sync all channels at midnight UTC',
    lastRunAt: '2024-06-20T00:00:00Z',
    lastRunStatus: 'SUCCESS',
    runsLast7d: 7,
    actionsCount: 1,
  },
  {
    id: 'rule-006',
    name: 'Channel Sync Failure Recovery',
    status: 'PAUSED',
    triggerType: 'CHANNEL_SYNC_FAILED',
    description: 'Retry sync and alert team on persistent failures',
    lastRunAt: '2024-06-18T16:30:00Z',
    lastRunStatus: 'FAILED',
    runsLast7d: 2,
    actionsCount: 2,
  },
  {
    id: 'rule-007',
    name: 'Order Status Change Notification',
    status: 'DRAFT',
    triggerType: 'ORDER_STATUS_CHANGED',
    description: 'Send email when order moves to "Shipped" status',
    runsLast7d: 0,
    actionsCount: 1,
  },
];

export const mockAutomationRuleDetails: Record<string, AutomationRuleDetail> = {
  'rule-001': {
    id: 'rule-001',
    name: 'Alert on Low Inventory',
    status: 'ACTIVE',
    triggerType: 'INVENTORY_BELOW_THRESHOLD',
    triggerConfig: { threshold: 7, unit: 'days_of_cover' },
    description: 'Send Slack notification when inventory drops below 7 days of cover',
    conditions: [
      {
        id: 'cond-001',
        field: 'inventory.daysOfCover',
        operator: 'LESS_THAN',
        value: '7',
      },
      {
        id: 'cond-002',
        field: 'product.isActive',
        operator: 'EQUALS',
        value: 'true',
      },
    ],
    actions: [
      {
        id: 'action-001',
        type: 'SEND_SLACK_WEBHOOK',
        label: 'Send Slack alert',
        config: {
          webhookUrl: 'https://hooks.slack.com/services/XXX/YYY/ZZZ',
          message: 'Low inventory alert: {{product.name}} has {{inventory.daysOfCover}} days of cover',
        },
      },
      {
        id: 'action-002',
        type: 'CREATE_REPLENISHMENT_TASK',
        label: 'Create replenishment task',
        config: {
          assignee: 'ops-team@company.com',
          priority: 'HIGH',
        },
      },
    ],
    createdAt: '2024-05-10T09:00:00Z',
    updatedAt: '2024-06-15T14:30:00Z',
  },
  'rule-002': {
    id: 'rule-002',
    name: 'Price Margin Guard',
    status: 'ACTIVE',
    triggerType: 'PRICE_BELOW_MIN_MARGIN',
    triggerConfig: { minMarginPercent: 20, channels: ['AMAZON'] },
    description: 'Adjust pricing when margin falls below 20% on Amazon',
    conditions: [
      {
        id: 'cond-003',
        field: 'pricing.marginPercent',
        operator: 'LESS_THAN',
        value: '20',
      },
      {
        id: 'cond-004',
        field: 'pricing.channelType',
        operator: 'IN',
        value: 'AMAZON',
      },
    ],
    actions: [
      {
        id: 'action-003',
        type: 'ADJUST_PRICE',
        label: 'Increase price by 5%',
        config: {
          channelType: 'AMAZON',
          percentageChange: 5,
          minMarginGuard: 20,
        },
      },
    ],
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-06-10T11:00:00Z',
  },
  'rule-003': {
    id: 'rule-003',
    name: 'High-Value Order Tagging',
    status: 'ACTIVE',
    triggerType: 'ORDER_CREATED',
    triggerConfig: { channels: ['ALL'] },
    description: 'Tag orders over $500 as "High Value" for priority fulfillment',
    conditions: [
      {
        id: 'cond-005',
        field: 'order.totalAmount',
        operator: 'GREATER_THAN',
        value: '500',
      },
    ],
    actions: [
      {
        id: 'action-004',
        type: 'TAG_ORDER',
        label: 'Tag as High Value',
        config: {
          tags: ['High Value', 'Priority Fulfillment'],
        },
      },
      {
        id: 'action-005',
        type: 'SEND_EMAIL',
        label: 'Notify fulfillment team',
        config: {
          recipient: 'fulfillment@company.com',
          subject: 'High-Value Order Received: {{order.orderId}}',
          body: 'Order {{order.orderId}} with total {{order.totalAmount}} requires priority handling.',
        },
      },
    ],
    createdAt: '2024-05-20T08:30:00Z',
    updatedAt: '2024-06-12T09:00:00Z',
  },
};

export const mockAutomationExecutions: AutomationExecution[] = [
  {
    id: 'exec-001',
    ruleId: 'rule-001',
    ruleName: 'Alert on Low Inventory',
    startedAt: '2024-06-20T08:30:00Z',
    finishedAt: '2024-06-20T08:30:05Z',
    status: 'SUCCESS',
    triggeredBy: 'SYSTEM',
    triggerPreview: 'SKU: WH-BT-2024-BLK, Days of cover: 5.2',
    actionsExecuted: 2,
  },
  {
    id: 'exec-002',
    ruleId: 'rule-002',
    ruleName: 'Price Margin Guard',
    startedAt: '2024-06-20T10:15:00Z',
    finishedAt: '2024-06-20T10:15:03Z',
    status: 'SUCCESS',
    triggeredBy: 'SYSTEM',
    triggerPreview: 'SKU: EARBUDS-PRO-WHT, Margin: 18.5%, Channel: Amazon US',
    actionsExecuted: 1,
  },
  {
    id: 'exec-003',
    ruleId: 'rule-003',
    ruleName: 'High-Value Order Tagging',
    startedAt: '2024-06-20T11:45:00Z',
    finishedAt: '2024-06-20T11:45:02Z',
    status: 'SUCCESS',
    triggeredBy: 'SYSTEM',
    triggerPreview: 'Order #ORD-20240620-789, Total: $645.99, Channel: Shopify',
    actionsExecuted: 2,
  },
  {
    id: 'exec-004',
    ruleId: 'rule-001',
    ruleName: 'Alert on Low Inventory',
    startedAt: '2024-06-19T16:20:00Z',
    finishedAt: '2024-06-19T16:20:08Z',
    status: 'PARTIAL',
    triggeredBy: 'SYSTEM',
    triggerPreview: 'SKU: CABLE-ORGANIZER-3PC, Days of cover: 4.1',
    actionsExecuted: 1,
    errorMessage: 'Slack webhook returned 500 error',
  },
  {
    id: 'exec-005',
    ruleId: 'rule-006',
    ruleName: 'Channel Sync Failure Recovery',
    startedAt: '2024-06-18T16:30:00Z',
    finishedAt: '2024-06-18T16:30:15Z',
    status: 'FAILED',
    triggeredBy: 'SYSTEM',
    triggerPreview: 'Channel: Amazon JP, Sync job ID: sync-20240618-456',
    actionsExecuted: 0,
    errorMessage: 'Max retry attempts exceeded, channel API unresponsive',
  },
  {
    id: 'exec-006',
    ruleId: 'rule-002',
    ruleName: 'Price Margin Guard',
    startedAt: '2024-06-20T14:00:00Z',
    finishedAt: '2024-06-20T14:00:02Z',
    status: 'SUCCESS',
    triggeredBy: 'MANUAL_TEST',
    triggerPreview: 'Test run by user@company.com',
    actionsExecuted: 1,
  },
];

export const mockAutomationTemplates: AutomationRuleSummary[] = [
  {
    id: 'template-001',
    name: 'Alert Slack when FBA stock drops below 7 days of cover',
    status: 'DRAFT',
    triggerType: 'INVENTORY_BELOW_THRESHOLD',
    description: 'Get instant Slack notifications when your Amazon FBA inventory falls below safe levels',
    runsLast7d: 0,
    actionsCount: 2,
    isSystemTemplate: true,
  },
  {
    id: 'template-002',
    name: 'Drop price 5% when Buy Box share falls below 20%',
    status: 'DRAFT',
    triggerType: 'PRICE_BELOW_MIN_MARGIN',
    description: 'Automatically adjust pricing to regain competitive position on Amazon',
    runsLast7d: 0,
    actionsCount: 1,
    isSystemTemplate: true,
  },
  {
    id: 'template-003',
    name: 'Email CX when 1-star review appears for top SKUs',
    status: 'DRAFT',
    triggerType: 'NEW_NEGATIVE_REVIEW',
    description: 'Immediately notify customer experience team about critical reviews',
    runsLast7d: 0,
    actionsCount: 2,
    isSystemTemplate: true,
  },
  {
    id: 'template-004',
    name: 'Run daily full channel sync at midnight',
    status: 'DRAFT',
    triggerType: 'DAILY_SCHEDULE',
    description: 'Keep all your sales channels synchronized with automated daily updates',
    runsLast7d: 0,
    actionsCount: 1,
    isSystemTemplate: true,
  },
  {
    id: 'template-005',
    name: 'Create replenishment task when stock days < 14',
    status: 'DRAFT',
    triggerType: 'INVENTORY_BELOW_THRESHOLD',
    description: 'Proactively generate purchase orders before running out of stock',
    runsLast7d: 0,
    actionsCount: 1,
    isSystemTemplate: true,
  },
  {
    id: 'template-006',
    name: 'Tag products with slow velocity for review',
    status: 'DRAFT',
    triggerType: 'WEEKLY_SCHEDULE',
    description: 'Weekly analysis to identify slow-moving inventory for clearance',
    runsLast7d: 0,
    actionsCount: 2,
    isSystemTemplate: true,
  },
  {
    id: 'template-007',
    name: 'Alert when Amazon JP orders spike above baseline',
    status: 'DRAFT',
    triggerType: 'ORDER_CREATED',
    description: 'Detect and notify when order velocity significantly increases',
    runsLast7d: 0,
    actionsCount: 2,
    isSystemTemplate: true,
  },
  {
    id: 'template-008',
    name: 'Lower prices when margin drops below 10%',
    status: 'DRAFT',
    triggerType: 'PRICE_BELOW_MIN_MARGIN',
    description: 'Protect margins by triggering price adjustments when profitability is at risk',
    runsLast7d: 0,
    actionsCount: 1,
    isSystemTemplate: true,
  },
  {
    id: 'template-009',
    name: 'Notify ops when FBA inventory for top SKUs is below 5 days',
    status: 'DRAFT',
    triggerType: 'INVENTORY_BELOW_THRESHOLD',
    description: 'Critical stock alerts for your best-selling products',
    runsLast7d: 0,
    actionsCount: 2,
    isSystemTemplate: true,
  },
];

export const mockAutomationKpis: AutomationKpiSnapshot = {
  activeWorkflows: 5,
  runsLast24h: 48,
  failuresLast24h: 1,
  pricingAutomations: 2,
  inventoryAutomations: 1,
};

export function getMockAutomationRules() {
  return { rules: mockAutomationRules, kpis: mockAutomationKpis };
}

export function getMockAutomationRuleDetail(ruleId: string): AutomationRuleDetail | null {
  return mockAutomationRuleDetails[ruleId] || null;
}

export function getMockAutomationExecutions(filter: { ruleId?: string; status?: string }) {
  let executions = mockAutomationExecutions;

  if (filter.ruleId) {
    executions = executions.filter((e) => e.ruleId === filter.ruleId);
  }

  if (filter.status && filter.status !== 'ALL') {
    executions = executions.filter((e) => e.status === filter.status);
  }

  return executions;
}

export function getMockAutomationTemplates() {
  return mockAutomationTemplates;
}
