'use client';

import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRightLeft,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import type { InventorySkuActivityEvent } from '@/lib/services/inventory-types';

export type SkuActivityTimelineProps = {
  activity: InventorySkuActivityEvent[];
};

function getEventIcon(kind: string) {
  switch (kind) {
    case 'INBOUND':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'OUTBOUND':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    case 'ADJUSTMENT':
      return <RefreshCw className="h-4 w-4 text-blue-600" />;
    case 'TRANSFER':
      return <ArrowRightLeft className="h-4 w-4 text-purple-600" />;
    case 'RESERVATION':
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case 'CANCELLATION':
      return <XCircle className="h-4 w-4 text-gray-600" />;
    default:
      return null;
  }
}

function getEventColor(kind: string) {
  switch (kind) {
    case 'INBOUND':
      return 'bg-green-100 text-green-700';
    case 'OUTBOUND':
      return 'bg-red-100 text-red-700';
    case 'ADJUSTMENT':
      return 'bg-blue-100 text-blue-700';
    case 'TRANSFER':
      return 'bg-purple-100 text-purple-700';
    case 'RESERVATION':
      return 'bg-yellow-100 text-yellow-700';
    case 'CANCELLATION':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function SkuActivityTimeline({ activity }: SkuActivityTimelineProps) {
  if (activity.length === 0) {
    return (
      <div className="bg-surface rounded-card border border-gray-200 shadow-token-md p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8 text-gray-500 text-sm">
          No recent activity
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-card border border-gray-200 shadow-token-md p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Recent Activity
      </h3>

      <div className="space-y-3">
        {activity.map((event, index) => (
          <div
            key={event.id}
            className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
          >
            <div className={`p-2 rounded-lg ${getEventColor(event.kind)}`}>
              {getEventIcon(event.kind)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm text-gray-900 font-medium">
                    {event.description}
                  </div>
                  {event.locationName && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {event.locationName}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-sm font-semibold ${
                      event.quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {event.quantity > 0 ? '+' : ''}
                    {event.quantity.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatRelativeTime(event.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
