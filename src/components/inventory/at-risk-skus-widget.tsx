'use client';

import Link from 'next/link';
import { AlertTriangle, TrendingDown, Package } from 'lucide-react';
import type { InventorySkuSummary } from '@/lib/services/inventory-types';

export type AtRiskSkusWidgetProps = {
  skus: InventorySkuSummary[];
  locale: string;
};

export function AtRiskSkusWidget({ skus, locale }: AtRiskSkusWidgetProps) {
  if (skus.length === 0) {
    return (
      <div className="bg-surface rounded-card border border-gray-200 shadow-token-md p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          At-Risk SKUs
        </h3>
        <div className="text-center py-8 text-gray-500 text-sm">
          No at-risk SKUs
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-card border border-gray-200 shadow-token-md">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          Top At-Risk SKUs
        </h3>
        <p className="text-xs text-gray-600 mt-0.5">
          Low stock or out of stock items requiring immediate attention
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {skus.map((sku) => (
          <Link
            key={sku.skuId}
            href={`/${locale}/app/inventory/${sku.skuId}`}
            className="block px-5 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {sku.mainImageUrl ? (
                  <img
                    src={sku.mainImageUrl}
                    alt={sku.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-5 w-5 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {sku.productName}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {sku.skuCode}
                    </div>
                  </div>

                  {sku.status === 'OUT_OF_STOCK' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full flex-shrink-0">
                      <TrendingDown className="h-3 w-3" />
                      Out of Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex-shrink-0">
                      <AlertTriangle className="h-3 w-3" />
                      Low Stock
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-gray-600">Available: </span>
                      <span
                        className={`font-semibold ${
                          sku.availableTotal === 0
                            ? 'text-red-600'
                            : 'text-yellow-700'
                        }`}
                      >
                        {sku.availableTotal}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Daily Sales: </span>
                      <span className="font-semibold text-gray-900">
                        {sku.avgDailySales30d || 0}
                      </span>
                    </div>
                  </div>

                  {sku.inboundTotal > 0 && (
                    <div className="text-green-600 font-medium">
                      +{sku.inboundTotal} inbound
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
        <Link
          href={`/${locale}/app/inventory/replenishment`}
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View all replenishment suggestions →
        </Link>
      </div>
    </div>
  );
}
