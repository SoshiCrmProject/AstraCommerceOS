'use client';

import Link from 'next/link';
import type { AutomationRuleSummary } from '@/lib/services/automation-types';

type Props = { rules: AutomationRuleSummary[]; locale: string };

export function RulesTable({ rules, locale }: Props) {
  return (
    <div className="bg-surface rounded-card border border-border-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-page border-b border-border-subtle">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Name
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Status
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Trigger
              </th>
              <th className="text-right p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Actions
              </th>
              <th className="text-right p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Runs (7d)
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Last Run
              </th>
              <th className="text-center p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Quick Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {rules.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-secondary">
                  No automation rules found
                </td>
              </tr>
            )}
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-bg-page transition-colors">
                <td className="p-3">
                  <Link
                    href={`/${locale}/app/automation/${rule.id}`}
                    className="text-accent font-medium hover:underline"
                  >
                    {rule.name}
                  </Link>
                  {rule.description && (
                    <div className="text-xs text-secondary mt-1">{rule.description}</div>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      rule.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-500'
                        : rule.status === 'PAUSED'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-gray-500/10 text-gray-500'
                    }`}
                  >
                    {rule.status}
                  </span>
                </td>
                <td className="p-3 text-secondary text-xs">
                  {rule.triggerType.replace(/_/g, ' ')}
                </td>
                <td className="p-3 text-right text-primary font-medium">
                  {rule.actionsCount}
                </td>
                <td className="p-3 text-right text-primary font-medium">
                  {rule.runsLast7d}
                </td>
                <td className="p-3">
                  {rule.lastRunAt ? (
                    <div>
                      <div className="text-xs text-secondary">
                        {new Date(rule.lastRunAt).toLocaleString()}
                      </div>
                      {rule.lastRunStatus && (
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
                            rule.lastRunStatus === 'SUCCESS'
                              ? 'bg-green-500/10 text-green-500'
                              : rule.lastRunStatus === 'FAILED'
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {rule.lastRunStatus}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-secondary">Never run</div>
                  )}
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="px-2 py-1 text-xs bg-bg-page border border-border-subtle rounded hover:bg-surface transition-colors">
                      Test
                    </button>
                    <button className="px-2 py-1 text-xs bg-bg-page border border-border-subtle rounded hover:bg-surface transition-colors">
                      {rule.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
