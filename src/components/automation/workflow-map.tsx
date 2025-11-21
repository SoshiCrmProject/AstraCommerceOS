'use client';

import type { AutomationRuleDetail } from '@/lib/services/automation-types';

type Props = { rule: AutomationRuleDetail };

export function WorkflowMap({ rule }: Props) {
  return (
    <div className="bg-surface rounded-card border border-border-subtle p-6">
      <h3 className="text-sm font-semibold text-primary mb-4">Workflow Visualization</h3>
      <div className="flex flex-col items-center space-y-3">
        {/* Trigger Node */}
        <div className="w-full max-w-xs bg-blue-500/10 border-2 border-blue-500 rounded-card p-3 text-center">
          <div className="text-xs font-semibold text-blue-500 uppercase mb-1">Trigger</div>
          <div className="text-sm text-primary font-medium">
            {rule.triggerType.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center">
          <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Conditions Node */}
        {rule.conditions.length > 0 && (
          <>
            <div className="w-full max-w-xs bg-yellow-500/10 border-2 border-yellow-500 rounded-card p-3">
              <div className="text-xs font-semibold text-yellow-600 uppercase mb-2 text-center">
                Conditions ({rule.conditions.length})
              </div>
              <div className="space-y-1">
                {rule.conditions.map((cond) => (
                  <div key={cond.id} className="text-xs text-secondary">
                    {cond.field} {cond.operator} {cond.value}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </>
        )}

        {/* Actions Nodes */}
        <div className="w-full max-w-xs bg-green-500/10 border-2 border-green-500 rounded-card p-3">
          <div className="text-xs font-semibold text-green-600 uppercase mb-2 text-center">
            Actions ({rule.actions.length})
          </div>
          <div className="space-y-2">
            {rule.actions.map((action, idx) => (
              <div key={action.id} className="bg-surface rounded p-2 border border-border-subtle">
                <div className="text-xs font-medium text-primary">
                  {idx + 1}. {action.label || action.type.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
