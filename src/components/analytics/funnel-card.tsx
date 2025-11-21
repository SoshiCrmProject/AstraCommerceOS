'use client';

import type { FunnelMetric } from '@/lib/services/analytics-types';
import { useMemo } from 'react';

type FunnelCardProps = {
  funnel: FunnelMetric[];
  dict: any;
};

export function FunnelCard({ funnel, dict }: FunnelCardProps) {
  const maxCount = useMemo(() => {
    return Math.max(...funnel.map((f) => f.count));
  }, [funnel]);

  const getStageLabel = (stage: string) => {
    const labels: Record<string, string> = {
      VISITS: dict.funnel.visits,
      PRODUCT_VIEWS: dict.funnel.productViews,
      ADD_TO_CART: dict.funnel.addToCart,
      CHECKOUT: dict.funnel.checkout,
      ORDERS: dict.funnel.orders,
    };
    return labels[stage] || stage;
  };

  return (
    <div className="space-y-6">
      {/* Visual Funnel */}
      <div className="space-y-2">
        {funnel.map((stage, index) => {
          const widthPercent = (stage.count / maxCount) * 100;
          const isFirst = index === 0;
          const isLast = index === funnel.length - 1;

          return (
            <div key={stage.stage} className="space-y-1">
              {/* Bar */}
              <div className="relative">
                <div
                  className="h-12 rounded-lg flex items-center justify-between px-4 transition-all"
                  style={{
                    width: `${widthPercent}%`,
                    marginLeft: `${((100 - widthPercent) / 2)}%`,
                    background: isFirst
                      ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : isLast
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  }}
                >
                  <span className="text-white font-semibold text-sm">{getStageLabel(stage.stage)}</span>
                  <span className="text-white font-bold">{stage.count.toLocaleString()}</span>
                </div>

                {/* Conversion rate from previous */}
                {stage.conversionFromPreviousPercent !== undefined && (
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                    {stage.conversionFromPreviousPercent.toFixed(1)}% {dict.funnel.fromPrevious}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table View */}
      <div className="border-t border-gray-200 pt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-xs font-semibold text-gray-700">
                {dict.funnel.stage}
              </th>
              <th className="text-right py-2 text-xs font-semibold text-gray-700">
                {dict.funnel.count}
              </th>
              <th className="text-right py-2 text-xs font-semibold text-gray-700">
                {dict.funnel.conversion}
              </th>
            </tr>
          </thead>
          <tbody>
            {funnel.map((stage, index) => (
              <tr key={stage.stage} className="border-b border-gray-100">
                <td className="py-2 text-gray-900">{getStageLabel(stage.stage)}</td>
                <td className="py-2 text-right font-medium text-gray-900">
                  {stage.count.toLocaleString()}
                </td>
                <td className="py-2 text-right">
                  {stage.conversionFromPreviousPercent !== undefined ? (
                    <span className={stage.conversionFromPreviousPercent < 50 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      {stage.conversionFromPreviousPercent.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overall conversion */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-xs text-gray-600 mb-1">Overall Conversion Rate</div>
        <div className="text-2xl font-bold text-gray-900">
          {((funnel[funnel.length - 1].count / funnel[0].count) * 100).toFixed(2)}%
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {funnel[funnel.length - 1].count.toLocaleString()} {dict.funnel.orders} / {funnel[0].count.toLocaleString()} {dict.funnel.visits}
        </div>
      </div>
    </div>
  );
}
