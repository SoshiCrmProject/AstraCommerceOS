'use client';

import type { RevenuePoint } from '@/lib/services/analytics-types';
import { useMemo } from 'react';

type RevenueChartProps = {
  timeSeries: RevenuePoint[];
  dict: any;
};

export function RevenueChart({ timeSeries, dict }: RevenueChartProps) {
  const maxRevenue = useMemo(() => {
    return Math.max(...timeSeries.map((p) => p.revenue));
  }, [timeSeries]);

  const maxProfit = useMemo(() => {
    return Math.max(...timeSeries.map((p) => p.profit));
  }, [timeSeries]);

  const maxValue = Math.max(maxRevenue, maxProfit);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-700">{dict.charts.revenue}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-700">{dict.charts.profit}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-gray-700">{dict.charts.orders}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 flex items-end gap-1">
        {timeSeries.map((point, index) => {
          const revenueHeight = (point.revenue / maxValue) * 100;
          const profitHeight = (point.profit / maxValue) * 100;
          const ordersHeight = ((point.orders / Math.max(...timeSeries.map((p) => p.orders))) * maxValue / maxValue) * 100;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-1 group relative"
            >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                <div className="font-semibold mb-1">{formatDate(point.date)}</div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-300">{dict.charts.revenue}:</span>
                    <span className="font-medium">{formatCurrency(point.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-300">{dict.charts.profit}:</span>
                    <span className="font-medium text-green-300">{formatCurrency(point.profit)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-300">{dict.charts.orders}:</span>
                    <span className="font-medium text-purple-300">{point.orders}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-300">{dict.charts.units}:</span>
                    <span className="font-medium">{point.units}</span>
                  </div>
                </div>
              </div>

              {/* Bars */}
              <div className="relative w-full flex items-end gap-0.5 h-56">
                {/* Revenue bar */}
                <div
                  className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-all"
                  style={{ height: `${revenueHeight}%` }}
                ></div>
                {/* Profit bar */}
                <div
                  className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-all"
                  style={{ height: `${profitHeight}%` }}
                ></div>
                {/* Orders bar */}
                <div
                  className="flex-1 bg-purple-500 rounded-t hover:bg-purple-600 transition-all"
                  style={{ height: `${ordersHeight}%` }}
                ></div>
              </div>

              {/* Date label (show every nth date) */}
              {index % Math.ceil(timeSeries.length / 7) === 0 && (
                <div className="text-xs text-gray-500 rotate-0 mt-1">
                  {formatDate(point.date)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Y-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 px-2">
        <span>0</span>
        <span>{formatCurrency(maxValue / 2)}</span>
        <span>{formatCurrency(maxValue)}</span>
      </div>
    </div>
  );
}
