'use client';

import type { ReviewTimeSeriesPoint } from '@/lib/services/review-types';

export function TrendChart({ timeSeries, dict }: {
  timeSeries: ReviewTimeSeriesPoint[];
  dict: any;
}) {
  if (timeSeries.length === 0) return null;

  const maxCount = Math.max(...timeSeries.map(d => d.count));
  const maxRating = 5;

  return (
    <div className="space-y-4">
      <div className="h-48 flex items-end gap-1">
        {timeSeries.slice(-30).map((point, idx) => {
          const heightPercent = (point.count / maxCount) * 100;
          const ratingColor = point.avgRating >= 4 ? 'bg-green-500' : point.avgRating >= 3 ? 'bg-yellow-500' : 'bg-red-500';

          return (
            <div key={idx} className="flex-1 flex flex-col justify-end group relative">
              <div
                className={`${ratingColor} rounded-t transition-all hover:opacity-80`}
                style={{ height: `${heightPercent}%` }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                    <div>{new Date(point.date).toLocaleDateString()}</div>
                    <div>{point.count} reviews</div>
                    <div>{point.avgRating.toFixed(1)}★</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{new Date(timeSeries[0].date).toLocaleDateString()}</span>
        <span>{new Date(timeSeries[timeSeries.length - 1].date).toLocaleDateString()}</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-gray-600">≥4.0★</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span className="text-gray-600">3.0-3.9★</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-gray-600">&lt;3.0★</span>
        </div>
      </div>
    </div>
  );
}
