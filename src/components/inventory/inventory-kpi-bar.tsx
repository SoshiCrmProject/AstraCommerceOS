'use client';

import { TrendingUp, TrendingDown, AlertTriangle, Package } from 'lucide-react';

export type InventoryKpiBarProps = {
  totalSkus: number;
  totalOnHand: number;
  totalAvailable: number;
  lowStockSkus: number;
  outOfStockSkus: number;
  overstockedSkus: number;
};

export function InventoryKpiBar({
  totalSkus,
  totalOnHand,
  totalAvailable,
  lowStockSkus,
  outOfStockSkus,
  overstockedSkus,
}: InventoryKpiBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Total SKUs */}
      <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Total SKUs
          </span>
          <Package className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-2xl font-bold text-gray-900">{totalSkus}</div>
      </div>

      {/* On Hand */}
      <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            On Hand
          </span>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {totalOnHand.toLocaleString()}
        </div>
      </div>

      {/* Available */}
      <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Available
          </span>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {totalAvailable.toLocaleString()}
        </div>
      </div>

      {/* Low Stock */}
      <div className="bg-surface rounded-card border border-yellow-200 p-4 shadow-token-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-yellow-700 uppercase tracking-wide">
            Low Stock
          </span>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </div>
        <div className="text-2xl font-bold text-yellow-700">{lowStockSkus}</div>
        <div className="text-xs text-yellow-600 mt-1">Needs attention</div>
      </div>

      {/* Out of Stock */}
      <div className="bg-surface rounded-card border border-red-200 p-4 shadow-token-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-red-700 uppercase tracking-wide">
            Out of Stock
          </span>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </div>
        <div className="text-2xl font-bold text-red-700">{outOfStockSkus}</div>
        <div className="text-xs text-red-600 mt-1">Critical</div>
      </div>

      {/* Overstocked */}
      <div className="bg-surface rounded-card border border-purple-200 p-4 shadow-token-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">
            Overstocked
          </span>
          <Package className="h-4 w-4 text-purple-600" />
        </div>
        <div className="text-2xl font-bold text-purple-700">
          {overstockedSkus}
        </div>
        <div className="text-xs text-purple-600 mt-1">Review pricing</div>
      </div>
    </div>
  );
}
