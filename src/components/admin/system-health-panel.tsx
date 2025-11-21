/**
 * System Health Panel
 */

'use client';

import type { SystemHealthMetric } from '@/lib/services/admin-types';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type SystemHealthPanelProps = {
  metrics: SystemHealthMetric[];
  dict: any;
};

export function SystemHealthPanel({ metrics, dict }: SystemHealthPanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'DEGRADED':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'DOWN':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      HEALTHY: 'bg-green-100 text-green-700',
      DEGRADED: 'bg-yellow-100 text-yellow-700',
      DOWN: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${classes[status as keyof typeof classes]}`}>
        {dict.systemHealth[status.toLowerCase()]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">{dict.systemHealth.title}</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {metrics.map((metric) => (
          <div key={metric.service} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(metric.status)}
              <div>
                <p className="text-sm font-medium text-gray-900">{dict.systemHealth[metric.service] || metric.service}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                  <span>{dict.systemHealth.responseTime}: {metric.responseTime}ms</span>
                  <span>{dict.systemHealth.uptime}: {metric.uptime}%</span>
                </div>
              </div>
            </div>
            {getStatusBadge(metric.status)}
          </div>
        ))}
      </div>
    </div>
  );
}
