'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReviewSummary } from '@/lib/services/review-types';
import { Star, ChevronRight, Sparkles } from 'lucide-react';
import { SentimentBadge, StatusBadge, PriorityBadge, ChannelBadge } from './review-badges';

type Props = {
  reviews: ReviewSummary[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  dict: any;
  locale: string;
};

export function ReviewsTable({ reviews, total, page, onPageChange, loading, dict, locale }: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleRowClick = (reviewId: string) => {
    router.push(`/${locale}/app/reviews/${reviewId}`);
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === reviews.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reviews.map(r => r.id)));
    }
  };

  if (reviews.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{dict.table.noReviews}</h3>
        <p className="text-sm text-gray-500">{dict.table.noReviewsDesc}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedIds.size} {dict.table.selected}
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50">
              {dict.buttons.markInProgress}
            </button>
            <button className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50">
              {dict.buttons.markResolved}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.size === reviews.length && reviews.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.table.rating}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.table.product}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.table.channel}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.table.review}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.table.sentiment}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.table.status}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.table.priority}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.table.date}</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(review.id)}
              >
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(review.id)}
                    onChange={() => toggleSelect(review.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">{review.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {review.mainImageUrl && (
                      <img src={review.mainImageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{review.productName}</div>
                      {review.skuCode && (
                        <div className="text-xs text-gray-500">{review.skuCode}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <ChannelBadge channel={review.channelType} name={review.channelName} region={review.region} />
                </td>
                <td className="px-4 py-4 max-w-xs">
                  <div className="text-sm text-gray-900 line-clamp-2">{review.bodyPreview}</div>
                  {review.hasAiSuggestedReply && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-purple-600">
                      <Sparkles className="w-3 h-3" />
                      <span>AI reply available</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <SentimentBadge sentiment={review.sentiment} dict={dict} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={review.status} dict={dict} />
                </td>
                <td className="px-4 py-4">
                  <PriorityBadge priority={review.priority} dict={dict} />
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString(locale)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {dict.table.showing} {(page - 1) * 20 + 1}-{Math.min(page * 20, total)} {dict.table.of} {total}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dict.table.previous}
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page * 20 >= total}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dict.table.next}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
