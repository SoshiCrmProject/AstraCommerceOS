'use client';

import type { InventorySkuAgingBucket } from '@/lib/services/inventory-types';

export type SkuAgingChartProps = {
  aging: InventorySkuAgingBucket[];
};

export function SkuAgingChart({ aging }: SkuAgingChartProps) {
  if (aging.length === 0) {
    return (
      <div className="bg-surface rounded-card border border-gray-200 shadow-token-md p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Inventory Aging
        </h3>
        <div className="text-center py-8 text-gray-500 text-sm">
          No aging data available
        </div>
      </div>
    );
  }

  const getBarColor = (index: number) => {
    const colors = [
      'bg-green-500',
      'bg-yellow-500',
      'bg-orange-500',
      'bg-red-500',
    ];
    return colors[index] || 'bg-gray-500';
  };

  const getTextColor = (index: number) => {
    const colors = [
      'text-green-700',
      'text-yellow-700',
      'text-orange-700',
      'text-red-700',
    ];
    return colors[index] || 'text-gray-700';
  };

  return (
    <div className="bg-surface rounded-card border border-gray-200 shadow-token-md p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Inventory Aging Analysis
      </h3>

      <div className="space-y-4">
        {aging.map((bucket, index) => (
          <div key={bucket.bucketLabel}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-700">
                {bucket.bucketLabel}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {bucket.units.toLocaleString()}
                </span>
                <span className={`text-xs font-medium ${getTextColor(index)}`}>
                  {bucket.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getBarColor(
                  index
                )}`}
                style={{ width: `${bucket.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Insight */}
      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Fresh Inventory (0-30 days)</span>
          <span className="font-semibold text-green-700">
            {aging[0]?.percentage.toFixed(1)}%
          </span>
        </div>
        {aging.length > 3 && aging[3].units > 0 && (
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-gray-600">Aged Inventory (90+ days)</span>
            <span className="font-semibold text-red-700">
              {aging[3]?.units.toLocaleString()} units
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
