/**
 * Logs & Observability - Type Definitions
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export type LogSource =
  | 'BACKEND'
  | 'FRONTEND'
  | 'CONNECTOR'
  | 'AUTOMATION'
  | 'JOB_QUEUE'
  | 'AUTH'
  | 'BILLING';

export type LogEntityType =
  | 'ORDER'
  | 'PRODUCT'
  | 'SKU'
  | 'CHANNEL'
  | 'AUTOMATION_RULE'
  | 'JOB'
  | 'USER'
  | 'ORG'
  | 'NONE';

export type LogEntry = {
  id: string;
  timestamp: string; // ISO
  level: LogLevel;
  source: LogSource;
  message: string;
  context: string; // short, human-readable context snippet
  entityType: LogEntityType;
  entityId?: string;
  entityLabel?: string;
  orgId: string;
  requestId?: string;
  correlationId?: string;
  metadata?: Record<string, any>;
};

export type LogStatsSnapshot = {
  timeRangeLabel: string;
  totalLogs: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  uniqueRequestIds: number;
  uniqueCorrelationIds: number;
};

export type LogTimeBucket = {
  timestamp: string;
  count: number;
  errorCount: number;
  warnCount: number;
};

export type LogOverviewSnapshot = {
  stats: LogStatsSnapshot;
  timeSeries: LogTimeBucket[];
};

export type LogFilter = {
  search?: string;
  level?: LogLevel | 'ALL';
  source?: LogSource | 'ALL';
  entityType?: LogEntityType | 'ALL';
  dateFrom?: string;
  dateTo?: string;
  hasRequestId?: boolean;
  hasCorrelationId?: boolean;
};

export type LogPagination = {
  page: number;
  pageSize: number;
};
