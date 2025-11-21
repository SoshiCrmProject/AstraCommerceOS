'use client';

import type { AutomationExecution } from '@/lib/services/automation-types';

type Props = { executions: AutomationExecution[]; onViewLog?: (executionId: string) => void };

export function ExecutionHistory({ executions, onViewLog }: Props) {
  return (
    <div className="bg-surface rounded-card border border-border-subtle p-4">
      <h3 className="text-sm font-semibold text-primary mb-3">Recent Executions</h3>
      <div className="space-y-2">
        {executions.length === 0 && (
          <div className="text-sm text-secondary text-center py-4">
            No executions found
          </div>
        )}
        {executions.slice(0, 10).map((exec) => (
          <div
            key={exec.id}
            className="flex items-start justify-between p-3 bg-bg-page rounded border border-border-subtle hover:shadow-sm transition-shadow"
          >
            <div className="flex-1">
              <div className="text-sm text-primary font-medium">{exec.ruleName}</div>
              <div className="text-xs text-secondary mt-1">{exec.triggerPreview}</div>
              <div className="text-xs text-secondary mt-1">
                {new Date(exec.startedAt).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  exec.status === 'SUCCESS'
                    ? 'bg-green-500/10 text-green-500'
                    : exec.status === 'FAILED'
                      ? 'bg-red-500/10 text-red-500'
                      : exec.status === 'PARTIAL'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-blue-500/10 text-blue-500'
                }`}
              >
                {exec.status}
              </span>
              {onViewLog && (
                <button
                  onClick={() => onViewLog(exec.id)}
                  className="px-2 py-1 text-xs bg-bg-page border border-border-subtle rounded hover:bg-surface transition-colors"
                >
                  View Log
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
