'use client';

import type { ChannelPerformance } from '@/lib/services/analytics-types';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

type ChannelPerformanceTableProps = {
  channels: ChannelPerformance[];
  dict: any;
};

export function ChannelPerformanceTable({ channels, dict }: ChannelPerformanceTableProps) {
  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'JPY' ? 'JPY' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'UP':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'DOWN':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'UP':
        return 'text-green-600';
      case 'DOWN':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.channelPerformance.channel}
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.channelPerformance.region}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.channelPerformance.revenue}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.channelPerformance.profit}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.channelPerformance.profitMargin}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.channelPerformance.orders}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.channelPerformance.units}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.channelPerformance.avgOrderValue}
            </th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700">
              {dict.channelPerformance.trend}
            </th>
          </tr>
        </thead>
        <tbody>
          {channels.map((channel, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{channel.channelName}</div>
              </td>
              <td className="py-3 px-4">
                <span className="text-gray-600">{channel.region}</span>
              </td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">
                {formatCurrency(channel.revenue, channel.currency)}
              </td>
              <td className="py-3 px-4 text-right font-medium text-green-600">
                {formatCurrency(channel.profit, channel.currency)}
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-gray-700">{formatPercent(channel.profitMarginPercent)}</span>
              </td>
              <td className="py-3 px-4 text-right text-gray-700">
                {channel.orders.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right text-gray-700">
                {channel.units.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">
                {formatCurrency(channel.avgOrderValue, channel.currency)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-1">
                  {getTrendIcon(channel.trendDirection)}
                  {channel.revenueGrowthPercent !== undefined && (
                    <span className={`text-xs font-medium ${getTrendColor(channel.trendDirection)}`}>
                      {channel.revenueGrowthPercent > 0 ? '+' : ''}
                      {formatPercent(channel.revenueGrowthPercent)}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {channels.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>{dict.empty.noData}</p>
        </div>
      )}
    </div>
  );
}
