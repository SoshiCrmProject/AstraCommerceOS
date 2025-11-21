/**
 * Auto-Fulfillment & Amazon Auto-Purchase Types
 * Multi-marketplace automated order fulfillment system
 */

export type AutoFulfillmentStatus =
  | 'PENDING_EVAL'
  | 'ELIGIBLE'
  | 'SKIPPED_CONDITION'
  | 'QUEUED_FOR_PURCHASE'
  | 'PURCHASE_IN_PROGRESS'
  | 'PURCHASE_SUCCEEDED'
  | 'PURCHASE_FAILED';

export type AutoFulfillmentConditionReason =
  | 'NEGATIVE_PROFIT'
  | 'PROFIT_BELOW_THRESHOLD'
  | 'DELIVERY_TOO_SLOW'
  | 'AMAZON_OUT_OF_STOCK'
  | 'AMAZON_USED_ONLY'
  | 'AMAZON_LISTING_MISSING'
  | 'POINTS_EXCLUDED'
  | 'DOMESTIC_SHIPPING_NOT_INCLUDED'
  | 'SHOP_NOT_ELIGIBLE'
  | 'HEADLESS_ERROR'
  | 'CAPTCHA_REQUIRED'
  | 'TWO_FACTOR_REQUIRED'
  | 'UNKNOWN';

/**
 * Per-org configuration for auto-fulfillment rules
 */
export type AutoFulfillmentRuleConfig = {
  enabled: boolean;
  includeAmazonPoints: boolean;
  includeDomesticShippingFee: boolean;
  maxDeliveryDays: number;
  minExpectedProfit: number; // can be negative (e.g. -2000 for strategic loss)
  eligibleShopIds: string[]; // which connected shops can use auto-fulfillment
};

/**
 * A single order candidate for auto-fulfillment evaluation
 */
export type AutoFulfillmentCandidate = {
  id: string;
  orgId: string;
  
  // Downstream marketplace order (Shopee, Shopify, etc.)
  marketplaceOrderId: string;
  marketplace: string; // e.g. 'SHOPEE_JP', 'SHOPIFY', 'RAKUTEN_JP'
  shopId: string;
  shopName: string;
  
  // Product details
  skuId: string;
  skuCode: string;
  productName: string;
  quantity: number;
  orderTotal: number; // what customer paid
  requiredDeliveryDate?: string;
  
  // Upstream supply (Amazon)
  amazonAsin: string;
  amazonMarketplace: string; // e.g. 'AMAZON_JP', 'AMAZON_US'
  amazonPrice: number; // current price per unit
  amazonPoints: number; // Amazon points per unit
  amazonAvailable: boolean;
  amazonCondition: 'NEW' | 'USED' | 'REFURBISHED' | 'UNAVAILABLE';
  estimatedAmazonShipDays: number; // delivery estimate from Amazon
  
  // Cost factors
  domesticShippingFee: number; // shipping from Amazon warehouse to prep center
  marketplaceFees: number; // Shopee/marketplace commission
  
  // Evaluation results
  evaluatedAt?: string;
  expectedProfit: number; // computed profit after all costs
  status: AutoFulfillmentStatus;
  reasons: AutoFulfillmentConditionReason[];
  
  // Purchase tracking
  queuedAt?: string;
  purchaseAttemptedAt?: string;
  purchaseCompletedAt?: string;
  amazonOrderId?: string;
  errorMessage?: string;
};

/**
 * Summary statistics for auto-fulfillment dashboard
 */
export type AutoFulfillmentSummary = {
  totalCandidates: number;
  eligible: number;
  skipped: number;
  queued: number;
  succeeded: number;
  failed: number;
  totalExpectedProfit: number;
  averageProfit: number;
};

/**
 * Filter options for candidates table
 */
export type AutoFulfillmentFilter = {
  status?: AutoFulfillmentStatus[];
  marketplace?: string[];
  shopId?: string[];
  minProfit?: number;
  maxProfit?: number;
  onlyEligible?: boolean;
  onlyFailed?: boolean;
};

/**
 * CSV export row structure
 */
export type AutoFulfillmentCsvRow = {
  orderId: string;
  marketplace: string;
  shopName: string;
  productName: string;
  skuCode: string;
  quantity: number;
  orderTotal: number;
  amazonAsin: string;
  amazonMarketplace: string;
  amazonPrice: number;
  amazonPoints: number;
  domesticShipping: number;
  estimatedShipDays: number;
  expectedProfit: number;
  status: string;
  reasons: string;
  errorMessage?: string;
};
