/**
 * Log Filters Component
 * Advanced filter controls for log search and filtering
 */

'use client';

import { Search, Calendar, Filter } from 'lucide-react';

type LogFiltersProps = {
  dict: any;
  onFilterChange?: (filters: any) => void;
};

export default function LogFilters({ dict, onFilterChange }: LogFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={dict.filters.search}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Level Filter */}
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="ALL">{dict.levels.ALL}</option>
          <option value="ERROR">{dict.levels.ERROR}</option>
          <option value="WARN">{dict.levels.WARN}</option>
          <option value="INFO">{dict.levels.INFO}</option>
          <option value="DEBUG">{dict.levels.DEBUG}</option>
          <option value="FATAL">{dict.levels.FATAL}</option>
        </select>

        {/* Source Filter */}
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="ALL">{dict.sources.ALL}</option>
          <option value="BACKEND">{dict.sources.BACKEND}</option>
          <option value="FRONTEND">{dict.sources.FRONTEND}</option>
          <option value="CONNECTOR">{dict.sources.CONNECTOR}</option>
          <option value="AUTOMATION">{dict.sources.AUTOMATION}</option>
          <option value="JOB_QUEUE">{dict.sources.JOB_QUEUE}</option>
          <option value="AUTH">{dict.sources.AUTH}</option>
          <option value="BILLING">{dict.sources.BILLING}</option>
        </select>

        {/* Date Range Filter */}
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="last1Hour">{dict.filters.last1Hour}</option>
          <option value="last24Hours">{dict.filters.last24Hours}</option>
          <option value="last7Days">{dict.filters.last7Days}</option>
          <option value="last30Days">{dict.filters.last30Days}</option>
        </select>

        {/* Advanced Filters Toggle */}
        <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          {dict.buttons.advancedFilters}
        </button>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-xs text-gray-600">{dict.filters.quickFilters}:</span>
        <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
          {dict.filters.onlyErrors}
        </button>
        <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
          {dict.filters.withRequestId}
        </button>
        <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
          {dict.filters.withCorrelationId}
        </button>
      </div>
    </div>
  );
}
