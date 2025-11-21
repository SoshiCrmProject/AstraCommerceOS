'use client';

import Link from 'next/link';
import type { PricingSkuSummary } from '@/lib/services/pricing-types';

type Props = { skus: PricingSkuSummary[]; locale: string };

export function PricingTable({ skus, locale }: Props) {
  return (
    <div className="bg-surface rounded-card border border-border-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-page border-b border-border-subtle">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                SKU
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Product
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Channel
              </th>
              <th className="text-right p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Price
              </th>
              <th className="text-right p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Cost
              </th>
              <th className="text-right p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Margin
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Strategy
              </th>
              <th className="text-center p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {skus.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-secondary">
                  No SKUs found
                </td>
              </tr>
            )}
            {skus.map((sku) => {
              const marginColor =
                sku.marginPercent < 0
                  ? 'text-red-500'
                  : sku.marginPercent < 20
                    ? 'text-yellow-500'
                    : sku.marginPercent < 40
                      ? 'text-primary'
                      : 'text-green-500';

              return (
                <tr key={sku.skuId} className="hover:bg-bg-page transition-colors">
                  <td className="p-3">
                    <Link
                      href={`/${locale}/app/pricing/${sku.skuId}`}
                      className="text-accent font-medium hover:underline"
                    >
                      {sku.skuCode}
                    </Link>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {sku.mainImageUrl && (
                        <img
                          src={sku.mainImageUrl}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div className="text-primary">{sku.productName}</div>
                    </div>
                  </td>
                  <td className="p-3 text-secondary">
                    <div>{sku.channelName}</div>
                    <div className="text-xs">{sku.region}</div>
                  </td>
                  <td className="p-3 text-right text-primary font-medium">
                    {sku.currency} {sku.currentPrice.toFixed(2)}
                  </td>
                  <td className="p-3 text-right text-secondary">
                    {sku.currency} {sku.costPrice.toFixed(2)}
                  </td>
                  <td className={`p-3 text-right font-semibold ${marginColor}`}>
                    {sku.marginPercent.toFixed(1)}%
                  </td>
                  <td className="p-3">
                    <div className="text-primary text-xs">{sku.strategyType}</div>
                    {sku.ruleName && <div className="text-xs text-secondary">{sku.ruleName}</div>}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      {sku.hasActiveExperiment && (
                        <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-500 rounded-full">
                          Experiment
                        </span>
                      )}
                      {sku.buyBoxShare !== undefined && (
                        <span className="text-xs text-secondary">BB: {sku.buyBoxShare}%</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
