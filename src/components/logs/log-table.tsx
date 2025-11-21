/**
 * Log Table Component
 * Main log stream table with sorting and row selection
 */

'use client';

import { LogEntry } from '@/lib/services/log-types';
import { LogLevelBadge, SourceBadge, EntityBadge } from './log-badges';
import { ChevronDown, ChevronUp } from 'lucide-react';

type LogTableProps = {
  logs: LogEntry[];
  dict: any;
  locale: string;
  onRowClick?: (log: LogEntry) => void;
};

export default function LogTable({ logs, dict, locale, onRowClick }: LogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="text-gray-500">
          <div className="text-lg font-medium">{dict.empty.noLogs}</div>
          <div className="text-sm mt-1">{dict.empty.tryAdjustingFilters}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase hover:text-gray-900">
                  {dict.table.timestamp}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.level}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.source}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.message}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.entity}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.requestId}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick?.(log)}
              >
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString(locale, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3">
                  <LogLevelBadge level={log.level} dict={dict} />
                </td>
                <td className="px-4 py-3">
                  <SourceBadge source={log.source} dict={dict} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                  <div className="truncate">{log.message}</div>
                  {log.context && (
                    <div className="text-xs text-gray-500 truncate mt-0.5">{log.context}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <EntityBadge type={log.entityType} label={log.entityLabel} dict={dict} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                  {log.requestId ? (
                    <span className="truncate block max-w-[120px]" title={log.requestId}>
                      {log.requestId}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
