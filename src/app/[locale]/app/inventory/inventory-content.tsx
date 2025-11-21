'use client';

import { useState } from 'react';
import { InventoryKpiBar } from '@/components/inventory/inventory-kpi-bar';
import { InventoryFilters } from '@/components/inventory/inventory-filters';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { AtRiskSkusWidget } from '@/components/inventory/at-risk-skus-widget';
import { AiInventoryCopilot } from '@/components/inventory/ai-inventory-copilot';
import { InventoryService } from '@/lib/services/inventory-service';
import type { InventoryFilter } from '@/lib/services/inventory-types';
import { useEffect } from 'react';

export function InventoryContent({ locale }: { locale: string }) {
  const [overview, setOverview] = useState<Awaited<
    ReturnType<typeof InventoryService.getInventoryOverview>
  > | null>(null);
  const [skuList, setSkuList] = useState<Awaited<
    ReturnType<typeof InventoryService.getInventorySkuList>
  > | null>(null);
  const [locations, setLocations] = useState<Awaited<
    ReturnType<typeof InventoryService.getInventoryLocations>
  >>([]);
  const [filter, setFilter] = useState<InventoryFilter>({
    status: 'ALL',
  });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 25 });

  useEffect(() => {
    const loadData = async () => {
      const [overviewData, skuData, locationsData] = await Promise.all([
        InventoryService.getInventoryOverview('org-1'),
        InventoryService.getInventorySkuList('org-1', filter, pagination),
        InventoryService.getInventoryLocations('org-1'),
      ]);

      setOverview(overviewData);
      setSkuList(skuData);
      setLocations(locationsData);
    };

    loadData();
  }, [filter, pagination]);

  if (!overview || !skuList) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <InventoryKpiBar
        totalSkus={overview.totalSkus}
        totalOnHand={overview.totalOnHand}
        totalAvailable={overview.totalAvailable}
        lowStockSkus={overview.lowStockSkus}
        outOfStockSkus={overview.outOfStockSkus}
        overstockedSkus={overview.overstockedSkus}
      />

      {/* Filters */}
      <InventoryFilters
        filter={filter}
        onFilterChange={setFilter}
        locations={locations.map((loc) => ({
          locationId: loc.locationId,
          locationName: loc.locationName,
        }))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2 space-y-4">
          <InventoryTable skus={skuList.items} locale={locale} />

          {/* Pagination */}
          {skuList.totalPages > 1 && (
            <div className="flex items-center justify-between bg-surface rounded-card border border-gray-200 px-4 py-3 shadow-token-sm">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  skuList.totalCount
                )}{' '}
                of {skuList.totalCount} SKUs
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                >
                  Previous
                </button>
                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={pagination.page === skuList.totalPages}
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <AtRiskSkusWidget skus={overview.topAtRiskSkus} locale={locale} />
          <AiInventoryCopilot context="overview" />
        </div>
      </div>
    </div>
  );
}
