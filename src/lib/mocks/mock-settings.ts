/**
 * Settings Mock Data
 */

import type {
  OrgProfile,
  UserProfile,
  TeamMember,
  BrandingSettings,
  IntegrationSettings,
  BillingSummary,
  NotificationSettings,
} from '../services/settings-types';

export const mockOrgProfile: OrgProfile = {
  id: 'org-001',
  name: 'Acme Commerce Co.',
  legalName: 'Acme Commerce Company LLC',
  defaultCurrency: 'USD',
  defaultTimezone: 'America/Los_Angeles',
  contactEmail: 'support@acmecommerce.com',
  websiteUrl: 'https://acmecommerce.com',
  locale: 'en',
};

export const mockUserProfile: UserProfile = {
  id: 'user-001',
  name: 'John Doe',
  email: 'john@acmecommerce.com',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
  locale: 'en',
  timezone: 'America/Los_Angeles',
  role: 'owner',
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-001',
    name: 'John Doe',
    email: 'john@acmecommerce.com',
    role: 'OWNER',
    status: 'ACTIVE',
    joinedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-002',
    name: 'Jane Smith',
    email: 'jane@acmecommerce.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    joinedAt: '2024-02-01T14:30:00Z',
  },
  {
    id: 'user-003',
    name: 'Mike Johnson',
    email: 'mike@acmecommerce.com',
    role: 'MEMBER',
    status: 'ACTIVE',
    joinedAt: '2024-03-10T09:15:00Z',
  },
  {
    id: 'user-004',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'VIEWER',
    status: 'INVITED',
  },
];

export const mockBrandingSettings: BrandingSettings = {
  logoUrl: '/branding/logo.svg',
  faviconUrl: '/branding/favicon.ico',
  primaryColor: '#3B82F6',
  accentColor: '#8B5CF6',
};

export const mockIntegrationSettings: IntegrationSettings = {
  amazonConnected: true,
  shopifyConnected: true,
  shopeeConnected: false,
  rakutenConnected: true,
  walmartConnected: false,
  ebayConnected: true,
  yahooShoppingConnected: false,
  mercariConnected: false,
  tiktokShopConnected: true,
  webhookUrl: 'https://api.acmecommerce.com/webhooks/astra',
};

export const mockBillingSummary: BillingSummary = {
  currentPlan: {
    id: 'plan-scale',
    name: 'Scale',
    pricePerMonth: 299,
    currency: 'USD',
    maxOrdersPerMonth: 10000,
    maxUsers: 10,
    features: [
      'Up to 10,000 orders/month',
      'Up to 10 team members',
      'All marketplace integrations',
      'Advanced automation',
      'Priority support',
      'Custom branding',
    ],
  },
  nextBillingDate: '2025-12-01T00:00:00Z',
  paymentMethod: {
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2027',
  },
  invoices: [
    {
      id: 'inv-2025-11',
      date: '2025-11-01T00:00:00Z',
      amount: 299,
      currency: 'USD',
      status: 'PAID',
      pdfUrl: '/invoices/inv-2025-11.pdf',
    },
    {
      id: 'inv-2025-10',
      date: '2025-10-01T00:00:00Z',
      amount: 299,
      currency: 'USD',
      status: 'PAID',
      pdfUrl: '/invoices/inv-2025-10.pdf',
    },
    {
      id: 'inv-2025-09',
      date: '2025-09-01T00:00:00Z',
      amount: 299,
      currency: 'USD',
      status: 'PAID',
      pdfUrl: '/invoices/inv-2025-09.pdf',
    },
  ],
};

export const mockNotificationSettings: NotificationSettings = {
  emailAlerts: true,
  slackAlerts: false,
  dailySummaryEmail: true,
  weeklySummaryEmail: true,
  alertOnAutomationFailure: true,
  alertOnConnectorFailure: true,
};
