'use client';

import Link from 'next/link';
import { Package, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';
import type { InventorySkuSummary } from '@/lib/services/inventory-types';

export type InventoryTableProps = {
  skus: InventorySkuSummary[];
  locale: string;
};

function getStatusBadge(status: string) {
  switch (status) {
    case 'HEALTHY':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Healthy
        </span>
      );
    case 'LOW_STOCK':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
          <AlertTriangle className="h-3 w-3" />
          Low Stock
        </span>
      );
    case 'OUT_OF_STOCK':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
          <AlertTriangle className="h-3 w-3" />
          Out of Stock
        </span>
      );
    case 'OVERSTOCKED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
          <Package className="h-3 w-3" />
          Overstocked
        </span>
      );
    case 'BLOCKED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          Blocked
        </span>
      );
    default:
      return null;
  }
}

export function InventoryTable({ skus, locale }: InventoryTableProps) {
  if (skus.length === 0) {
    return (
      <div className="bg-surface rounded-card border border-gray-200 p-12 text-center shadow-token-sm">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No inventory items found</p>
        <p className="text-sm text-gray-400 mt-1">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-card border border-gray-200 shadow-token-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                On Hand
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Reserved
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Available
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Inbound
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Locations
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Avg Sales/Day
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {skus.map((sku) => (
              <tr
                key={sku.skuId}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/app/inventory/${sku.skuId}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
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
                    <div>
                      <div className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                        {sku.productName}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="font-mono">{sku.skuCode}</span>
                        {sku.isTopSeller && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                            <TrendingUp className="h-2.5 w-2.5" />
                            Top Seller
                          </span>
                        )}
                        {sku.isSlowMover && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                            Slow Mover
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3">{getStatusBadge(sku.status)}</td>
                <td className="px-4 py-3 text-center">
                  <span className="font-medium text-gray-900">
                    {sku.onHandTotal.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-gray-600">
                    {sku.reservedTotal.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-medium text-blue-600">
                    {sku.availableTotal.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {sku.inboundTotal > 0 ? (
                    <span className="text-green-600 font-medium">
                      {sku.inboundTotal.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span>{sku.locationIds.length} locations</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-gray-700">
                    {sku.avgDailySales30d || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
