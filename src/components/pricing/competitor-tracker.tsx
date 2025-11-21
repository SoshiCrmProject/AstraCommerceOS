'use client';

import type { CompetitorPrice } from '@/lib/services/pricing-types';

type Props = { competitors: CompetitorPrice[]; currentPrice: number; currency: string };

export function CompetitorTracker({ competitors, currentPrice, currency }: Props) {
  return (
    <div className="bg-surface rounded-card border border-border-subtle p-4">
      <h3 className="text-sm font-semibold text-primary mb-3">Competitor Pricing</h3>
      <div className="space-y-2">
        {competitors.map((comp, idx) => {
          const priceDiff = comp.price - currentPrice;
          const diffColor = priceDiff > 0 ? 'text-green-500' : priceDiff < 0 ? 'text-red-500' : 'text-secondary';

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-bg-page rounded border border-border-subtle"
            >
              <div className="flex items-center gap-2">
                <div className="text-sm text-primary font-medium">{comp.competitorName}</div>
                {comp.isBuyBoxWinner && (
                  <span className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full">
                    BuyBox
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-primary font-semibold">
                  {currency} {comp.price.toFixed(2)}
                </div>
                <div className={`text-xs ${diffColor}`}>
                  {priceDiff > 0 ? '+' : ''}
                  {priceDiff.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
        {competitors.length === 0 && (
          <div className="text-sm text-secondary text-center py-2">No competitor data available</div>
        )}
      </div>
    </div>
  );
}
