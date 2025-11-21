'use client';

import { useState, useEffect } from 'react';
import { ReviewService } from '@/lib/services/review-service';
import type { ReviewOverviewSnapshot } from '@/lib/services/review-types';
import { TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';
import { TrendChart } from './trend-chart';
import { KeywordsPanel } from './keywords-panel';

type Props = {
  dict: any;
  locale: string;
};

export function InsightsView({ dict, locale }: Props) {
  const [snapshot, setSnapshot] = useState<ReviewOverviewSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await ReviewService.getReviewOverviewSnapshot('org-1');
      setSnapshot(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !snapshot) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { aggregates, timeSeries, topPositiveKeywords, topNegativeKeywords } = snapshot;

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InsightCard
          icon={Award}
          title={dict.insights.avgRating}
          value={aggregates.avgRating.toFixed(2)}
          suffix="★"
          trend={aggregates.avgRating >= 4.0 ? 'up' : 'down'}
          caption={`${dict.insights.from} ${aggregates.totalReviews.toLocaleString()} ${dict.insights.reviews}`}
          iconColor="text-yellow-500"
        />
        <InsightCard
          icon={TrendingUp}
          title={dict.insights.positiveRate}
          value={`${((aggregates.totalPositive / aggregates.totalReviews) * 100).toFixed(0)}%`}
          caption={`${aggregates.totalPositive.toLocaleString()} ${dict.insights.positive}`}
          iconColor="text-green-500"
        />
        <InsightCard
          icon={AlertTriangle}
          title={dict.insights.negativeRate}
          value={`${((aggregates.totalNegative / aggregates.totalReviews) * 100).toFixed(0)}%`}
          caption={`${aggregates.totalNegative.toLocaleString()} ${dict.insights.negative}`}
          iconColor="text-red-500"
        />
        <InsightCard
          icon={TrendingUp}
          title={dict.insights.responseRate}
          value={`${aggregates.respondedRateLast7d.toFixed(0)}%`}
          caption={dict.insights.last7Days}
          trend={aggregates.respondedRateLast7d >= 80 ? 'up' : 'down'}
          iconColor="text-blue-500"
        />
      </div>

      {/* Detailed Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{dict.insights.trendAnalysis}</h3>
        <div className="h-64">
          <TrendChart timeSeries={timeSeries} dict={dict} />
        </div>
      </div>

      {/* Issues & Wins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{dict.insights.issuesByTheme}</h3>
          <div className="space-y-3">
            {topNegativeKeywords.map((kw, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-gray-900">{kw.keyword}</span>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                    {kw.count} {dict.insights.mentions}
                  </span>
                </div>
                {kw.samplePhrase && (
                  <p className="text-xs text-gray-600 italic ml-6">"{kw.samplePhrase}"</p>
                )}
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  {dict.insights.suggestedArea}: {getSuggestedArea(kw.keyword)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{dict.insights.winsByTheme}</h3>
          <div className="space-y-3">
            {topPositiveKeywords.map((kw, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-gray-900">{kw.keyword}</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    {kw.count} {dict.insights.mentions}
                  </span>
                </div>
                {kw.samplePhrase && (
                  <p className="text-xs text-gray-600 italic ml-6">"{kw.samplePhrase}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{dict.insights.channelComparison}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.insights.channel}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.insights.avgRating}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.insights.totalReviews}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{dict.insights.negativeRate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <ChannelRow channel="Amazon" avgRating={4.3} total={234} negativePercent={12} />
              <ChannelRow channel="Shopify" avgRating={4.6} total={89} negativePercent={8} />
              <ChannelRow channel="Rakuten" avgRating={4.1} total={156} negativePercent={15} />
              <ChannelRow channel="Shopee" avgRating={4.4} total={67} negativePercent={10} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, value, suffix = '', caption, trend, iconColor }: {
  icon: any;
  title: string;
  value: string;
  suffix?: string;
  caption: string;
  trend?: 'up' | 'down';
  iconColor?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <Icon className={`w-6 h-6 ${iconColor || 'text-gray-400'}`} />
        {trend && (
          <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value}{suffix}
      </div>
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className="text-xs text-gray-400">{caption}</div>
    </div>
  );
}

function ChannelRow({ channel, avgRating, total, negativePercent }: {
  channel: string;
  avgRating: number;
  total: number;
  negativePercent: number;
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{channel}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-900">{avgRating.toFixed(1)}</span>
          <span className="text-yellow-500">★</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{total.toLocaleString()}</td>
      <td className="px-4 py-3">
        <span className={`text-sm ${negativePercent > 15 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
          {negativePercent}%
        </span>
      </td>
    </tr>
  );
}

function getSuggestedArea(keyword: string): string {
  const mapping: Record<string, string> = {
    'shipping': 'Logistics & Delivery',
    'packaging': 'Product Packaging',
    'quality': 'Product Quality',
    'price': 'Pricing Strategy',
    'support': 'Customer Service',
    'slow': 'Response Time',
    'broken': 'Quality Control',
    'delayed': 'Fulfillment Process',
  };

  const key = Object.keys(mapping).find(k => keyword.toLowerCase().includes(k));
  return key ? mapping[key] : 'General Operations';
}
