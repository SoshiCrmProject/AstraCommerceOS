export type CopilotTool =
  | 'DASHBOARD_INSIGHTS'
  | 'PRICING_ADVISOR'
  | 'INVENTORY_PLANNER'
  | 'LISTING_OPTIMIZER'
  | 'ORDERS_RISK'
  | 'REVIEWS_ANALYZER'
  | 'AUTOMATION_DESIGNER'
  | 'GENERIC_QA';

export type CopilotMessageRole = 'user' | 'assistant' | 'system';

export type CopilotMessage = {
  id: string;
  role: CopilotMessageRole;
  content: string;
  createdAt: string;
  referencedEntities?: {
    type: 'SKU' | 'CHANNEL' | 'RULE' | 'ORDER' | 'LISTING';
    id: string;
    label: string;
  }[];
  suggestedFollowUps?: string[];
};

export type CopilotThreadSummary = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tool?: CopilotTool;
  pinned?: boolean;
  locale: string;
};

export type CopilotContextSummary = {
  hasDashboardSnapshot: boolean;
  hasPricingContext: boolean;
  hasInventoryContext: boolean;
  hasOrdersContext: boolean;
  hasListingsContext: boolean;
  hasReviewsContext: boolean;
  hasDatabaseAccess: boolean;
  hasAnalyticsAccess: boolean;
  hasInventoryAccess: boolean;
  hasPricingAccess: boolean;
  hasOrdersAccess: boolean;
  hasReviewsAccess: boolean;
};

export type CopilotResponse = {
  message: CopilotMessage;
  messages: CopilotMessage[];
  suggestedFollowUps?: string[];
};

export type CopilotThread = {
  thread: CopilotThreadSummary;
  messages: CopilotMessage[];
  context: CopilotContextSummary;
  tool?: CopilotTool;
};

export type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  category: 'pricing' | 'inventory' | 'listings' | 'orders' | 'reviews' | 'automation';
  prompt: string;
  template: string;
  variables?: string[];
  tool?: CopilotTool;
};

export type Playbook = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  tool: CopilotTool;
  initialPrompt: string;
};
