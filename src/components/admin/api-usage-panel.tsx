/**
 * API Usage Panel
 */

'use client';

import type { ApiUsageMetric } from '@/lib/services/admin-types';
import { TrendingUp, TrendingDown } from 'lucide-react';

type ApiUsagePanelProps = {
  metrics: ApiUsageMetric[];
  dict: any;
};

export function ApiUsagePanel({ metrics, dict }: ApiUsagePanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">{dict.apiUsage.title}</h3>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.apiUsage.endpoint}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.apiUsage.requests}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.apiUsage.avgLatency}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.apiUsage.p95Latency}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              {dict.apiUsage.errorRate}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {metrics.map((metric, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-mono text-gray-900">{metric.endpoint}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  {metric.requests.toLocaleString()}
                  {metric.requests > 10000 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{metric.avgLatency}ms</td>
              <td className="px-4 py-3 text-sm text-gray-600">{metric.p95Latency}ms</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    metric.errorRate < 1
                      ? 'bg-green-100 text-green-700'
                      : metric.errorRate < 5
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {metric.errorRate}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
