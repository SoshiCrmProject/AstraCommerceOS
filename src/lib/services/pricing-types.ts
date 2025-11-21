export type PricingChannelType =
  | 'AMAZON'
  | 'SHOPIFY'
  | 'SHOPEE'
  | 'RAKUTEN'
  | 'EBAY'
  | 'WALMART'
  | 'YAHOO_SHOPPING'
  | 'MERCARI'
  | 'TIKTOK_SHOP';

export type PricingStrategyType =
  | 'FIXED_MARGIN'
  | 'COMPETITIVE'
  | 'PREMIUM'
  | 'CLEARANCE'
  | 'MANUAL_ONLY';

export type RepricingRuleStatus = 'ACTIVE' | 'PAUSED';

export type PricingSkuSummary = {
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  mainImageUrl?: string;
  channelType: PricingChannelType;
  channelName: string;
  region: string;
  currentPrice: number;
  currency: string;
  costPrice: number;
  estimatedFees: number;
  marginPercent: number;
  strategyType: PricingStrategyType;
  ruleName?: string;
  hasActiveExperiment: boolean;
  buyBoxShare?: number;
  lastPriceChangeAt?: string;
};

export type CompetitorPrice = {
  competitorName: string;
  price: number;
  currency: string;
  lastUpdatedAt: string;
  isBuyBoxWinner?: boolean;
};

export type PricingDetail = {
  sku: PricingSkuSummary;
  channelPrices: {
    channelType: PricingChannelType;
    channelName: string;
    region: string;
    currentPrice: number;
    currency: string;
    costPrice: number;
    estimatedFees: number;
    marginPercent: number;
    minPrice?: number;
    maxPrice?: number;
  }[];
  competitors: CompetitorPrice[];
  priceHistory: {
    at: string;
    price: number;
    currency: string;
    reason?: string;
  }[];
};

export type RepricingRule = {
  id: string;
  name: string;
  status: RepricingRuleStatus;
  strategyType: PricingStrategyType;
  appliesTo: 'ALL_SKUS' | 'BY_BRAND' | 'BY_CATEGORY' | 'BY_TAG' | 'BY_CUSTOM_SEGMENT';
  conditionsSummary: string;
  targetMarginPercent?: number;
  maxDiscountPercent?: number;
  minPriceFloorType?: 'COST_PLUS' | 'ABSOLUTE';
  createdAt: string;
  updatedAt: string;
};

export type PricingExperimentStatus = 'RUNNING' | 'PAUSED' | 'COMPLETED';

export type PricingExperiment = {
  id: string;
  name: string;
  status: PricingExperimentStatus;
  skuId: string;
  skuCode: string;
  productName: string;
  channelType: PricingChannelType;
  channelName: string;
  region: string;
  variantA: { price: number; conversionRate?: number; revenue?: number };
  variantB: { price: number; conversionRate?: number; revenue?: number };
  startedAt: string;
  endsAt?: string;
  winningVariant?: 'A' | 'B';
};

export type PricingFilter = {
  search?: string;
  channelType?: PricingChannelType | 'ALL';
  strategyType?: PricingStrategyType | 'ALL';
  marginBucket?: 'NEGATIVE' | 'LOW' | 'HEALTHY' | 'HIGH';
  hasActiveExperiment?: boolean;
};

export type PricingKpiSnapshot = {
  averageMargin: number;
  skusWithNegativeMargin: number;
  skusWithLowMargin: number;
  skusWithActiveRules: number;
  skusInExperiments: number;
};
