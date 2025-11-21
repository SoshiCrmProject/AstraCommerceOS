/**
 * Log Level Badge Component
 */

import type { LogLevel } from '@/lib/services/log-types';

type LogLevelBadgeProps = {
  level: LogLevel;
  dict: any;
};

export function LogLevelBadge({ level, dict }: LogLevelBadgeProps) {
  const colors = {
    DEBUG: 'bg-gray-100 text-gray-700 border-gray-300',
    INFO: 'bg-blue-100 text-blue-700 border-blue-300',
    WARN: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    ERROR: 'bg-red-100 text-red-700 border-red-300',
    FATAL: 'bg-purple-100 text-purple-700 border-purple-300',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[level]}`}>
      {dict.levels[level]}
    </span>
  );
}

export function SourceBadge({ source, dict }: { source: string; dict: any }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
      {dict.sources[source] || source}
    </span>
  );
}

export function EntityBadge({ type, label, dict }: { type: string; label?: string; dict: any }) {
  if (type === 'NONE' || !label) return null;
  
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
      {dict.entityTypes[type]}: {label}
    </span>
  );
}
