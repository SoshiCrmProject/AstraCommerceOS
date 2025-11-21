'use client';

import { MapPin, Package, TrendingUp, Building } from 'lucide-react';
import type { InventoryLocationSummary } from '@/lib/services/inventory-types';

export type LocationsGridProps = {
  locations: InventoryLocationSummary[];
};

function getLocationTypeIcon(type: string) {
  switch (type) {
    case 'FBA':
      return (
        <div className="p-2 bg-orange-100 rounded-lg">
          <Package className="h-5 w-5 text-orange-600" />
        </div>
      );
    case 'FBM':
      return (
        <div className="p-2 bg-blue-100 rounded-lg">
          <Package className="h-5 w-5 text-blue-600" />
        </div>
      );
    case 'OWN_WAREHOUSE':
      return (
        <div className="p-2 bg-purple-100 rounded-lg">
          <Building className="h-5 w-5 text-purple-600" />
        </div>
      );
    case 'THIRD_PARTY_3PL':
      return (
        <div className="p-2 bg-green-100 rounded-lg">
          <Building className="h-5 w-5 text-green-600" />
        </div>
      );
    default:
      return (
        <div className="p-2 bg-gray-100 rounded-lg">
          <MapPin className="h-5 w-5 text-gray-600" />
        </div>
      );
  }
}

function getLocationTypeBadge(type: string) {
  switch (type) {
    case 'FBA':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">
          Amazon FBA
        </span>
      );
    case 'FBM':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
          FBM
        </span>
      );
    case 'OWN_WAREHOUSE':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
          Own Warehouse
        </span>
      );
    case 'THIRD_PARTY_3PL':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
          3PL Partner
        </span>
      );
    default:
      return null;
  }
}

export function LocationsGrid({ locations }: LocationsGridProps) {
  if (locations.length === 0) {
    return (
      <div className="bg-surface rounded-card border border-gray-200 p-12 text-center shadow-token-sm">
        <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No locations configured</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations.map((location) => (
        <div
          key={location.locationId}
          className="bg-surface rounded-card border border-gray-200 shadow-token-md hover:shadow-token-lg transition-shadow"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200">
            <div className="flex items-start gap-3">
              {getLocationTypeIcon(location.locationType)}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {location.locationName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 font-mono">
                    {location.code}
                  </span>
                  {getLocationTypeBadge(location.locationType)}
                </div>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>
                {location.city}, {location.region}
              </span>
            </div>
          </div>

          {/* Inventory Stats */}
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">On Hand</div>
                <div className="text-xl font-bold text-gray-900">
                  {location.totalOnHand.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Available</div>
                <div className="text-xl font-bold text-blue-600">
                  {location.totalAvailable.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Reserved</div>
                <div className="text-sm font-semibold text-gray-700">
                  {location.totalReserved.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Inbound</div>
                <div className="text-sm font-semibold text-green-600 flex items-center gap-1">
                  {location.totalInbound > 0 && (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  {location.totalInbound.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">SKU Count</span>
                <span className="font-semibold text-gray-900">
                  {location.skuCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
