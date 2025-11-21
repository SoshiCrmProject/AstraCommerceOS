import type { ReviewSentiment, ReviewStatus, ReviewPriority, ReviewChannelType } from '@/lib/services/review-types';
import { Smile, Meh, Frown } from 'lucide-react';

export function SentimentBadge({ sentiment, dict }: { sentiment: ReviewSentiment; dict: any }) {
  const config = {
    POSITIVE: { bg: 'bg-green-100', text: 'text-green-700', icon: Smile },
    NEUTRAL: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Meh },
    NEGATIVE: { bg: 'bg-red-100', text: 'text-red-700', icon: Frown },
  };

  const { bg, text, icon: Icon } = config[sentiment];
  const label = dict.sentiment[sentiment.toLowerCase()];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export function StatusBadge({ status, dict }: { status: ReviewStatus; dict: any }) {
  const config = {
    NEW: { bg: 'bg-blue-100', text: 'text-blue-700' },
    IN_PROGRESS: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    RESPONDED: { bg: 'bg-purple-100', text: 'text-purple-700' },
    RESOLVED: { bg: 'bg-green-100', text: 'text-green-700' },
    ESCALATED: { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const { bg, text } = config[status];
  const label = dict.status[status.toLowerCase().replace('_', '')];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function PriorityBadge({ priority, dict }: { priority: ReviewPriority; dict: any }) {
  const config = {
    LOW: { bg: 'bg-gray-100', text: 'text-gray-600' },
    MEDIUM: { bg: 'bg-blue-100', text: 'text-blue-600' },
    HIGH: { bg: 'bg-orange-100', text: 'text-orange-600' },
    CRITICAL: { bg: 'bg-red-100', text: 'text-red-600' },
  };

  const { bg, text } = config[priority];
  const label = dict.priority[priority.toLowerCase()];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function ChannelBadge({ channel, name, region }: {
  channel: ReviewChannelType;
  name: string;
  region: string;
}) {
  const channelColors: Record<ReviewChannelType, string> = {
    AMAZON: 'bg-orange-100 text-orange-700',
    SHOPIFY: 'bg-green-100 text-green-700',
    SHOPEE: 'bg-orange-100 text-orange-700',
    RAKUTEN: 'bg-red-100 text-red-700',
    EBAY: 'bg-blue-100 text-blue-700',
    WALMART: 'bg-blue-100 text-blue-700',
    YAHOO_SHOPPING: 'bg-purple-100 text-purple-700',
    MERCARI: 'bg-red-100 text-red-700',
    TIKTOK_SHOP: 'bg-pink-100 text-pink-700',
  };

  return (
    <div>
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${channelColors[channel]}`}>
        {name}
      </span>
      <div className="text-xs text-gray-500 mt-1">{region}</div>
    </div>
  );
}
