import type {
  PricingSkuSummary,
  PricingDetail,
  RepricingRule,
  PricingExperiment,
  PricingFilter,
  PricingKpiSnapshot,
} from './pricing-types';
import {
  getMockPricingSnapshot,
  getMockPricingDetail,
  getMockRepricingRules,
  getMockPricingExperiments,
} from '../mocks/mock-pricing-data';

export class PricingService {
  static async getPricingSnapshot(
    orgId: string,
    filter?: PricingFilter
  ): Promise<{ skus: PricingSkuSummary[]; kpis: PricingKpiSnapshot }> {
    let { skus, kpis } = getMockPricingSnapshot();

    // Apply filters
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      skus = skus.filter(
        (sku) =>
          sku.skuCode.toLowerCase().includes(s) ||
          sku.productName.toLowerCase().includes(s)
      );
    }
    if (filter?.channelType && filter.channelType !== 'ALL') {
      skus = skus.filter((sku) => sku.channelType === filter.channelType);
    }
    if (filter?.strategyType && filter.strategyType !== 'ALL') {
      skus = skus.filter((sku) => sku.strategyType === filter.strategyType);
    }
    if (filter?.marginBucket) {
      if (filter.marginBucket === 'NEGATIVE') {
        skus = skus.filter((sku) => sku.marginPercent < 0);
      } else if (filter.marginBucket === 'LOW') {
        skus = skus.filter((sku) => sku.marginPercent >= 0 && sku.marginPercent < 20);
      } else if (filter.marginBucket === 'HEALTHY') {
        skus = skus.filter((sku) => sku.marginPercent >= 20 && sku.marginPercent < 40);
      } else if (filter.marginBucket === 'HIGH') {
        skus = skus.filter((sku) => sku.marginPercent >= 40);
      }
    }
    if (filter?.hasActiveExperiment !== undefined) {
      skus = skus.filter((sku) => sku.hasActiveExperiment === filter.hasActiveExperiment);
    }

    return { skus, kpis };
  }

  static async getPricingDetail(orgId: string, skuId: string): Promise<PricingDetail | null> {
    return getMockPricingDetail(skuId);
  }

  static async getRepricingRules(orgId: string): Promise<RepricingRule[]> {
    return getMockRepricingRules();
  }

  static async getPricingExperiments(orgId: string): Promise<PricingExperiment[]> {
    return getMockPricingExperiments();
  }

  static async applyRepricingSuggestion(
    orgId: string,
    skuId: string,
    newPrice: number
  ): Promise<{ success: boolean }> {
    // TODO: implement with DB
    console.log('Apply repricing suggestion', { orgId, skuId, newPrice });
    return { success: true };
  }
}
