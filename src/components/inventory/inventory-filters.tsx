'use client';

import { Search } from 'lucide-react';
import type { InventoryFilter, InventorySkuStatus } from '@/lib/services/inventory-types';

export type InventoryFiltersProps = {
  filter: InventoryFilter;
  onFilterChange: (filter: InventoryFilter) => void;
  locations: Array<{ locationId: string; locationName: string }>;
};

export function InventoryFilters({
  filter,
  onFilterChange,
  locations,
}: InventoryFiltersProps) {
  return (
    <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Search SKU or Product
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by SKU code or product name..."
              value={filter.search || ''}
              onChange={(e) =>
                onFilterChange({ ...filter, search: e.target.value })
              }
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter.status || 'ALL'}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                status: e.target.value as InventorySkuStatus | 'ALL',
              })
            }
          >
            <option value="ALL">All Statuses</option>
            <option value="HEALTHY">Healthy</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="OVERSTOCKED">Overstocked</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Location
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter.locationId || ''}
            onChange={(e) =>
              onFilterChange({ ...filter, locationId: e.target.value })
            }
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.locationId} value={loc.locationId}>
                {loc.locationName}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Toggles */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Quick Filters
          </label>
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                filter.onlyLowStock
                  ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() =>
                onFilterChange({
                  ...filter,
                  onlyLowStock: !filter.onlyLowStock,
                  onlyOverstock: false,
                })
              }
            >
              Low Stock
            </button>
            <button
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                filter.onlyOverstock
                  ? 'bg-purple-100 text-purple-700 border-purple-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() =>
                onFilterChange({
                  ...filter,
                  onlyOverstock: !filter.onlyOverstock,
                  onlyLowStock: false,
                })
              }
            >
              Overstock
            </button>
            <button
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                filter.hasInbound
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() =>
                onFilterChange({
                  ...filter,
                  hasInbound: !filter.hasInbound,
                })
              }
            >
              Has Inbound
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
