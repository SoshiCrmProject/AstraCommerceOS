'use client';

import { useEffect, useState } from 'react';
import { LocationsGrid } from '@/components/inventory/locations-grid';
import { InventoryService } from '@/lib/services/inventory-service';
import type { InventoryLocationSummary } from '@/lib/services/inventory-types';

export function LocationsContent({ locale }: { locale: string }) {
  const [locations, setLocations] = useState<InventoryLocationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      const data = await InventoryService.getInventoryLocations('org-1');
      setLocations(data);
      setLoading(false);
    };

    loadLocations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading locations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">
            Total Locations
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {locations.length}
          </div>
        </div>
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">
            Total On Hand
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {locations
              .reduce((sum, loc) => sum + loc.totalOnHand, 0)
              .toLocaleString()}
          </div>
        </div>
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">
            Total Available
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {locations
              .reduce((sum, loc) => sum + loc.totalAvailable, 0)
              .toLocaleString()}
          </div>
        </div>
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">
            Total Inbound
          </div>
          <div className="text-2xl font-bold text-green-600">
            {locations
              .reduce((sum, loc) => sum + loc.totalInbound, 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <LocationsGrid locations={locations} />
    </div>
  );
}
