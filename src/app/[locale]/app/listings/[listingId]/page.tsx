

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { ListingAiAssistant } from '@/components/listings/listing-ai-assistant';
import { getListingsDictionary } from '@/i18n/getListingsDictionary';
import { getListingDetail } from '@/lib/services/listing-service';
import { ListingDetail, AiListingGeneration } from '@/lib/services/listing-types';
import { Locale } from '@/i18n/config';

type ListingDetailPageProps = {
  params: Promise<{ locale: Locale; listingId: string }>;
};

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const [listingId, setListingId] = useState<string>('');
  const [dict, setDict] = useState<any>(null);
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'variations' | 'seo' | 'compliance' | 'history'>('content');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    bulletPoints: [''],
    description: '',
    keywords: [''],
    attributes: [{ name: '', value: '' }]
  });

  useEffect(() => {
    const initPage = async () => {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale);
      setListingId(resolvedParams.listingId);
      const dictionary = await getListingsDictionary(resolvedParams.locale);
      setDict(dictionary);
      await loadListing(resolvedParams.listingId);
    };
    initPage();
  }, [params]);

  const loadListing = async (id: string) => {
    setLoading(true);
    try {
      const detail = await getListingDetail('org_001', id);
      setListing(detail);
      setFormData({
        title: detail.content.title,
        subtitle: detail.content.subtitle || '',
        bulletPoints: detail.content.bulletPoints.length ? detail.content.bulletPoints : [''],
        description: detail.content.description,
        keywords: detail.content.keywords.length ? detail.content.keywords : [''],
        attributes: detail.content.attributes.length ? detail.content.attributes : [{ name: '', value: '' }]
      });
    } catch (error) {
      console.error('Failed to load listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAiApply = (generation: AiListingGeneration, applyType: 'all' | 'title' | 'bullets') => {
    if (applyType === 'all' || applyType === 'title') {
      setFormData(prev => ({ ...prev, title: generation.title }));
    }
    if (applyType === 'all' || applyType === 'bullets') {
      setFormData(prev => ({ ...prev, bulletPoints: generation.bulletPoints }));
    }
    if (applyType === 'all') {
      setFormData(prev => ({ 
        ...prev, 
        description: generation.description,
        keywords: generation.keywords
      }));
    }
  };

  const addBulletPoint = () => {
    setFormData(prev => ({ ...prev, bulletPoints: [...prev.bulletPoints, ''] }));
  };

  const removeBulletPoint = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      bulletPoints: prev.bulletPoints.filter((_, i) => i !== index) 
    }));
  };

  const updateBulletPoint = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      bulletPoints: prev.bulletPoints.map((bullet, i) => i === index ? value : bullet)
    }));
  };

  if (!dict || loading) return <div>Loading...</div>;
  if (!listing) return <div>Listing not found</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={listing.summary.productName}
        breadcrumbs={[
          { label: dict.title, href: `/${locale}/app/listings` },
          { label: listing.summary.sku }
        ]}
        actions={
          <div className="flex gap-2">
            <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {dict.actions.preview}
            </button>
            <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              {dict.actions.savePublish}
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-4">
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(listing.summary.status)}`}>
          {dict.status[listing.summary.status]}
        </span>
        <span className="text-sm text-gray-500">
          {listing.summary.channelName} • {listing.summary.region}
        </span>
        {listing.summary.hasErrors && (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            Has errors
          </span>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto sm:space-x-8">
          {(['content', 'variations', 'seo', 'compliance', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 py-2 px-1 text-xs font-medium sm:text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {dict.detail.tabs[tab]}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {activeTab === 'content' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict.detail.content.title}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {dict.detail.content.characterCount.replace('{{current}}', formData.title.length.toString()).replace('{{max}}', '120')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict.detail.content.subtitle}
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict.detail.content.bulletPoints}
                </label>
                <div className="space-y-2">
                  {formData.bulletPoints.map((bullet, index) => (
                    <div key={index} className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => updateBulletPoint(index, e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder={`Bullet point ${index + 1}`}
                      />
                      {formData.bulletPoints.length > 1 && (
                        <button
                          onClick={() => removeBulletPoint(index)}
                          className="text-red-600 hover:text-red-800 text-sm sm:whitespace-nowrap"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addBulletPoint}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {dict.detail.content.addBullet}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict.detail.content.description}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:rows-6"
                />
              </div>
            </div>
          )}

          {activeTab === 'variations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {dict.detail.variations.variantCount.replace('{{count}}', listing.variations.length.toString())}
                </h3>
                <button className="text-blue-600 hover:text-blue-800">
                  {dict.detail.variations.addVariation}
                </button>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">SKU</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Attributes</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {listing.variations.map((variation, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-sm text-gray-900">{variation.sku}</td>
                        <td className="px-4 py-4">
                          <div className="flex gap-1">
                            {Object.entries(variation.attributes).map(([key, value]) => (
                              <span key={key} className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{variation.price}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{variation.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  {dict.detail.compliance.eligibleForAds}
                </span>
                {listing.errors.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    {dict.detail.compliance.violations.replace('{{count}}', listing.errors.length.toString())}
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                {listing.errors.map((error) => (
                  <div key={error.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-2">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          error.severity === 'ERROR' ? 'bg-red-100 text-red-800' :
                          error.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {dict.detail.compliance.severity[error.severity]}
                        </span>
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                          {dict.detail.compliance.categories[error.category]}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-900">{error.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {listing.history.map((entry) => (
                <div key={entry.id} className="flex gap-4 rounded-lg border border-gray-200 p-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{entry.changeSummary}</p>
                    <div className="mt-1 flex gap-2 text-xs text-gray-500">
                      <span>{new Date(entry.changedAt).toLocaleString()}</span>
                      {entry.changedBy && <span>by {entry.changedBy}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'content' && (
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <ListingAiAssistant
                dict={dict}
                locale={locale}
                onApply={handleAiApply}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}