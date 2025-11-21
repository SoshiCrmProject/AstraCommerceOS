'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { InventorySkuDemandInsight } from '@/lib/services/inventory-types';

export type SkuDemandChartProps = {
  demand: InventorySkuDemandInsight;
  currentAvailable: number;
};

export function SkuDemandChart({ demand, currentAvailable }: SkuDemandChartProps) {
  const daysOfCover =
    demand.avgDailySales30d > 0
      ? Math.floor(currentAvailable / demand.avgDailySales30d)
      : 999;

  const getTrendIcon = () => {
    switch (demand.trend) {
      case 'UP':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'DOWN':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'FLAT':
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendText = () => {
    switch (demand.trend) {
      case 'UP':
        return 'Increasing';
      case 'DOWN':
        return 'Decreasing';
      case 'FLAT':
        return 'Stable';
    }
  };

  const getTrendColor = () => {
    switch (demand.trend) {
      case 'UP':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'DOWN':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'FLAT':
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-surface rounded-card border border-gray-200 shadow-token-md p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Demand Forecast & Sales Trend
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* 30-day avg */}
        <div>
          <div className="text-xs text-gray-600 mb-1">Avg Sales (30d)</div>
          <div className="text-2xl font-bold text-gray-900">
            {demand.avgDailySales30d}
            <span className="text-sm text-gray-500 font-normal ml-1">
              /day
            </span>
          </div>
        </div>

        {/* 90-day avg */}
        <div>
          <div className="text-xs text-gray-600 mb-1">Avg Sales (90d)</div>
          <div className="text-2xl font-bold text-gray-900">
            {demand.avgDailySales90d}
            <span className="text-sm text-gray-500 font-normal ml-1">
              /day
            </span>
          </div>
        </div>
      </div>

      {/* Trend Badge */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border mb-4 ${getTrendColor()}`}
      >
        {getTrendIcon()}
        <div>
          <div className="text-xs font-medium">Demand Trend</div>
          <div className="text-sm font-semibold">{getTrendText()}</div>
        </div>
      </div>

      {/* Days of Cover */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-blue-700 font-medium">
            Days of Cover
          </span>
          <span className="text-2xl font-bold text-blue-700">
            {daysOfCover >= 999 ? '∞' : daysOfCover}
          </span>
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Based on current available stock & 30d sales velocity
        </div>
      </div>

      {/* Stockout Warning */}
      {demand.forecastStockoutDays !== undefined &&
        demand.forecastStockoutDays <= 7 && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-xs font-semibold text-red-700">
                Stockout Risk
              </span>
            </div>
            <div className="text-sm text-red-700">
              Forecasted stockout in{' '}
              <span className="font-bold">{demand.forecastStockoutDays}</span>{' '}
              days
            </div>
          </div>
        )}

      {/* Forecast Confidence */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-gray-600">Forecast Confidence</span>
        <span
          className={`font-semibold ${
            demand.forecastConfidence === 'HIGH'
              ? 'text-green-600'
              : demand.forecastConfidence === 'MEDIUM'
              ? 'text-yellow-600'
              : 'text-gray-600'
          }`}
        >
          {demand.forecastConfidence}
        </span>
      </div>
    </div>
  );
}
