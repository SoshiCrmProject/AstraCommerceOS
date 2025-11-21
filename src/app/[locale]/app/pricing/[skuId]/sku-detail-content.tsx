'use client';

import { useState, useEffect } from 'react';
import { PricingService } from '@/lib/services/pricing-service';
import { CompetitorTracker } from '@/components/pricing/competitor-tracker';
import { AiPricingAdvisor } from '@/components/pricing/ai-pricing-advisor';
import type { PricingDetail } from '@/lib/services/pricing-types';

type Props = { locale: string; skuId: string };

export function SkuDetailContent({ locale, skuId }: Props) {
  const [detail, setDetail] = useState<PricingDetail | null>(null);

  useEffect(() => {
    const loadDetail = async () => {
      const data = await PricingService.getPricingDetail('org-123', skuId);
      setDetail(data);
    };
    loadDetail();
  }, [skuId]);

  if (!detail) {
    return <div className="text-secondary">Loading SKU detail...</div>;
  }

  const { sku, channelPrices, competitors, priceHistory } = detail;

  const handleApplySuggestion = async (price: number) => {
    await PricingService.applyRepricingSuggestion('org-123', skuId, price);
    alert(`Applied new price: ${sku.currency} ${price.toFixed(2)}`);
  };

  return (
    <div className="space-y-6">
      {/* SKU Header */}
      <div className="bg-surface rounded-card border border-border-subtle p-6">
        <div className="flex items-start gap-4">
          {sku.mainImageUrl && (
            <img src={sku.mainImageUrl} alt="" className="w-24 h-24 rounded object-cover" />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-primary">{sku.productName}</h2>
            <div className="text-sm text-secondary mt-1">SKU: {sku.skuCode}</div>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <div className="text-xs text-secondary">Channel</div>
                <div className="text-sm text-primary font-medium">{sku.channelName}</div>
              </div>
              <div>
                <div className="text-xs text-secondary">Current Price</div>
                <div className="text-lg text-primary font-bold">
                  {sku.currency} {sku.currentPrice.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-secondary">Margin</div>
                <div
                  className={`text-lg font-bold ${
                    sku.marginPercent < 0
                      ? 'text-red-500'
                      : sku.marginPercent < 20
                        ? 'text-yellow-500'
                        : 'text-green-500'
                  }`}
                >
                  {sku.marginPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Competitor Tracker */}
        <CompetitorTracker
          competitors={competitors}
          currentPrice={sku.currentPrice}
          currency={sku.currency}
        />

        {/* AI Pricing Advisor */}
        <AiPricingAdvisor
          currentPrice={sku.currentPrice}
          costPrice={sku.costPrice}
          estimatedFees={sku.estimatedFees}
          currency={sku.currency}
          onApplySuggestion={handleApplySuggestion}
        />
      </div>

      {/* Multi-Channel Prices */}
      {channelPrices.length > 1 && (
        <div className="bg-surface rounded-card border border-border-subtle p-4">
          <h3 className="text-sm font-semibold text-primary mb-3">Multi-Channel Pricing</h3>
          <div className="space-y-2">
            {channelPrices.map((ch, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-bg-page rounded border border-border-subtle">
                <div>
                  <div className="text-sm text-primary font-medium">{ch.channelName}</div>
                  <div className="text-xs text-secondary">{ch.region}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-primary font-semibold">
                    {ch.currency} {ch.currentPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-secondary">Margin: {ch.marginPercent.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price History */}
      <div className="bg-surface rounded-card border border-border-subtle p-4">
        <h3 className="text-sm font-semibold text-primary mb-3">Price History</h3>
        <div className="space-y-2">
          {priceHistory.map((entry, idx) => (
            <div key={idx} className="flex items-start justify-between p-3 bg-bg-page rounded border border-border-subtle">
              <div>
                <div className="text-sm text-primary font-medium">
                  {entry.currency} {entry.price.toFixed(2)}
                </div>
                {entry.reason && <div className="text-xs text-secondary mt-1">{entry.reason}</div>}
              </div>
              <div className="text-xs text-secondary">
                {new Date(entry.at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
