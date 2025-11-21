'use client';

import type { TopSkuPerformance } from '@/lib/services/analytics-types';
import { ArrowUp, ArrowDown, Minus, ExternalLink } from 'lucide-react';
import Image from 'next/image';

type TopSkuTableProps = {
  skus: TopSkuPerformance[];
  dict: any;
  onViewProduct?: (productId: string) => void;
};

export function TopSkuTable({ skus, dict, onViewProduct }: TopSkuTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'UP':
        return <ArrowUp className="w-3.5 h-3.5 text-green-600" />;
      case 'DOWN':
        return <ArrowDown className="w-3.5 h-3.5 text-red-600" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.topSkus.product}
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.topSkus.channel}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.topSkus.revenue}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.topSkus.profit}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.topSkus.units}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.topSkus.margin}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.topSkus.returnRate}
            </th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.topSkus.trend}
            </th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {skus.map((sku, index) => (
            <tr
              key={sku.skuId}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {sku.mainImageUrl && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={sku.mainImageUrl}
                        alt={sku.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{sku.productName}</div>
                    <div className="text-xs text-gray-500">{sku.skuCode}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-gray-900">{sku.channelName}</div>
                <div className="text-xs text-gray-500">{sku.region}</div>
              </td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">
                {formatCurrency(sku.revenue)}
              </td>
              <td className="py-3 px-4 text-right font-medium text-green-600">
                {formatCurrency(sku.profit)}
              </td>
              <td className="py-3 px-4 text-right text-gray-700">
                {sku.units.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right text-gray-700">
                {formatPercent(sku.profitMarginPercent)}
              </td>
              <td className="py-3 px-4 text-right">
                {sku.returnRatePercent !== undefined ? (
                  <span className={sku.returnRatePercent > 5 ? 'text-red-600 font-medium' : 'text-gray-700'}>
                    {formatPercent(sku.returnRatePercent)}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center">
                  {getTrendIcon(sku.trendDirection)}
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onViewProduct?.(sku.productId)}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                  title={dict.buttons.viewProduct}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {skus.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>{dict.empty.noSkus}</p>
          <p className="text-sm mt-1">{dict.empty.tryAdjustingFilters}</p>
        </div>
      )}
    </div>
  );
}
