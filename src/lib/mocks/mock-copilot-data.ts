import type {
  CopilotThreadSummary,
  CopilotMessage,
  CopilotContextSummary,
  CopilotThread,
  PromptTemplate,
  Playbook,
} from '../services/ai-types';

// Mock threads
export const mockCopilotThreads: CopilotThreadSummary[] = [
  {
    id: 'thread-001',
    title: 'Pricing strategy for Q1 2026',
    createdAt: '2025-11-18T10:30:00Z',
    updatedAt: '2025-11-20T14:22:00Z',
    tool: 'PRICING_ADVISOR',
    pinned: true,
    locale: 'en',
  },
  {
    id: 'thread-002',
    title: 'Inventory planning for holiday season',
    createdAt: '2025-11-19T08:15:00Z',
    updatedAt: '2025-11-20T09:45:00Z',
    tool: 'INVENTORY_PLANNER',
    locale: 'en',
  },
  {
    id: 'thread-003',
    title: 'Optimize top 10 product listings',
    createdAt: '2025-11-17T16:00:00Z',
    updatedAt: '2025-11-19T11:30:00Z',
    tool: 'LISTING_OPTIMIZER',
    locale: 'en',
  },
  {
    id: 'thread-004',
    title: 'Review analysis for Amazon JP',
    createdAt: '2025-11-16T14:20:00Z',
    updatedAt: '2025-11-18T10:15:00Z',
    tool: 'REVIEWS_ANALYZER',
    locale: 'en',
  },
  {
    id: 'thread-005',
    title: 'General business questions',
    createdAt: '2025-11-15T09:00:00Z',
    updatedAt: '2025-11-17T15:45:00Z',
    tool: 'GENERIC_QA',
    locale: 'en',
  },
];

// Mock messages for threads
export const mockThreadMessages: Record<string, CopilotMessage[]> = {
  'thread-001': [
    {
      id: 'msg-001',
      role: 'user',
      content: 'What pricing changes should I consider for Q1 2026?',
      createdAt: '2025-11-18T10:30:00Z',
    },
    {
      id: 'msg-002',
      role: 'assistant',
      content: `Based on your current pricing data and market trends, here are my recommendations for Q1 2026:

**Key Opportunities:**
1. **Wireless Headphones (WH-BT-001)** - Currently priced 12% below market average. Recommend increasing by 8% to $89.99 while maintaining competitive position.

2. **USB-C Cables (USB-C-003)** - High velocity item with 15% margin. Consider small 3% increase to test price elasticity.

3. **Gaming Accessories** - Category showing strong demand. Recommend dynamic pricing strategy to capture peak periods.

**Risk Areas:**
- 3 SKUs currently have margins below 10%. These need immediate attention.
- Amazon Buy Box share has dropped to 18% for mechanical keyboards - pricing adjustment needed.

Would you like me to create a detailed pricing plan for any specific category?`,
      createdAt: '2025-11-18T10:30:15Z',
      referencedEntities: [
        { type: 'SKU', id: 'WH-BT-001', label: 'Wireless Headphones Pro' },
        { type: 'SKU', id: 'USB-C-003', label: 'USB-C Cable 6ft' },
      ],
    },
    {
      id: 'msg-003',
      role: 'user',
      content: 'Yes, create a plan for the wireless headphones',
      createdAt: '2025-11-20T14:20:00Z',
    },
    {
      id: 'msg-004',
      role: 'assistant',
      content: `Perfect! Here's a detailed pricing plan for Wireless Headphones Pro (WH-BT-001):

**Current State:**
- Current price: $79.99
- Cost: $45.00
- Current margin: 43.8%
- Competitor average: $89.50
- Your position: -10.6% below market

**Recommended Strategy:**
1. **Phase 1 (Week 1):** Increase to $84.99 (+6.3%)
   - Test customer response
   - Monitor Buy Box retention
   - Expected margin: 47.1%

2. **Phase 2 (Week 2-3):** If sales hold, move to $89.99 (+12.5%)
   - Matches premium positioning
   - Expected margin: 50.0%
   - Estimated revenue impact: +$2,100/month

**Safeguards:**
- Set minimum price floor at $82.99
- Auto-adjust if Buy Box share drops below 20%
- Monitor competitor pricing daily

**Implementation:**
I can create an automation rule to execute this plan. Would you like me to set that up?`,
      createdAt: '2025-11-20T14:22:00Z',
    },
  ],
  'thread-002': [
    {
      id: 'msg-005',
      role: 'user',
      content: 'Help me plan inventory for the holiday season',
      createdAt: '2025-11-19T08:15:00Z',
    },
    {
      id: 'msg-006',
      role: 'assistant',
      content: `I'll help you create a comprehensive holiday inventory plan. Let me analyze your data:

**High-Priority Restocking (Next 14 days):**
1. **Bluetooth Speakers** - 4.2 days of cover remaining
2. **Power Banks** - 5.8 days of cover
3. **Phone Cases** - 6.1 days of cover

**Holiday Surge Predictions:**
Based on last year's patterns:
- Gaming accessories: +215% demand increase (Dec 15-25)
- Audio products: +180% increase
- Cables & chargers: +95% increase

**Recommended Actions:**
1. Order 500 units of Bluetooth Speakers (WH-BT-001) - ETA needed by Dec 10
2. Increase safety stock for top 10 SKUs by 40%
3. Set up low-stock alerts for items with >100 units/day velocity

Would you like me to generate specific purchase orders?`,
      createdAt: '2025-11-19T08:15:20Z',
    },
  ],
};

