/**
 * Log Stats Cards Component
 * KPI cards for log overview statistics
 */

import { Activity, AlertTriangle, AlertCircle, Link2, GitBranch } from 'lucide-react';

type LogStatsCardsProps = {
  stats: {
    totalLogs: number;
    errorCount: number;
    warnCount: number;
    uniqueRequestIds: number;
    uniqueCorrelationIds: number;
  };
  dict: any;
};

export default function LogStatsCards({ stats, dict }: LogStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Total Logs */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">{dict.kpis.totalLogs}</div>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalLogs.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">{dict.kpis.last24Hours}</div>
      </div>

      {/* Errors */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">{dict.kpis.errors}</div>
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="text-2xl font-bold text-red-600">{stats.errorCount.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">
          {((stats.errorCount / stats.totalLogs) * 100).toFixed(1)}% {dict.kpis.errorRate}
        </div>
      </div>

      {/* Warnings */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">{dict.kpis.warnings}</div>
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="text-2xl font-bold text-yellow-600">{stats.warnCount.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">
          {((stats.warnCount / stats.totalLogs) * 100).toFixed(1)}% {dict.kpis.warnRate}
        </div>
      </div>

      {/* Unique Requests */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">{dict.kpis.uniqueRequests}</div>
          <Link2 className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.uniqueRequestIds.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">{dict.kpis.trackedRequests}</div>
      </div>

      {/* Unique Correlations */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">{dict.kpis.uniqueCorrelations}</div>
          <GitBranch className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.uniqueCorrelationIds.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">{dict.kpis.correlatedFlows}</div>
      </div>
    </div>
  );
}
