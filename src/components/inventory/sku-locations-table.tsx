'use client';

import { MapPin, TrendingUp } from 'lucide-react';
import type { InventorySkuLocationRow } from '@/lib/services/inventory-types';

export type SkuLocationsTableProps = {
  locations: InventorySkuLocationRow[];
};

function getLocationTypeLabel(type: string) {
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
          3PL
        </span>
      );
    default:
      return null;
  }
}

export function SkuLocationsTable({ locations }: SkuLocationsTableProps) {
  if (locations.length === 0) {
    return (
      <div className="bg-surface rounded-card border border-gray-200 p-8 text-center shadow-token-sm">
        <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No locations for this SKU</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-card border border-gray-200 shadow-token-md overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">
          Inventory by Location
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                On Hand
              </th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Reserved
              </th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Available
              </th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Inbound
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {locations.map((loc) => (
              <tr key={loc.locationId} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {loc.locationName}
                      </div>
                      <div className="mt-0.5">
                        {getLocationTypeLabel(loc.locationType)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-medium text-gray-900">
                    {loc.onHand.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-gray-600">
                    {loc.reserved.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-medium text-blue-600">
                    {loc.available.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {loc.inbound > 0 ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      <TrendingUp className="h-3 w-3" />
                      {loc.inbound.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
