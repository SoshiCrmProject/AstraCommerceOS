/**
 * Log Service
 * 
 * Single source of truth for system logs and observability data.
 */

import type {
  LogOverviewSnapshot,
  LogFilter,
  LogEntry,
  LogPagination,
} from './log-types';

import { mockLogEntries, mockLogOverview, generateLogTimeSeries } from '../mocks/mock-logs';

/**
 * Get log overview with stats and time series
 */
export async function getLogOverview(
  orgId: string,
  filter: LogFilter = {}
): Promise<LogOverviewSnapshot> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const hours = filter.dateFrom && filter.dateTo
    ? Math.floor((new Date(filter.dateTo).getTime() - new Date(filter.dateFrom).getTime()) / (1000 * 60 * 60))
    : 24;

  return {
    ...mockLogOverview,
    timeSeries: generateLogTimeSeries(hours),
  };
}

/**
 * Get filtered and paginated log entries
 */
export async function getLogs(
  orgId: string,
  filter: LogFilter = {},
  pagination: LogPagination = { page: 1, pageSize: 25 }
): Promise<{ items: LogEntry[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  let filtered = [...mockLogEntries];

  // Apply filters
  if (filter.level && filter.level !== 'ALL') {
    filtered = filtered.filter((log) => log.level === filter.level);
  }

  if (filter.source && filter.source !== 'ALL') {
    filtered = filtered.filter((log) => log.source === filter.source);
  }

  if (filter.entityType && filter.entityType !== 'ALL') {
    filtered = filtered.filter((log) => log.entityType === filter.entityType);
  }

  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(
      (log) =>
        log.message.toLowerCase().includes(searchLower) ||
        log.context.toLowerCase().includes(searchLower) ||
        log.entityLabel?.toLowerCase().includes(searchLower)
    );
  }

  if (filter.hasRequestId) {
    filtered = filtered.filter((log) => !!log.requestId);
  }

  if (filter.hasCorrelationId) {
    filtered = filtered.filter((log) => !!log.correlationId);
  }

  // Sort by timestamp descending
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Paginate
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  const items = filtered.slice(start, end);

  return {
    items,
    total: filtered.length,
  };
}

/**
 * Get single log entry by ID
 */
export async function getLogById(
  orgId: string,
  logId: string
): Promise<LogEntry | null> {
  await new Promise((resolve) => setTimeout(resolve, 30));

  return mockLogEntries.find((log) => log.id === logId) || null;
}

const LogService = {
  getLogOverview,
  getLogs,
  getLogById,
};

export default LogService;
