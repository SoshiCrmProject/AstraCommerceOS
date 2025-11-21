'use client';

import type { RepricingRule } from '@/lib/services/pricing-types';

type Props = { rules: RepricingRule[] };

export function RulesTable({ rules }: Props) {
  return (
    <div className="bg-surface rounded-card border border-border-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-page border-b border-border-subtle">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Rule Name
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Strategy
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Applies To
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Conditions
              </th>
              <th className="text-center p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Status
              </th>
              <th className="text-right p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {rules.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-secondary">
                  No repricing rules found
                </td>
              </tr>
            )}
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-bg-page transition-colors">
                <td className="p-3">
                  <div className="text-primary font-medium">{rule.name}</div>
                  <div className="text-xs text-secondary">
                    Updated: {new Date(rule.updatedAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full">
                    {rule.strategyType}
                  </span>
                </td>
                <td className="p-3 text-secondary">{rule.appliesTo.replace(/_/g, ' ')}</td>
                <td className="p-3 text-sm text-secondary max-w-xs truncate">
                  {rule.conditionsSummary}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      rule.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-gray-500/10 text-gray-500'
                    }`}
                  >
                    {rule.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button className="px-3 py-1 text-xs bg-bg-page border border-border-subtle rounded hover:bg-surface transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
