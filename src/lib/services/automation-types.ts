export type AutomationStatus = 'ACTIVE' | 'PAUSED' | 'DRAFT';

export type AutomationTriggerType =
  | 'ORDER_CREATED'
  | 'ORDER_STATUS_CHANGED'
  | 'INVENTORY_BELOW_THRESHOLD'
  | 'PRICE_BELOW_MIN_MARGIN'
  | 'NEW_NEGATIVE_REVIEW'
  | 'CHANNEL_SYNC_FAILED'
  | 'DAILY_SCHEDULE'
  | 'WEEKLY_SCHEDULE';

export type AutomationActionType =
  | 'SEND_EMAIL'
  | 'SEND_SLACK_WEBHOOK'
  | 'ADJUST_PRICE'
  | 'CREATE_REPLENISHMENT_TASK'
  | 'TAG_ORDER'
  | 'TAG_PRODUCT'
  | 'CREATE_SUPPORT_TICKET'
  | 'RUN_CHANNEL_SYNC'
  | 'RUN_AI_SUMMARY';

export type AutomationConditionOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'CONTAINS'
  | 'NOT_CONTAINS'
  | 'IN'
  | 'NOT_IN';

export type AutomationRuleSummary = {
  id: string;
  name: string;
  status: AutomationStatus;
  triggerType: AutomationTriggerType;
  description?: string;
  lastRunAt?: string;
  lastRunStatus?: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  runsLast7d: number;
  actionsCount: number;
  isSystemTemplate?: boolean;
};

export type AutomationCondition = {
  id: string;
  field: string;
  operator: AutomationConditionOperator;
  value: string;
};

export type AutomationAction = {
  id: string;
  type: AutomationActionType;
  label?: string;
  config: Record<string, any>;
};

export type AutomationRuleDetail = {
  id: string;
  name: string;
  status: AutomationStatus;
  triggerType: AutomationTriggerType;
  triggerConfig: Record<string, any>;
  description?: string;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  createdAt: string;
  updatedAt: string;
};

export type AutomationExecutionStatus = 'SUCCESS' | 'FAILED' | 'PARTIAL' | 'RUNNING';

export type AutomationExecution = {
  id: string;
  ruleId: string;
  ruleName: string;
  startedAt: string;
  finishedAt?: string;
  status: AutomationExecutionStatus;
  triggeredBy: 'SYSTEM' | 'MANUAL_TEST';
  triggerPreview: string;
  actionsExecuted: number;
  errorMessage?: string;
};

export type AutomationFilter = {
  search?: string;
  status?: AutomationStatus | 'ALL';
  triggerType?: AutomationTriggerType | 'ALL';
};

export type AutomationKpiSnapshot = {
  activeWorkflows: number;
  runsLast24h: number;
  failuresLast24h: number;
  pricingAutomations: number;
  inventoryAutomations: number;
};
