import type { ReviewKeywordInsight, ReviewSentiment } from '@/lib/services/review-types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function KeywordsPanel({ title, keywords, sentiment, dict }: {
  title: string;
  keywords: ReviewKeywordInsight[];
  sentiment: 'POSITIVE' | 'NEGATIVE';
  dict: any;
}) {
  const Icon = sentiment === 'POSITIVE' ? TrendingUp : TrendingDown;
  const iconColor = sentiment === 'POSITIVE' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {keywords.map((kw, idx) => (
          <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900">{kw.keyword}</span>
                <span className="text-xs font-semibold text-gray-500">{kw.count}</span>
              </div>
              {kw.samplePhrase && (
                <p className="text-xs text-gray-600 italic line-clamp-2">"{kw.samplePhrase}"</p>
              )}
            </div>
          </div>
        ))}
        {keywords.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">{dict.keywords.noData}</p>
        )}
      </div>
    </div>
  );
}
