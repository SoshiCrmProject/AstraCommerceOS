/**
 * Auto-Fulfillment Service
 * Handles order evaluation, profit calculation, and purchase queue management
 */

import type {
  AutoFulfillmentRuleConfig,
  AutoFulfillmentCandidate,
  AutoFulfillmentSummary,
  AutoFulfillmentFilter,
  AutoFulfillmentCsvRow,
  AutoFulfillmentStatus,
  AutoFulfillmentConditionReason,
} from './auto-fulfillment-types';
import { mockAutoFulfillmentConfig, mockAutoFulfillmentCandidates } from '@/lib/mocks/mock-auto-fulfillment';

/**
 * Get auto-fulfillment configuration for an organization
 */
export async function getAutoFulfillmentConfig(
  orgId: string
): Promise<AutoFulfillmentRuleConfig> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockAutoFulfillmentConfig;
}

/**
 * Update auto-fulfillment configuration
 */
export async function updateAutoFulfillmentConfig(
  orgId: string,
  config: AutoFulfillmentRuleConfig
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  // In production: persist to database
  console.log('Auto-fulfillment config updated for org:', orgId, config);
}

/**
 * Fetch auto-fulfillment candidates from marketplace orders
 * In production: queries synced orders, maps to Amazon ASINs, fetches current pricing
 */
export async function fetchAutoFulfillmentCandidates(
  orgId: string,
  filter?: AutoFulfillmentFilter
): Promise<AutoFulfillmentCandidate[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let candidates = mockAutoFulfillmentCandidates;
  
  // Apply filters
  if (filter) {
    if (filter.status && filter.status.length > 0) {
      candidates = candidates.filter(c => filter.status!.includes(c.status));
    }
    if (filter.marketplace && filter.marketplace.length > 0) {
      candidates = candidates.filter(c => filter.marketplace!.includes(c.marketplace));
    }
    if (filter.shopId && filter.shopId.length > 0) {
      candidates = candidates.filter(c => filter.shopId!.includes(c.shopId));
    }
    if (filter.minProfit !== undefined) {
      candidates = candidates.filter(c => c.expectedProfit >= filter.minProfit!);
    }
    if (filter.maxProfit !== undefined) {
      candidates = candidates.filter(c => c.expectedProfit <= filter.maxProfit!);
    }
    if (filter.onlyEligible) {
      candidates = candidates.filter(c => c.status === 'ELIGIBLE');
    }
    if (filter.onlyFailed) {
      candidates = candidates.filter(c => c.status === 'PURCHASE_FAILED');
    }
  }
  
  return candidates;
}

/**
 * Evaluate candidates against auto-fulfillment rules
 * Computes profit, checks delivery constraints, updates status
 */
export async function evaluateCandidates(
  orgId: string,
  config: AutoFulfillmentRuleConfig,
  candidates: AutoFulfillmentCandidate[]
): Promise<AutoFulfillmentCandidate[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const evaluated = candidates.map(candidate => {
    const reasons: AutoFulfillmentConditionReason[] = [];
    let status: AutoFulfillmentStatus = 'PENDING_EVAL';
    
    // Check if shop is eligible
    if (!config.eligibleShopIds.includes(candidate.shopId)) {
      reasons.push('SHOP_NOT_ELIGIBLE');
      status = 'SKIPPED_CONDITION';
    }
    
    // Check Amazon availability
    if (!candidate.amazonAvailable) {
      reasons.push('AMAZON_OUT_OF_STOCK');
      status = 'SKIPPED_CONDITION';
    }
    
    if (candidate.amazonCondition === 'USED' || candidate.amazonCondition === 'REFURBISHED') {
      reasons.push('AMAZON_USED_ONLY');
      status = 'SKIPPED_CONDITION';
    }
    
    if (candidate.amazonCondition === 'UNAVAILABLE') {
      reasons.push('AMAZON_LISTING_MISSING');
      status = 'SKIPPED_CONDITION';
    }
    
    // Calculate profit
    let profit = candidate.orderTotal - (candidate.amazonPrice * candidate.quantity) - candidate.marketplaceFees;
    
    if (config.includeAmazonPoints) {
      profit += candidate.amazonPoints * candidate.quantity;
    } else if (candidate.amazonPoints > 0) {
      reasons.push('POINTS_EXCLUDED');
    }
    
    if (config.includeDomesticShippingFee) {
      profit -= candidate.domesticShippingFee;
    } else if (candidate.domesticShippingFee > 0) {
      reasons.push('DOMESTIC_SHIPPING_NOT_INCLUDED');
    }
    
    candidate.expectedProfit = profit;
    
    // Check profit threshold
    if (profit < 0) {
      reasons.push('NEGATIVE_PROFIT');
      status = 'SKIPPED_CONDITION';
    } else if (profit < config.minExpectedProfit) {
      reasons.push('PROFIT_BELOW_THRESHOLD');
      status = 'SKIPPED_CONDITION';
    }
    
    // Check delivery constraint
    if (candidate.estimatedAmazonShipDays > config.maxDeliveryDays) {
      reasons.push('DELIVERY_TOO_SLOW');
      status = 'SKIPPED_CONDITION';
    }
    
    // If no blocking reasons, mark as eligible
    if (status === 'PENDING_EVAL') {
      status = 'ELIGIBLE';
    }
    
    return {
      ...candidate,
      expectedProfit: profit,
      status,
      reasons,
      evaluatedAt: new Date().toISOString(),
    };
  });
  
  return evaluated;
}

