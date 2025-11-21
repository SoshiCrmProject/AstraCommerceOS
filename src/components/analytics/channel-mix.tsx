'use client';

import type { ChannelPerformance } from '@/lib/services/analytics-types';
import { useMemo } from 'react';

type ChannelMixProps = {
  channels: ChannelPerformance[];
  dict: any;
};

export function ChannelMix({ channels, dict }: ChannelMixProps) {
  const totalRevenue = useMemo(() => {
    return channels.reduce((sum, ch) => sum + ch.revenue, 0);
  }, [channels]);

  const channelShares = useMemo(() => {
    return channels
      .map((ch) => ({
        ...ch,
        sharePercent: (ch.revenue / totalRevenue) * 100,
      }))
      .sort((a, b) => b.sharePercent - a.sharePercent);
  }, [channels, totalRevenue]);

  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ef4444', // red
    '#06b6d4', // cyan
    '#f97316', // orange
    '#ec4899', // pink
    '#14b8a6', // teal
  ];

  let cumulativePercent = 0;

  return (
    <div className="space-y-4">
      {/* Donut Chart */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="20"
            />
            {channelShares.map((ch, index) => {
              const percent = ch.sharePercent;
              const offset = cumulativePercent;
              cumulativePercent += percent;

              const circumference = 2 * Math.PI * 40;
              const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((offset / 100) * circumference);

              return (
                <circle
                  key={ch.channelType}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={colors[index % colors.length]}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:opacity-75 cursor-pointer"
                  style={{ strokeLinecap: 'butt' }}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-gray-900">
              {channels.length}
            </div>
            <div className="text-xs text-gray-600">Channels</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {channelShares.map((ch, index) => (
          <div key={ch.channelType} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-gray-900 font-medium">{ch.channelName}</span>
              <span className="text-gray-500 text-xs">({ch.region})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">
                {ch.sharePercent.toFixed(1)}%
              </span>
              <span className="text-gray-600 text-xs">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: ch.currency === 'JPY' ? 'JPY' : 'USD',
                  minimumFractionDigits: 0,
                }).format(ch.revenue)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
