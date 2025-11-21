/**
 * Admin / Tenant Ops Module - Type Definitions
 */

export type TenantPlanTier = 'FREE' | 'GROWTH' | 'SCALE' | 'ENTERPRISE';

export type TenantSummary = {
  id: string;
  orgId: string;
  orgName: string;
  ownerEmail: string;
  createdAt: string;
  planTier: TenantPlanTier;
  status: 'active' | 'suspended' | 'trial';
  isActive: boolean;
  ordersThisMonth: number;
  monthlyOrderCount: number;
  monthlyRevenue: number;
  activeUsers: number;
  userCount: number;
};

export type SystemHealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';

export type SystemHealthMetric = {
  service: string;
  name: string;
  status: SystemHealthStatus;
  responseTime: number;
  uptime: number;
  description?: string;
  lastCheckedAt: string;
};

export type JobQueueSummary = {
  name: string;
  queueName: string;
  pending: number;
  active: number;
  processing: number;
  completed: number;
  failed: number;
  avgLatencyMs: number;
};

export type ApiUsageMetric = {
  endpoint: string;
  name: string;
  requests: number;
  callsLastHour: number;
  callsLast24h: number;
  avgLatency: number;
  p95Latency: number;
  errorRate: number;
  errorRatePercent24h: number;
};

export type AdminOverviewSnapshot = {
  totalTenants: number;
  tenantCount: number;
  activeTenants: number;
  activeTenantCount: number;
  totalMonthlyRevenue: number;
  systemUptime: number;
  totalOrderVolume: number;
  systemHealth: SystemHealthMetric[];
  jobQueues: JobQueueSummary[];
  apiUsage: ApiUsageMetric[];
};
