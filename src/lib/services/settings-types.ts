/**
 * Settings Module - Type Definitions
 */

export type OrgProfile = {
  id: string;
  name: string;
  legalName?: string;
  defaultCurrency: string;
  defaultTimezone: string;
  contactEmail: string;
  websiteUrl?: string;
  locale: string; // 'en' | 'ja' etc.
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  locale: string;
  timezone: string;
  role: string; // 'owner', 'admin', 'member'
};

export type TeamMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
export type TeamMemberStatus = 'INVITED' | 'ACTIVE' | 'DISABLED';

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  joinedAt?: string;
};

export type BrandingSettings = {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  accentColor: string;
};

export type IntegrationSettings = {
  amazonConnected: boolean;
  shopifyConnected: boolean;
  shopeeConnected: boolean;
  rakutenConnected: boolean;
  walmartConnected: boolean;
  ebayConnected: boolean;
  yahooShoppingConnected: boolean;
  mercariConnected: boolean;
  tiktokShopConnected: boolean;
  webhookUrl?: string;
};

export type BillingPlan = {
  id: string;
  name: string;
  pricePerMonth: number;
  currency: string;
  maxOrdersPerMonth: number;
  maxUsers: number;
  features: string[];
};

export type InvoiceStatus = 'PAID' | 'PENDING' | 'FAILED';

export type Invoice = {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  pdfUrl?: string;
};

export type BillingSummary = {
  currentPlan: BillingPlan;
  nextBillingDate: string;
  paymentMethod: {
    last4: string;
    expiryMonth: string;
    expiryYear: string;
  };
  invoices: Invoice[];
};

export type NotificationSettings = {
  emailAlerts: boolean;
  slackAlerts: boolean;
  dailySummaryEmail: boolean;
  weeklySummaryEmail: boolean;
  alertOnAutomationFailure: boolean;
  alertOnConnectorFailure: boolean;
};
