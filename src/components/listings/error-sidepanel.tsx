'use client';

import { ListingSummary, ListingErrorDetail } from '@/lib/services/listing-types';
import { ListingsDictionary } from '@/i18n/getListingsDictionary';

type ErrorSidepanelProps = {
  listing: ListingSummary | null;
  errors: ListingErrorDetail[];
  dict: ListingsDictionary;
  locale: string;
  onClose: () => void;
};

const getSeverityColor = (severity: 'INFO' | 'WARNING' | 'ERROR') => {
  switch (severity) {
    case 'INFO': return 'bg-blue-100 text-blue-800';
    case 'WARNING': return 'bg-yellow-100 text-yellow-800';
    case 'ERROR': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    CATEGORY: 'bg-purple-100 text-purple-800',
    BRAND: 'bg-green-100 text-green-800',
    CONTENT: 'bg-blue-100 text-blue-800',
    POLICY: 'bg-red-100 text-red-800',
    DUPLICATE: 'bg-orange-100 text-orange-800',
    TECHNICAL: 'bg-gray-100 text-gray-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

export function ErrorSidepanel({ listing, errors, dict, locale, onClose }: ErrorSidepanelProps) {
  if (!listing) return null;

  const errorCount = errors.filter(e => e.severity === 'ERROR').length;
  const warningCount = errors.filter(e => e.severity === 'WARNING').length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full bg-white shadow-xl sm:w-96">
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{dict.errors.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600 line-clamp-2">{listing.productName}</p>
              <p className="text-xs text-gray-500">{listing.sku}</p>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6">
            <div className="flex flex-wrap gap-2">
              {errorCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                  {dict.errors.summary.errors.replace('{{count}}', errorCount.toString())}
                </span>
              )}
              {warningCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  {dict.errors.summary.warnings.replace('{{count}}', warningCount.toString())}
                </span>
              )}
            </div>
            {errors.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                {dict.errors.summary.lastOccurrence.replace('{{date}}', new Date(errors[0].occurredAt).toLocaleDateString())}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6">
            <div className="space-y-4">
              {errors.map((error) => (
                <div key={error.id} className="rounded-lg border border-gray-200 p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getSeverityColor(error.severity)}`}>
                        {dict.compliance.severity[error.severity]}
                      </span>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getCategoryColor(error.category)}`}>
                        {dict.compliance.categories[error.category]}
                      </span>
                    </div>
                    {error.resolved && (
                      <span className="text-green-600 flex-shrink-0">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-900">{error.message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(error.occurredAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">{dict.errors.aiSuggestion}</p>
            </div>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
              {dict.errors.viewDetail}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}