'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ListingSummary, ListingChannelType, ListingStatus } from '@/lib/services/listing-types';
import { ListingsDictionary } from '@/i18n/getListingsDictionary';

type ListingsTableProps = {
  listings: ListingSummary[];
  dict: ListingsDictionary;
  locale: string;
  onSelectionChange: (selectedIds: string[]) => void;
  onErrorClick: (listing: ListingSummary) => void;
};

const getStatusColor = (status: ListingStatus) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800';
    case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
    case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800';
    case 'PENDING': return 'bg-blue-100 text-blue-800';
    case 'ERROR': return 'bg-red-100 text-red-800';
    case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStockColor = (stock: number) => {
  if (stock === 0) return 'bg-red-500';
  if (stock < 10) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getChannelIcon = (channelType: ListingChannelType) => {
  const icons: Record<ListingChannelType, string> = {
    AMAZON: '🛒',
    SHOPIFY: '🛍️',
    SHOPEE: '🛒',
    RAKUTEN: '🏪',
    EBAY: '🏷️',
    WALMART: '🏬',
    YAHOO_SHOPPING: '🛒',
    MERCARI: '📦',
    TIKTOK_SHOP: '🎵'
  };
  return icons[channelType] || '🛒';
};

export function ListingsTable({ listings, dict, locale, onSelectionChange, onErrorClick }: ListingsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? listings.map(l => l.id) : [];
    setSelectedIds(newSelection);
    onSelectionChange(newSelection);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelection = checked 
      ? [...selectedIds, id]
      : selectedIds.filter(selectedId => selectedId !== id);
    setSelectedIds(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === listings.length && listings.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {dict.table.channel}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {dict.table.product}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {dict.table.sku}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {dict.table.status}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {dict.table.price}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {dict.table.stock}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {dict.table.orders}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {dict.table.lastUpdated}
              </th>
              <th className="w-16 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(listing.id)}
                    onChange={(e) => handleSelectItem(listing.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getChannelIcon(listing.channelType)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{listing.channelName}</div>
                      <div className="text-xs text-gray-500">{listing.region}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {listing.mainImageUrl && (
                      <img 
                        src={listing.mainImageUrl} 
                        alt={listing.productName}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <Link 
                        href={`/${locale}/app/listings/${listing.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {listing.productName}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">{listing.sku}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(listing.status)}`}>
                    {dict.status[listing.status]}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {listing.price.toLocaleString()} {listing.currency}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-8 rounded-full ${getStockColor(listing.stock)}`}></div>
                    <span className="text-sm text-gray-900">{listing.stock}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">{listing.orders30d}</td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(listing.lastUpdatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  {listing.hasErrors && (
                    <button
                      onClick={() => onErrorClick(listing)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      title={dict.errors.title}
                    >
                      <span className="text-xs">!</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        {listings.map((listing) => (
          <div key={listing.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(listing.id)}
                  onChange={(e) => handleSelectItem(listing.id, e.target.checked)}
                  className="rounded border-gray-300"
                />
                {listing.mainImageUrl && (
                  <img 
                    src={listing.mainImageUrl} 
                    alt={listing.productName}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <Link 
                    href={`/${locale}/app/listings/${listing.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    <span className="line-clamp-2">{listing.productName}</span>
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">{listing.sku}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {listing.hasErrors && (
                  <button
                    onClick={() => onErrorClick(listing)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    title={dict.errors.title}
                  >
                    <span className="text-xs">!</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">{dict.table.channel}:</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-base">{getChannelIcon(listing.channelType)}</span>
                  <span className="font-medium">{listing.channelName}</span>
                  <span className="text-gray-500">({listing.region})</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">{dict.table.status}:</span>
                <div className="mt-1">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(listing.status)}`}>
                    {dict.status[listing.status]}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">{dict.table.price}:</span>
                <p className="font-medium mt-1">{listing.price.toLocaleString()} {listing.currency}</p>
              </div>
              <div>
                <span className="text-gray-500">{dict.table.stock}:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`h-2 w-6 rounded-full ${getStockColor(listing.stock)}`}></div>
                  <span className="font-medium">{listing.stock}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">{dict.table.orders}:</span>
                <p className="font-medium mt-1">{listing.orders30d}</p>
              </div>
              <div>
                <span className="text-gray-500">{dict.table.lastUpdated}:</span>
                <p className="text-xs mt-1">{new Date(listing.lastUpdatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}