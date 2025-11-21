'use client';

import { Package, TrendingUp } from 'lucide-react';
import { SkuLocationsTable } from '@/components/inventory/sku-locations-table';
import { SkuDemandChart } from '@/components/inventory/sku-demand-chart';
import { SkuAgingChart } from '@/components/inventory/sku-aging-chart';
import { SkuActivityTimeline } from '@/components/inventory/sku-activity-timeline';
import { AiInventoryCopilot } from '@/components/inventory/ai-inventory-copilot';
import type { InventorySkuDetail } from '@/lib/services/inventory-types';

export function SkuDetailContent({
  skuDetail,
  locale,
}: {
  skuDetail: InventorySkuDetail;
  locale: string;
}) {
  const { sku, locations, demand, aging, activity } = skuDetail;

  function getStatusBadge(status: string) {
    switch (status) {
      case 'HEALTHY':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-green-100 text-green-700 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Healthy
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full">
            <Package className="h-4 w-4" />
            Low Stock
          </span>
        );
      case 'OUT_OF_STOCK':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-red-100 text-red-700 rounded-full">
            <Package className="h-4 w-4" />
            Out of Stock
          </span>
        );
      case 'OVERSTOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-purple-100 text-purple-700 rounded-full">
            <Package className="h-4 w-4" />
            Overstocked
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Analytics & Insights */}
      <div className="lg:col-span-2 space-y-6">
        {/* Summary Card */}
        <div className="bg-surface rounded-card border border-gray-200 shadow-token-md p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {sku.mainImageUrl ? (
                <img
                  src={sku.mainImageUrl}
                  alt={sku.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-10 w-10 text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {sku.productName}
                  </h2>
                  <div className="text-sm text-gray-600 font-mono mt-1">
                    {sku.skuCode}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {getStatusBadge(sku.status)}
                    {sku.isTopSeller && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        <TrendingUp className="h-3 w-3" />
                        Top Seller
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">On Hand</div>
                  <div className="text-lg font-bold text-gray-900">
                    {sku.onHandTotal.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Reserved</div>
                  <div className="text-lg font-semibold text-gray-700">
                    {sku.reservedTotal.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Available</div>
                  <div className="text-lg font-bold text-blue-600">
                    {sku.availableTotal.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Inbound</div>
                  <div className="text-lg font-semibold text-green-600">
                    {sku.inboundTotal.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Locations Breakdown */}
        <SkuLocationsTable locations={locations} />

        {/* Demand & Aging Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkuDemandChart demand={demand} currentAvailable={sku.availableTotal} />
          <SkuAgingChart aging={aging} />
        </div>

        {/* Activity Timeline */}
        <SkuActivityTimeline activity={activity} />
      </div>

      {/* Right Column: AI & Operations */}
      <div className="space-y-6">
        <AiInventoryCopilot context="sku-detail" />

        {/* Quick Actions */}
        <div className="bg-surface rounded-card border border-gray-200 shadow-token-md p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Adjust Stock Level
            </button>
            <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Create Transfer Order
            </button>
            <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Generate Purchase Order
            </button>
            <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              View Sales History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
