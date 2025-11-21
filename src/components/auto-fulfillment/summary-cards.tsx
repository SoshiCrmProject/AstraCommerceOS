/**
 * Auto-Fulfillment Summary Cards
 * Display key metrics for auto-fulfillment dashboard
 */

import type { AutoFulfillmentSummary } from '@/lib/services/auto-fulfillment-types';
import { Package, CheckCircle, XCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

type SummaryCardsProps = {
  summary: AutoFulfillmentSummary;
  dict: any;
};

export function SummaryCards({ summary, dict }: SummaryCardsProps) {
  const cards = [
    {
      label: dict.summary.totalCandidates,
      value: summary.totalCandidates,
      icon: Package,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      label: dict.summary.eligible,
      value: summary.eligible,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: dict.summary.skipped,
      value: summary.skipped,
      icon: XCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: dict.summary.queued,
      value: summary.queued,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: dict.summary.succeeded,
      value: summary.succeeded,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      label: dict.summary.failed,
      value: summary.failed,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: dict.summary.totalProfit,
      value: `¥${summary.totalExpectedProfit.toLocaleString()}`,
      icon: DollarSign,
      color: summary.totalExpectedProfit >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: summary.totalExpectedProfit >= 0 ? 'bg-green-100' : 'bg-red-100',
    },
    {
      label: dict.summary.avgProfit,
      value: `¥${Math.round(summary.averageProfit).toLocaleString()}`,
      icon: TrendingUp,
      color: summary.averageProfit >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: summary.averageProfit >= 0 ? 'bg-green-100' : 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">{card.label}</div>
          <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
