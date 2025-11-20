'use client';

import { useState } from 'react';
import { ListingStatus } from '@/lib/services/listing-types';
import { ListingsDictionary } from '@/i18n/getListingsDictionary';

type BulkActionsBarProps = {
  selectedCount: number;
  dict: ListingsDictionary;
  onStatusChange: (status: ListingStatus) => void;
  onResync: () => void;
  onExport: () => void;
  onClear: () => void;
};

export function BulkActionsBar({ 
  selectedCount, 
  dict, 
  onStatusChange, 
  onResync, 
  onExport, 
  onClear 
}: BulkActionsBarProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:transform">
      <div className="flex flex-col gap-3 rounded-lg bg-white px-4 py-3 shadow-lg ring-1 ring-black ring-opacity-5 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
        <span className="text-sm font-medium text-gray-900">
          {dict.bulk.selected.replace('{{count}}', selectedCount.toString())}
        </span>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-3 sm:py-2 sm:text-sm"
            >
              <span className="hidden sm:inline">{dict.actions.changeStatus}</span>
              <span className="sm:hidden">Status</span>
              <svg className="ml-1 h-4 w-4 sm:ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showStatusMenu && (
              <div className="absolute bottom-full mb-2 w-36 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 sm:w-48">
                {(['ACTIVE', 'PAUSED', 'ARCHIVED'] as ListingStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(status);
                      setShowStatusMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {dict.status[status]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onResync}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-3 sm:py-2 sm:text-sm"
          >
            <span className="hidden sm:inline">{dict.actions.triggerResync}</span>
            <span className="sm:hidden">Sync</span>
          </button>

          <button
            onClick={onExport}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-3 sm:py-2 sm:text-sm"
          >
            <span className="hidden sm:inline">{dict.actions.exportCsv}</span>
            <span className="sm:hidden">Export</span>
          </button>

          <button
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}