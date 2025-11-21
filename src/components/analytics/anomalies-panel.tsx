'use client';

import type { AnalyticsAnomaly } from '@/lib/services/analytics-types';
import { AlertCircle, TrendingUp, TrendingDown, AlertTriangle, PackageX } from 'lucide-react';

type AnomaliesPanelProps = {
  anomalies: AnalyticsAnomaly[];
  dict: any;
};

export function AnomaliesPanel({ anomalies, dict }: AnomaliesPanelProps) {
  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'REVENUE_SPIKE':
        return <TrendingUp className="w-5 h-5" />;
      case 'REVENUE_DROP':
        return <TrendingDown className="w-5 h-5" />;
      case 'MARGIN_DROP':
        return <AlertTriangle className="w-5 h-5" />;
      case 'RETURN_RATE_SPIKE':
        return <PackageX className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'HIGH':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getSeverityPillStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      LOW: dict.anomalies.low,
      MEDIUM: dict.anomalies.medium,
      HIGH: dict.anomalies.high,
      CRITICAL: dict.anomalies.critical,
    };
    return labels[severity] || severity;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      REVENUE_SPIKE: dict.anomalies.revenueSpike,
      REVENUE_DROP: dict.anomalies.revenueDrop,
      MARGIN_DROP: dict.anomalies.marginDrop,
      ORDERS_SPIKE: dict.anomalies.ordersSpike,
      CANCELLATION_SPIKE: dict.anomalies.cancellationSpike,
      RETURN_RATE_SPIKE: dict.anomalies.returnRateSpike,
    };
    return labels[type] || type;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  if (anomalies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="font-medium">{dict.anomalies.noAnomalies}</p>
        <p className="text-sm mt-1">{dict.empty.noAnomalies}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {anomalies.map((anomaly) => (
        <div
          key={anomaly.id}
          className={`rounded-lg border p-4 ${getSeverityStyle(anomaly.severity)}`}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {getAnomalyIcon(anomaly.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{getTypeLabel(anomaly.type)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityPillStyle(anomaly.severity)}`}>
                    {getSeverityLabel(anomaly.severity)}
                  </span>
                </div>
                <span className="text-xs whitespace-nowrap">{formatTimestamp(anomaly.detectedAt)}</span>
              </div>

              <p className="text-sm mb-2">{anomaly.description}</p>

              {/* Details */}
              <div className="flex items-center gap-4 text-xs">
                {anomaly.channelType && (
                  <div>
                    <span className="text-gray-600">Channel: </span>
                    <span className="font-medium">{anomaly.channelType}</span>
                  </div>
                )}
                {anomaly.region && (
                  <div>
                    <span className="text-gray-600">Region: </span>
                    <span className="font-medium">{anomaly.region}</span>
                  </div>
                )}
                {anomaly.deviationPercent !== undefined && (
                  <div>
                    <span className="text-gray-600">Deviation: </span>
                    <span className="font-medium">
                      {anomaly.deviationPercent > 0 ? '+' : ''}
                      {anomaly.deviationPercent.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="mt-3 pt-3 border-t border-current/10">
            <button className="text-xs font-medium hover:underline">
              {dict.anomalies.viewRelatedMetrics} →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
