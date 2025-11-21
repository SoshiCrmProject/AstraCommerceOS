/**
 * Log Timeline Chart Component
 * Time series visualization of log volume with error overlay
 */

'use client';

import { BarChart3 } from 'lucide-react';

type LogTimelineChartProps = {
  timeSeries: Array<{
    bucket: string;
    totalCount: number;
    errorCount: number;
    warnCount: number;
  }>;
  dict: any;
};

export default function LogTimelineChart({ timeSeries, dict }: LogTimelineChartProps) {
  // Calculate max for scaling
  const maxCount = Math.max(...timeSeries.map(b => b.totalCount));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{dict.chart.timeline}</h3>
          <p className="text-sm text-gray-600">{dict.chart.volumeOverTime}</p>
        </div>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      {/* Chart */}
      <div className="h-64">
        <div className="flex items-end justify-between h-full gap-1">
          {timeSeries.map((bucket, idx) => {
            const totalHeight = (bucket.totalCount / maxCount) * 100;
            const errorHeight = (bucket.errorCount / bucket.totalCount) * totalHeight;
            const warnHeight = (bucket.warnCount / bucket.totalCount) * totalHeight;

            return (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-1 group">
                {/* Bar */}
                <div className="relative w-full">
                  <div
                    className="w-full bg-blue-200 rounded-t transition-all hover:bg-blue-300"
                    style={{ height: `${totalHeight}%` }}
                  >
                    {/* Error overlay */}
                    {bucket.errorCount > 0 && (
                      <div
                        className="absolute bottom-0 w-full bg-red-500 rounded-t"
                        style={{ height: `${errorHeight}%` }}
                      />
                    )}
                    {/* Warning overlay */}
                    {bucket.warnCount > 0 && (
                      <div
                        className="absolute bottom-0 w-full bg-yellow-400"
                        style={{ height: `${warnHeight}%` }}
                      />
                    )}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                      <div className="font-semibold">{bucket.bucket}</div>
                      <div className="text-gray-300 mt-1">Total: {bucket.totalCount}</div>
                      {bucket.errorCount > 0 && (
                        <div className="text-red-300">Errors: {bucket.errorCount}</div>
                      )}
                      {bucket.warnCount > 0 && (
                        <div className="text-yellow-300">Warnings: {bucket.warnCount}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Label */}
                <div className="text-xs text-gray-500 truncate w-full text-center">
                  {bucket.bucket}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-200 rounded" />
          <span className="text-gray-600">{dict.chart.totalLogs}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded" />
          <span className="text-gray-600">{dict.chart.warnings}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-gray-600">{dict.chart.errors}</span>
        </div>
      </div>
    </div>
  );
}
