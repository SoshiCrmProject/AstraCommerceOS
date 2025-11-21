/**
 * Settings Service
 * 
 * Manages organization, user, team, branding, integrations, billing, and notification settings.
 */

import type {
  OrgProfile,
  UserProfile,
  TeamMember,
  BrandingSettings,
  IntegrationSettings,
  BillingSummary,
  NotificationSettings,
} from './settings-types';

import {
  mockOrgProfile,
  mockUserProfile,
  mockTeamMembers,
  mockBrandingSettings,
  mockIntegrationSettings,
  mockBillingSummary,
  mockNotificationSettings,
} from '../mocks/mock-settings';

export async function getOrgProfile(orgId: string): Promise<OrgProfile> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockOrgProfile;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockUserProfile;
}

export async function getTeamMembers(orgId: string): Promise<TeamMember[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockTeamMembers;
}

export async function getBrandingSettings(orgId: string): Promise<BrandingSettings> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockBrandingSettings;
}

export async function getIntegrationSettings(orgId: string): Promise<IntegrationSettings> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockIntegrationSettings;
}

export async function getBillingSummary(orgId: string): Promise<BillingSummary> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockBillingSummary;
}

export async function getNotificationSettings(orgId: string): Promise<NotificationSettings> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockNotificationSettings;
}

const SettingsService = {
  getOrgProfile,
  getUserProfile,
  getTeamMembers,
  getBrandingSettings,
  getIntegrationSettings,
  getBillingSummary,
  getNotificationSettings,
};

export default SettingsService;
