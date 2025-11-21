/**
 * Admin Service
 * 
 * Platform-level administration for tenant management, system health, and operations.
 */

import type {
  AdminOverviewSnapshot,
  TenantSummary,
} from './admin-types';

import { mockAdminOverview, mockTenants } from '../mocks/mock-admin';

export async function getAdminOverview(): Promise<AdminOverviewSnapshot> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockAdminOverview;
}

export async function getTenants(): Promise<TenantSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockTenants;
}

export async function getTenantById(orgId: string): Promise<TenantSummary | null> {
  await new Promise((resolve) => setTimeout(resolve, 30));
  return mockTenants.find((t) => t.orgId === orgId) || null;
}

const AdminService = {
  getAdminOverview,
  getTenants,
  getTenantById,
};

export default AdminService;
