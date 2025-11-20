export type ListingChannelType =
  | 'AMAZON'
  | 'SHOPIFY'
  | 'SHOPEE'
  | 'RAKUTEN'
  | 'EBAY'
  | 'WALMART'
  | 'YAHOO_SHOPPING'
  | 'MERCARI'
  | 'TIKTOK_SHOP';

export type ListingStatus =
  | 'ACTIVE'
  | 'PAUSED'
  | 'OUT_OF_STOCK'
  | 'PENDING'
  | 'ERROR'
  | 'ARCHIVED';

export type ListingComplianceFlag =
  | 'TITLE_TOO_LONG'
  | 'MISSING_ATTRIBUTES'
  | 'PROHIBITED_KEYWORD'
  | 'CATEGORY_MISMATCH'
  | 'IMAGE_QUALITY'
  | 'DUPLICATE_LISTING';

export type ListingSummary = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  mainImageUrl?: string;
  channelType: ListingChannelType;
  channelName: string;
  region: string;
  status: ListingStatus;
  price: number;
  currency: string;
  stock: number;
  orders30d: number;
  lastUpdatedAt: string;
  hasErrors: boolean;
  complianceFlags: ListingComplianceFlag[];
};

export type ListingErrorDetail = {
  id: string;
  code: string;
  message: string;
  category: 'CATEGORY' | 'BRAND' | 'CONTENT' | 'POLICY' | 'DUPLICATE' | 'TECHNICAL';
  severity: 'INFO' | 'WARNING' | 'ERROR';
  occurredAt: string;
  resolved: boolean;
};

export type ListingContent = {
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  description: string;
  keywords: string[];
  attributes: { name: string; value: string }[];
};

export type ListingDetail = {
  summary: ListingSummary;
  content: ListingContent;
  images: { url: string; alt: string }[];
  variations: {
    sku: string;
    attributes: Record<string, string>;
    price: number;
    stock: number;
  }[];
  errors: ListingErrorDetail[];
  history: {
    id: string;
    changedAt: string;
    changedBy?: string;
    changeSummary: string;
  }[];
};

export type ListingFilter = {
  search?: string;
  channelType?: ListingChannelType | 'ALL';
  status?: ListingStatus | 'ALL';
  region?: string;
  hasErrors?: boolean;
  lowStockOnly?: boolean;
};

export type AiListingGeneration = {
  title: string;
  bulletPoints: string[];
  description: string;
  keywords: string[];
};