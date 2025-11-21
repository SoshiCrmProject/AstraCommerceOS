'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewService } from '@/lib/services/review-service';
import type { ReviewDetail, ReviewStatus, ReviewPriority } from '@/lib/services/review-types';
import { Star, ArrowLeft, ExternalLink, Plus, Sparkles } from 'lucide-react';
import { SentimentBadge, StatusBadge, PriorityBadge, ChannelBadge } from './review-badges';
import { AIReplyAssistant } from './ai-reply-assistant';

type Props = {
  reviewId: string;
  dict: any;
  locale: string;
};

export function ReviewDetailView({ reviewId, dict, locale }: Props) {
  const router = useRouter();
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadReview();
  }, [reviewId]);

  const loadReview = async () => {
    setLoading(true);
    try {
      const data = await ReviewService.getReviewDetail('org-1', reviewId);
      setReview(data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: ReviewStatus) => {
    // TODO: Implement status update
    if (review) {
      setReview({
        ...review,
        summary: { ...review.summary, status }
      });
    }
  };

  const handlePriorityChange = async (priority: ReviewPriority) => {
    // TODO: Implement priority update
    if (review) {
      setReview({
        ...review,
        summary: { ...review.summary, priority }
      });
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !review) return;
    // TODO: Implement add note
    setNewNote('');
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !review) return;
    setReview({
      ...review,
      tags: [...review.tags, newTag.trim()]
    });
    setNewTag('');
  };

  if (loading || !review) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { summary } = review;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {dict.detail.backToReviews}
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              {summary.mainImageUrl && (
                <img src={summary.mainImageUrl} alt="" className="w-20 h-20 rounded-lg object-cover" />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{summary.productName}</h1>
                {summary.skuCode && (
                  <p className="text-sm text-gray-500 mb-2">SKU: {summary.skuCode}</p>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < summary.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-lg font-bold text-gray-900">{summary.rating}.0</span>
                  </div>
                  <ChannelBadge
                    channel={summary.channelType}
                    name={summary.channelName}
                    region={summary.region}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                {dict.buttons.openInChannel}
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                {dict.buttons.escalate}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SentimentBadge sentiment={summary.sentiment} dict={dict} />
            <StatusBadge status={summary.status} dict={dict} />
            <PriorityBadge priority={summary.priority} dict={dict} />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Review Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Body */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{dict.detail.reviewContent}</h3>
                {summary.authorName && (
                  <p className="text-sm text-gray-500">
                    {dict.detail.by} {summary.authorName} · {new Date(summary.createdAt).toLocaleDateString(locale)}
                  </p>
                )}
                {summary.language && summary.language !== locale && (
                  <p className="text-xs text-blue-600 mt-1">
                    {dict.detail.originalLanguage}: {summary.language.toUpperCase()}
                  </p>
                )}
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-900 whitespace-pre-wrap">{review.bodyFull}</p>
            </div>
          </div>

          {/* Product & Order Context */}
          {review.orderId && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{dict.detail.orderContext}</h3>
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">{dict.detail.orderId}:</span> {review.orderId}</p>
              </div>
            </div>
          )}

          {/* Internal Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{dict.detail.internalNotes}</h3>
            <div className="space-y-3 mb-4">
              {review.internalNotes.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">{note.author}</span>
                    <span className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleDateString(locale)}</span>
                  </div>
                  <p className="text-sm text-gray-900">{note.note}</p>
                </div>
              ))}
              {review.internalNotes.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">{dict.detail.noNotes}</p>
              )}
            </div>

            <div className="flex gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={dict.detail.addNotePlaceholder}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dict.buttons.addNote}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Status & AI */}
        <div className="space-y-6">
          {/* Status & Tags */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{dict.detail.statusAndTags}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{dict.filters.status}</label>
                <select
                  value={summary.status}
                  onChange={(e) => handleStatusChange(e.target.value as ReviewStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NEW">{dict.status.new}</option>
                  <option value="IN_PROGRESS">{dict.status.inProgress}</option>
                  <option value="RESPONDED">{dict.status.responded}</option>
                  <option value="RESOLVED">{dict.status.resolved}</option>
                  <option value="ESCALATED">{dict.status.escalated}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{dict.filters.priority}</label>
                <select
                  value={summary.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as ReviewPriority)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">{dict.priority.low}</option>
                  <option value="MEDIUM">{dict.priority.medium}</option>
                  <option value="HIGH">{dict.priority.high}</option>
                  <option value="CRITICAL">{dict.priority.critical}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{dict.detail.tags}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {review.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder={dict.detail.addTagPlaceholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Reply Assistant */}
          <AIReplyAssistant review={summary} dict={dict} locale={locale} />
        </div>
      </div>
    </div>
  );
}
