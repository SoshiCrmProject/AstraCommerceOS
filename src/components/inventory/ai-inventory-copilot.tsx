'use client';

import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

export type AiInventoryCopilotProps = {
  context: 'overview' | 'sku-detail' | 'replenishment';
};

export function AiInventoryCopilot({ context }: AiInventoryCopilotProps) {
  const getInsights = () => {
    switch (context) {
      case 'overview':
        return [
          {
            icon: <AlertCircle className="h-4 w-4 text-red-500" />,
            title: 'Critical Stock Alert',
            message:
              'USB-C-003 is out of stock with 62 daily sales. Immediate reorder recommended.',
            action: 'View Replenishment',
          },
          {
            icon: <TrendingUp className="h-4 w-4 text-green-500" />,
            title: 'Demand Surge Detected',
            message:
              'Wireless Headphones sales up 28% vs last month. Consider increasing stock levels.',
            action: 'Analyze Trend',
          },
          {
            icon: <Sparkles className="h-4 w-4 text-purple-500" />,
            title: 'Optimization Opportunity',
            message:
              'Transfer 150 units of Laptop Stand from NJ warehouse to FBA to reduce overstock.',
            action: 'Create Transfer',
          },
        ];

      case 'sku-detail':
        return [
          {
            icon: <TrendingUp className="h-4 w-4 text-green-500" />,
            title: 'Demand Forecast',
            message:
              'Based on current trend, expect stockout in 8 days. Recommended order: 450 units.',
            action: 'Generate PO',
          },
          {
            icon: <Sparkles className="h-4 w-4 text-blue-500" />,
            title: 'Pricing Insight',
            message:
              'Competitor prices dropped 12%. Consider adjusting pricing to maintain velocity.',
            action: 'Review Pricing',
          },
        ];

      case 'replenishment':
        return [
          {
            icon: <Sparkles className="h-4 w-4 text-purple-500" />,
            title: 'Bulk Optimization',
            message:
              'Consolidate 5 high-priority SKUs into single PO to save on shipping costs.',
            action: 'Create Bulk PO',
          },
          {
            icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
            title: 'Lead Time Warning',
            message:
              'Supplier lead time increased to 14 days. Adjust target days of cover to 21.',
            action: 'Adjust Settings',
          },
        ];

      default:
        return [];
    }
  };

  const insights = getInsights();

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-card border border-purple-200 shadow-token-md">
      <div className="px-5 py-4 border-b border-purple-200 bg-white/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              AI Inventory Copilot
            </h3>
            <p className="text-xs text-gray-600">
              Proactive insights & recommendations
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-token-sm"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">{insight.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900">
                  {insight.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                <button className="mt-2 text-xs font-medium text-purple-600 hover:text-purple-700">
                  {insight.action} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-white/50 border-t border-purple-200 rounded-b-card">
        <button className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
          Ask AI about inventory...
        </button>
      </div>
    </div>
  );
}
