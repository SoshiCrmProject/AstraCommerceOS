'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, Package, TrendingUp } from 'lucide-react';
import type { ReplenishmentSuggestion } from '@/lib/services/inventory-types';

export type ReplenishmentTableProps = {
  suggestions: ReplenishmentSuggestion[];
  locale: string;
};

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
          <AlertTriangle className="h-3 w-3" />
          High Priority
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
          Medium Priority
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
          Low Priority
        </span>
      );
    default:
      return null;
  }
}

export function ReplenishmentTable({
  suggestions,
  locale,
}: ReplenishmentTableProps) {
  if (suggestions.length === 0) {
    return (
      <div className="bg-surface rounded-card border border-gray-200 p-12 text-center shadow-token-sm">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">
          No replenishment suggestions
        </p>
        <p className="text-sm text-gray-400 mt-1">
          All SKUs are well-stocked
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
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Current Available
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Daily Sales
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Target Days
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Recommended Qty
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Transfer Route
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {suggestions.map((suggestion) => (
              <tr
                key={suggestion.skuId}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  {getPriorityBadge(suggestion.priority)}
                </td>

                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/app/inventory/${suggestion.skuId}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {suggestion.mainImageUrl ? (
                        <img
                          src={suggestion.mainImageUrl}
                          alt={suggestion.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                        {suggestion.productName}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {suggestion.skuCode}
                      </div>
                    </div>
                  </Link>
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`font-semibold ${
                      suggestion.currentAvailable === 0
                        ? 'text-red-600'
                        : suggestion.currentAvailable < 100
                        ? 'text-yellow-700'
                        : 'text-gray-900'
                    }`}
                  >
                    {suggestion.currentAvailable.toLocaleString()}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-gray-900">
                    {suggestion.avgDailySales30d}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-gray-700">
                    {suggestion.targetDaysOfCover} days
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                    {suggestion.recommendedQty.toLocaleString()}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {suggestion.recommendedShipFromLocation &&
                  suggestion.recommendedShipToLocation ? (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span className="font-medium">Transfer</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  ) : (
                    <div className="text-xs text-gray-600">
                      {suggestion.recommendedShipToLocation && (
                        <span>To: {suggestion.recommendedShipToLocation}</span>
                      )}
                      {!suggestion.recommendedShipToLocation && (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="text-xs text-gray-700 max-w-xs">
                    {suggestion.reason}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