/**
 * Queue eligible candidates for headless Amazon purchase
 * In production: pushes to job queue (BullMQ, etc.)
 */
export async function queueEligiblePurchases(
  orgId: string,
  candidates: AutoFulfillmentCandidate[]
): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const eligible = candidates.filter(c => c.status === 'ELIGIBLE');
  
  // In production: push to job queue
  for (const candidate of eligible) {
    console.log('Queuing purchase for order:', candidate.marketplaceOrderId, 'ASIN:', candidate.amazonAsin);
    // await jobQueue.add('amazon-purchase', { candidateId: candidate.id });
  }
  
  return eligible.length;
}

/**
 * Get summary statistics for auto-fulfillment dashboard
 */
export async function getAutoFulfillmentSummary(
  orgId: string
): Promise<AutoFulfillmentSummary> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const candidates = mockAutoFulfillmentCandidates;
  
  const summary: AutoFulfillmentSummary = {
    totalCandidates: candidates.length,
    eligible: candidates.filter(c => c.status === 'ELIGIBLE').length,
    skipped: candidates.filter(c => c.status === 'SKIPPED_CONDITION').length,
    queued: candidates.filter(c => c.status === 'QUEUED_FOR_PURCHASE' || c.status === 'PURCHASE_IN_PROGRESS').length,
    succeeded: candidates.filter(c => c.status === 'PURCHASE_SUCCEEDED').length,
    failed: candidates.filter(c => c.status === 'PURCHASE_FAILED').length,
    totalExpectedProfit: candidates.reduce((sum, c) => sum + c.expectedProfit, 0),
    averageProfit: candidates.length > 0 
      ? candidates.reduce((sum, c) => sum + c.expectedProfit, 0) / candidates.length 
      : 0,
  };
  
  return summary;
}

/**
 * Export non-fulfilled orders to CSV
 */
export async function exportNonFulfilledToCsv(
  orgId: string,
  candidates: AutoFulfillmentCandidate[]
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const nonFulfilled = candidates.filter(
    c => c.status === 'SKIPPED_CONDITION' || c.status === 'PURCHASE_FAILED'
  );
  
  const rows: AutoFulfillmentCsvRow[] = nonFulfilled.map(c => ({
    orderId: c.marketplaceOrderId,
    marketplace: c.marketplace,
    shopName: c.shopName,
    productName: c.productName,
    skuCode: c.skuCode,
    quantity: c.quantity,
    orderTotal: c.orderTotal,
    amazonAsin: c.amazonAsin,
    amazonMarketplace: c.amazonMarketplace,
    amazonPrice: c.amazonPrice,
    amazonPoints: c.amazonPoints,
    domesticShipping: c.domesticShippingFee,
    estimatedShipDays: c.estimatedAmazonShipDays,
    expectedProfit: c.expectedProfit,
    status: c.status,
    reasons: c.reasons.join(', '),
    errorMessage: c.errorMessage,
  }));
  
  // Generate CSV
  const headers = [
    'Order ID',
    'Marketplace',
    'Shop',
    'Product',
    'SKU',
    'Qty',
    'Order Total',
    'Amazon ASIN',
    'Amazon Marketplace',
    'Amazon Price',
    'Amazon Points',
    'Domestic Shipping',
    'Ship Days',
    'Expected Profit',
    'Status',
    'Reasons',
    'Error Message',
  ];
  
  const csvLines = [
    headers.join(','),
    ...rows.map(row => [
      row.orderId,
      row.marketplace,
      `"${row.shopName}"`,
      `"${row.productName}"`,
      row.skuCode,
      row.quantity,
      row.orderTotal,
      row.amazonAsin,
      row.amazonMarketplace,
      row.amazonPrice,
      row.amazonPoints,
      row.domesticShipping,
      row.estimatedShipDays,
      row.expectedProfit,
      row.status,
      `"${row.reasons}"`,
      row.errorMessage ? `"${row.errorMessage}"` : '',
    ].join(',')),
  ];
  
  return csvLines.join('\n');
}

const AutoFulfillmentService = {
  getAutoFulfillmentConfig,
  updateAutoFulfillmentConfig,
  fetchAutoFulfillmentCandidates,
  evaluateCandidates,
  queueEligiblePurchases,
  getAutoFulfillmentSummary,
  exportNonFulfilledToCsv,
};

export default AutoFulfillmentService;