// Mock context
export const mockContextSummary: CopilotContextSummary = {
  hasDashboardSnapshot: true,
  hasPricingContext: true,
  hasInventoryContext: true,
  hasOrdersContext: false,
  hasListingsContext: true,
  hasReviewsContext: false,
  hasDatabaseAccess: true,
  hasAnalyticsAccess: true,
  hasInventoryAccess: true,
  hasPricingAccess: true,
  hasOrdersAccess: true,
  hasReviewsAccess: true,
};

// Mock playbooks
export const mockPlaybooks: Playbook[] = [
  {
    id: 'playbook-001',
    title: 'Launch a new product on Amazon JP',
    description: 'Step-by-step guidance for launching products in the Japanese marketplace, including listing optimization, pricing strategy, and inventory planning.',
    tags: ['Amazon', 'Japan', 'Product Launch', 'Localization'],
    tool: 'LISTING_OPTIMIZER',
    initialPrompt: 'I want to launch a new product on Amazon Japan. Help me create an optimized listing and pricing strategy.',
  },
  {
    id: 'playbook-002',
    title: 'Audit pricing health across marketplaces',
    description: 'Comprehensive pricing analysis across all your sales channels to identify margin risks, competitive gaps, and opportunities.',
    tags: ['Pricing', 'Multi-channel', 'Analytics'],
    tool: 'PRICING_ADVISOR',
    initialPrompt: 'Run a comprehensive pricing health audit across all my marketplaces and identify risks and opportunities.',
  },
  {
    id: 'playbook-003',
    title: 'Clean up messy product catalog',
    description: 'Identify and fix duplicate listings, incomplete data, and categorization issues across your product catalog.',
    tags: ['Catalog', 'Data Quality', 'Operations'],
    tool: 'LISTING_OPTIMIZER',
    initialPrompt: 'Help me audit my product catalog for duplicates, incomplete data, and categorization issues.',
  },
  {
    id: 'playbook-004',
    title: 'Respond to negative review crisis',
    description: 'Analyze negative reviews, identify root causes, and create response templates to protect your brand reputation.',
    tags: ['Reviews', 'Customer Service', 'Crisis Management'],
    tool: 'REVIEWS_ANALYZER',
    initialPrompt: 'I have several negative reviews for my top product. Help me analyze the issues and create response templates.',
  },
  {
    id: 'playbook-005',
    title: 'Build automated repricing workflow',
    description: 'Design and implement intelligent repricing rules that respond to competitor changes while protecting your margins.',
    tags: ['Automation', 'Pricing', 'Workflows'],
    tool: 'AUTOMATION_DESIGNER',
    initialPrompt: 'Help me design an automated repricing workflow that responds to competitor changes while maintaining minimum margins.',
  },
  {
    id: 'playbook-006',
    title: 'Prepare for peak season inventory',
    description: 'Forecast demand, optimize stock levels, and create replenishment plans for holiday shopping season.',
    tags: ['Inventory', 'Forecasting', 'Seasonal'],
    tool: 'INVENTORY_PLANNER',
    initialPrompt: 'Help me prepare inventory for the upcoming holiday season with demand forecasting and replenishment planning.',
  },
];

