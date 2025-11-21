'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ReplenishmentTable } from '@/components/inventory/replenishment-table';
import { AiInventoryCopilot } from '@/components/inventory/ai-inventory-copilot';
import { InventoryService, type ReplenishmentParams } from '@/lib/services/inventory-service';
import type { ReplenishmentSuggestion } from '@/lib/services/inventory-types';

export function ReplenishmentContent({ locale }: { locale: string }) {
  const [suggestions, setSuggestions] = useState<ReplenishmentSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<ReplenishmentParams>({
    priorityFilter: 'ALL',
    targetDaysOfCover: 14,
  });

  useEffect(() => {
    const loadSuggestions = async () => {
      const data = await InventoryService.getReplenishmentSuggestions(
        'org-1',
        params
      );
      setSuggestions(data);
      setLoading(false);
    };

    loadSuggestions();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading replenishment suggestions...</div>
      </div>
    );
  }

  const highPriority = suggestions.filter((s) => s.priority === 'HIGH').length;
  const mediumPriority = suggestions.filter((s) => s.priority === 'MEDIUM')
    .length;
  const totalUnitsNeeded = suggestions.reduce(
    (sum, s) => sum + s.recommendedQty,
    0
  );

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">
            Total Suggestions
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {suggestions.length}
          </div>
        </div>
        <div className="bg-surface rounded-card border border-red-200 p-4 shadow-token-sm">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3 w-3 text-red-600" />
            <div className="text-xs font-medium text-red-700">
              High Priority
            </div>
          </div>
          <div className="text-2xl font-bold text-red-700">{highPriority}</div>
        </div>
        <div className="bg-surface rounded-card border border-yellow-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-yellow-700 mb-1">
            Medium Priority
          </div>
          <div className="text-2xl font-bold text-yellow-700">
            {mediumPriority}
          </div>
        </div>
        <div className="bg-surface rounded-card border border-blue-200 p-4 shadow-token-sm">
          <div className="text-xs font-medium text-blue-700 mb-1">
            Total Units Needed
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {totalUnitsNeeded.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-card border border-gray-200 p-4 shadow-token-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Priority Filter
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={params.priorityFilter || 'ALL'}
              onChange={(e) =>
                setParams({
                  ...params,
                  priorityFilter: e.target.value as 'HIGH' | 'MEDIUM' | 'LOW' | 'ALL',
                })
              }
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Target Days of Cover
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={params.targetDaysOfCover || 14}
              onChange={(e) =>
                setParams({
                  ...params,
                  targetDaysOfCover: parseInt(e.target.value),
                })
              }
              min={7}
              max={90}
            />
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              Generate Bulk PO
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suggestions Table */}
        <div className="lg:col-span-2">
          <ReplenishmentTable suggestions={suggestions} locale={locale} />
        </div>

        {/* AI Copilot */}
        <div>
          <AiInventoryCopilot context="replenishment" />
        </div>
      </div>
    </div>
  );
}
