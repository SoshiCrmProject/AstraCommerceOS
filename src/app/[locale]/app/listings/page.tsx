'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { ListingsTable } from '@/components/listings/listings-table';
import { ErrorSidepanel } from '@/components/listings/error-sidepanel';
import { BulkActionsBar } from '@/components/listings/bulk-actions-bar';
import { getListingsDictionary } from '@/i18n/getListingsDictionary';
import { getListingList, getListingDetail, bulkUpdateListingStatus, bulkTriggerResync } from '@/lib/services/listing-service';
import { ListingSummary, ListingFilter, ListingChannelType, ListingStatus, ListingErrorDetail } from '@/lib/services/listing-types';
import { Locale } from '@/i18n/config';

type ListingsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default function ListingsPage({ params }: ListingsPageProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const [dict, setDict] = useState<any>(null);
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errorPanelListing, setErrorPanelListing] = useState<ListingSummary | null>(null);
  const [errorDetails, setErrorDetails] = useState<ListingErrorDetail[]>([]);
  const [filter, setFilter] = useState<ListingFilter>({
    channelType: 'ALL',
    status: 'ALL'
  });

  useEffect(() => {
    const initPage = async () => {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale);
      const dictionary = await getListingsDictionary(resolvedParams.locale);
      setDict(dictionary);
      await loadListings();
    };
    initPage();
  }, [params]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const result = await getListingList('org_001', filter, { page: 1, pageSize: 50 });
      setListings(result.items);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleErrorClick = async (listing: ListingSummary) => {
    try {
      const detail = await getListingDetail('org_001', listing.id);
      setErrorDetails(detail.errors);
      setErrorPanelListing(listing);
    } catch (error) {
      console.error('Failed to load error details:', error);
    }
  };

  const handleBulkStatusChange = async (status: ListingStatus) => {
    try {
      await bulkUpdateListingStatus('org_001', selectedIds, status);
      setSelectedIds([]);
      await loadListings();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleBulkResync = async () => {
    try {
      await bulkTriggerResync('org_001', selectedIds);
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to trigger resync:', error);
    }
  };

  const handleBulkExport = () => {
    console.log('Export CSV for:', selectedIds);
  };

  if (!dict) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.title}
        subtitle={dict.subtitle}
        actions={
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-4 sm:text-sm">
                <span className="hidden sm:inline">{dict.actions.bulkActions}</span>
                <span className="sm:hidden">Bulk</span>
                <svg className="ml-1 h-4 w-4 sm:ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 sm:px-4 sm:text-sm">
              <span className="hidden sm:inline">{dict.actions.createListing}</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        }
      />

      <div className="space-y-4">
        {/* Search bar */}
        <div className="w-full">
          <input
            type="text"
            placeholder={dict.filters.search}
            value={filter.search || ''}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        
        {/* Filters row */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filter.channelType || 'ALL'}
            onChange={(e) => setFilter({ ...filter, channelType: e.target.value as ListingChannelType | 'ALL' })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm min-w-0 flex-1 sm:flex-none sm:w-auto"
          >
            <option value="ALL">{dict.filters.all}</option>
            <option value="AMAZON">{dict.channels.AMAZON}</option>
            <option value="SHOPIFY">{dict.channels.SHOPIFY}</option>
            <option value="SHOPEE">{dict.channels.SHOPEE}</option>
            <option value="RAKUTEN">{dict.channels.RAKUTEN}</option>
          </select>

          <select
            value={filter.status || 'ALL'}
            onChange={(e) => setFilter({ ...filter, status: e.target.value as ListingStatus | 'ALL' })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm min-w-0 flex-1 sm:flex-none sm:w-auto"
          >
            <option value="ALL">{dict.filters.all}</option>
            <option value="ACTIVE">{dict.status.ACTIVE}</option>
            <option value="PAUSED">{dict.status.PAUSED}</option>
            <option value="ERROR">{dict.status.ERROR}</option>
            <option value="OUT_OF_STOCK">{dict.status.OUT_OF_STOCK}</option>
          </select>

          <button
            onClick={loadListings}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 whitespace-nowrap"
          >
            Apply Filters
          </button>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filter.hasErrors || false}
              onChange={(e) => setFilter({ ...filter, hasErrors: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">{dict.filters.withErrors}</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filter.lowStockOnly || false}
              onChange={(e) => setFilter({ ...filter, lowStockOnly: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">{dict.filters.lowStock}</span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500">Loading listings...</div>
        </div>
      ) : (
        <ListingsTable
          listings={listings}
          dict={dict}
          locale={locale}
          onSelectionChange={setSelectedIds}
          onErrorClick={handleErrorClick}
        />
      )}

      <BulkActionsBar
        selectedCount={selectedIds.length}
        dict={dict}
        onStatusChange={handleBulkStatusChange}
        onResync={handleBulkResync}
        onExport={handleBulkExport}
        onClear={() => setSelectedIds([])}
      />

      <ErrorSidepanel
        listing={errorPanelListing}
        errors={errorDetails}
        dict={dict}
        locale={locale}
        onClose={() => setErrorPanelListing(null)}
      />
    </div>
  );
}