// Mock prompt templates
export const mockPromptTemplates: PromptTemplate[] = [
  {
    id: 'prompt-001',
    title: 'Find negative margin SKUs',
    description: 'Identify products currently selling below cost',
    category: 'pricing',
    prompt: 'Show me all SKUs with negative margins and recommend corrective pricing actions.',
    template: 'Show me all SKUs with negative margins and recommend corrective pricing actions.',
    tool: 'PRICING_ADVISOR',
  },
  {
    id: 'prompt-002',
    title: 'Suggest price increases',
    description: 'Find opportunities for profitable price increases',
    category: 'pricing',
    prompt: 'Analyze my pricing data and suggest which products can support price increases without losing competitive position.',
    template: 'Analyze my pricing data and suggest which products can support price increases without losing competitive position.',
    tool: 'PRICING_ADVISOR',
  },
  {
    id: 'prompt-003',
    title: 'Stock-out risk analysis',
    description: 'Identify SKUs at risk of running out of stock',
    category: 'inventory',
    prompt: 'Show me all SKUs at risk of stock-out in the next {days} days and generate replenishment recommendations.',
    template: 'Show me all SKUs at risk of stock-out in the next {days} days and generate replenishment recommendations.',
    variables: ['days'],
    tool: 'INVENTORY_PLANNER',
  },
  {
    id: 'prompt-004',
    title: 'Overstock identification',
    description: 'Find slow-moving inventory',
    category: 'inventory',
    prompt: 'Identify overstocked items with low velocity and suggest clearance strategies.',
    template: 'Identify overstocked items with low velocity and suggest clearance strategies.',
    tool: 'INVENTORY_PLANNER',
  },
  {
    id: 'prompt-005',
    title: 'Optimize listing title',
    description: 'Improve product title for better conversion',
    category: 'listings',
    prompt: 'Analyze this product listing title and suggest optimizations for better search visibility and conversion: {title}',
    template: 'Analyze this product listing title and suggest optimizations for better search visibility and conversion: {title}',
    variables: ['title'],
    tool: 'LISTING_OPTIMIZER',
  },
  {
    id: 'prompt-006',
    title: 'Generate bullet points',
    description: 'Create compelling product bullet points',
    category: 'listings',
    prompt: 'Generate 5 compelling bullet points for {product_name} that highlight key features and benefits.',
    template: 'Generate 5 compelling bullet points for {product_name} that highlight key features and benefits.',
    variables: ['product_name'],
    tool: 'LISTING_OPTIMIZER',
  },
  {
    id: 'prompt-007',
    title: 'Localize to Japanese',
    description: 'Adapt listing for Japanese marketplace',
    category: 'listings',
    prompt: 'Localize this product listing for Amazon Japan with culturally appropriate tone and keywords: {listing}',
    template: 'Localize this product listing for Amazon Japan with culturally appropriate tone and keywords: {listing}',
    variables: ['listing'],
    tool: 'LISTING_OPTIMIZER',
  },
  {
    id: 'prompt-008',
    title: 'SLA risk orders',
    description: 'Identify orders at risk of missing deadlines',
    category: 'orders',
    prompt: 'Show me all orders at risk of missing SLA deadlines today and suggest prioritization.',
    template: 'Show me all orders at risk of missing SLA deadlines today and suggest prioritization.',
    tool: 'ORDERS_RISK',
  },
  {
    id: 'prompt-009',
    title: 'Summarize negative reviews',
    description: 'Analyze recent negative feedback',
    category: 'reviews',
    prompt: 'Summarize all negative reviews from the last {days} days and identify common themes.',
    template: 'Summarize all negative reviews from the last {days} days and identify common themes.',
    variables: ['days'],
    tool: 'REVIEWS_ANALYZER',
  },
  {
    id: 'prompt-010',
    title: 'Draft apology template',
    description: 'Create customer apology message',
    category: 'reviews',
    prompt: 'Draft a professional apology message template for negative reviews about {issue}.',
    template: 'Draft a professional apology message template for negative reviews about {issue}.',
    variables: ['issue'],
    tool: 'REVIEWS_ANALYZER',
  },
  {
    id: 'prompt-011',
    title: 'Auto-adjust pricing workflow',
    description: 'Design automated repricing rule',
    category: 'automation',
    prompt: 'Help me design a workflow that automatically adjusts prices when competitors change theirs, with margin guardrails.',
    template: 'Help me design a workflow that automatically adjusts prices when competitors change theirs, with margin guardrails.',
    tool: 'AUTOMATION_DESIGNER',
  },
  {
    id: 'prompt-012',
    title: 'Low inventory alert',
    description: 'Create stock alert automation',
    category: 'automation',
    prompt: 'Create an automation that sends me a {notification_type} alert when any top SKU falls below {threshold} days of inventory cover.',
    template: 'Create an automation that sends me a {notification_type} alert when any top SKU falls below {threshold} days of inventory cover.',
    variables: ['notification_type', 'threshold'],
    tool: 'AUTOMATION_DESIGNER',
  },
];

export function getMockCopilotThreads(userId: string): CopilotThreadSummary[] {
  return mockCopilotThreads;
}

export function getMockCopilotThread(threadId: string): CopilotThread | null {
  const thread = mockCopilotThreads.find(t => t.id === threadId);
  if (!thread) return null;

  return {
    thread,
    messages: mockThreadMessages[threadId] || [],
    context: mockContextSummary,
  };
}

export function getMockPlaybooks(): Playbook[] {
  return mockPlaybooks;
}

export function getMockPromptTemplates(): PromptTemplate[] {
  return mockPromptTemplates;
}
