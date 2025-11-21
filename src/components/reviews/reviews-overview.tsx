'use client';

import { useState, useEffect } from 'react';
import { ReviewService } from '@/lib/services/review-service';
import type { ReviewSummary, ReviewFilter, ReviewOverviewSnapshot } from '@/lib/services/review-types';
import { Star, TrendingUp, TrendingDown, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { ReviewsTable } from './reviews-table';
import { ReviewsFilters } from './reviews-filters';
import { SentimentChart } from './sentiment-chart';
import { TrendChart } from './trend-chart';
import { KeywordsPanel } from './keywords-panel';

type Props = {
  dict: any;
  locale: string;
};

export function ReviewsOverview({ dict, locale }: Props) {
  const [snapshot, setSnapshot] = useState<ReviewOverviewSnapshot | null>(null);
  const [reviews, setReviews] = useState<ReviewSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<ReviewFilter>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [filter, page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [snapshotData, reviewsData] = await Promise.all([
        ReviewService.getReviewOverviewSnapshot('org-1'),
        ReviewService.getReviews('org-1', filter, { page, pageSize: 20 })
      ]);
      setSnapshot(snapshotData);
      setReviews(reviewsData.items);
      setTotal(reviewsData.total);
    } finally {
      setLoading(false);
    }
  };

  if (!snapshot) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { aggregates } = snapshot;

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          icon={Star}
          label={dict.kpis.avgRating}
          value={aggregates.avgRating.toFixed(1)}
          suffix="★"
          trend={aggregates.avgRating >= 4.0 ? 'up' : 'down'}
          iconColor="text-yellow-500"
        />
        <KPICard
          icon={MessageSquare}
          label={dict.kpis.totalReviews}
          value={aggregates.totalReviews.toLocaleString()}
          iconColor="text-blue-500"
        />
        <KPICard
          icon={CheckCircle}
          label={dict.kpis.positive}
          value={aggregates.totalPositive.toLocaleString()}
          iconColor="text-green-500"
        />
        <KPICard
          icon={TrendingUp}
          label={dict.kpis.new24h}
          value={aggregates.newReviews24h.toLocaleString()}
          caption={dict.kpis.last24Hours}
          iconColor="text-purple-500"
        />
        <KPICard
          icon={AlertTriangle}
          label={dict.kpis.negative7d}
          value={aggregates.negativeLast7d.toLocaleString()}
          caption={dict.kpis.last7Days}
          iconColor="text-red-500"
        />
        <KPICard
          icon={MessageSquare}
          label={dict.kpis.responseRate}
          value={`${aggregates.respondedRateLast7d.toFixed(0)}%`}
          caption={dict.kpis.last7Days}
          trend={aggregates.respondedRateLast7d >= 80 ? 'up' : 'down'}
          iconColor="text-indigo-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Donut */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{dict.charts.sentimentBreakdown}</h3>
          <SentimentChart
            positive={aggregates.totalPositive}
            neutral={aggregates.totalNeutral}
            negative={aggregates.totalNegative}
            dict={dict}
          />
        </div>

        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{dict.charts.reviewTrends}</h3>
          <TrendChart timeSeries={snapshot.timeSeries} dict={dict} />
        </div>
      </div>

      {/* Keywords Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeywordsPanel
          title={dict.keywords.topPositive}
          keywords={snapshot.topPositiveKeywords}
          sentiment="POSITIVE"
          dict={dict}
        />
        <KeywordsPanel
          title={dict.keywords.topNegative}
          keywords={snapshot.topNegativeKeywords}
          sentiment="NEGATIVE"
          dict={dict}
        />
      </div>

      {/* Filters */}
      <ReviewsFilters
        filter={filter}
        onFilterChange={setFilter}
        dict={dict}
      />

      {/* Reviews Table */}
      <ReviewsTable
        reviews={reviews}
        total={total}
        page={page}
        onPageChange={setPage}
        loading={loading}
        dict={dict}
        locale={locale}
      />
    </div>
  );
}

function KPICard({ icon: Icon, label, value, suffix = '', caption, trend, iconColor }: {
  icon: any;
  label: string;
  value: string;
  suffix?: string;
  caption?: string;
  trend?: 'up' | 'down';
  iconColor?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <Icon className={`w-5 h-5 ${iconColor || 'text-gray-400'}`} />
        {trend && (
          <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {value}{suffix}
      </div>
      <div className="text-xs text-gray-500 mt-1">{caption || label}</div>
    </div>
  );
}
