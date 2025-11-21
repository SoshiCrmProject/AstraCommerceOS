/**
 * Log Detail Drawer Component
 * Side panel showing full log entry details with metadata
 */

'use client';

import { LogEntry } from '@/lib/services/log-types';
import { LogLevelBadge, SourceBadge, EntityBadge } from './log-badges';
import { X, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { useState } from 'react';

type LogDetailDrawerProps = {
  log: LogEntry | null;
  dict: any;
  locale: string;
  onClose: () => void;
};

export default function LogDetailDrawer({ log, dict, locale, onClose }: LogDetailDrawerProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!log) return null;

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white border-l border-gray-200 shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{dict.detail.title}</h2>
          <p className="text-sm text-gray-600">{log.id}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <LogLevelBadge level={log.level} dict={dict} />
          <SourceBadge source={log.source} dict={dict} />
          <EntityBadge type={log.entityType} label={log.entityLabel} dict={dict} />
        </div>

        {/* Message */}
        <div>
          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
            {dict.detail.message}
          </div>
          <div className="text-sm text-gray-900 bg-gray-50 rounded-lg p-4 border border-gray-200">
            {log.message}
          </div>
        </div>

        {/* Context */}
        {log.context && (
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
              {dict.detail.context}
            </div>
            <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200">
              {log.context}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div>
          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
            {dict.detail.timestamp}
          </div>
          <div className="text-sm text-gray-900">
            {new Date(log.timestamp).toLocaleString(locale, {
              dateStyle: 'full',
              timeStyle: 'long',
            })}
          </div>
        </div>

        {/* Entity Info */}
        {log.entityType !== 'NONE' && (
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
              {dict.detail.entity}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{dict.detail.entityType}:</span>
                <span className="text-gray-900 font-medium">{log.entityType}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{dict.detail.entityId}:</span>
                <button
                  onClick={() => copyToClipboard(log.entityId || '', 'entityId')}
                  className="text-gray-900 font-mono text-xs flex items-center gap-1 hover:text-blue-600"
                >
                  {log.entityId}
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              {log.entityLabel && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{dict.detail.entityLabel}:</span>
                  <span className="text-gray-900">{log.entityLabel}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Request ID */}
        {log.requestId && (
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
              {dict.detail.requestId}
            </div>
            <button
              onClick={() => copyToClipboard(log.requestId!, 'requestId')}
              className="w-full text-left text-sm text-gray-900 font-mono bg-blue-50 rounded-lg p-3 border border-blue-200 hover:bg-blue-100 flex items-center justify-between group"
            >
              <span className="truncate">{log.requestId}</span>
              {copied === 'requestId' ? (
                <span className="text-xs text-green-600">✓ Copied</span>
              ) : (
                <Copy className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              )}
            </button>
          </div>
        )}

        {/* Correlation ID */}
        {log.correlationId && (
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
              {dict.detail.correlationId}
            </div>
            <button
              onClick={() => copyToClipboard(log.correlationId!, 'correlationId')}
              className="w-full text-left text-sm text-gray-900 font-mono bg-indigo-50 rounded-lg p-3 border border-indigo-200 hover:bg-indigo-100 flex items-center justify-between group"
            >
              <span className="truncate">{log.correlationId}</span>
              {copied === 'correlationId' ? (
                <span className="text-xs text-green-600">✓ Copied</span>
              ) : (
                <Copy className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
              )}
            </button>
          </div>
        )}

        {/* Metadata */}
        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
              {dict.detail.metadata}
            </div>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Organization */}
        <div>
          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
            {dict.detail.organization}
          </div>
          <div className="text-sm text-gray-900 font-mono">{log.orgId}</div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {dict.buttons.explainWithAI}
          </button>
          {log.requestId && (
            <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" />
              {dict.buttons.viewRelatedLogs}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
