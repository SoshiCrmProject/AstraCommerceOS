'use client';

import type { PricingExperiment } from '@/lib/services/pricing-types';

type Props = { experiments: PricingExperiment[] };

export function ExperimentsTable({ experiments }: Props) {
  return (
    <div className="bg-surface rounded-card border border-border-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-page border-b border-border-subtle">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Experiment
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                SKU
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Channel
              </th>
              <th className="text-right p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Variant A
              </th>
              <th className="text-right p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Variant B
              </th>
              <th className="text-center p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Status
              </th>
              <th className="text-left p-3 text-xs font-medium text-secondary uppercase tracking-wide">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {experiments.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-secondary">
                  No experiments found
                </td>
              </tr>
            )}
            {experiments.map((exp) => {
              const winnerIsA =
                exp.status === 'COMPLETED' && exp.winningVariant === 'A';
              const winnerIsB =
                exp.status === 'COMPLETED' && exp.winningVariant === 'B';

              return (
                <tr key={exp.id} className="hover:bg-bg-page transition-colors">
                  <td className="p-3">
                    <div className="text-primary font-medium">{exp.name}</div>
                    <div className="text-xs text-secondary">
                      Started: {new Date(exp.startedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-primary">{exp.skuCode}</div>
                    <div className="text-xs text-secondary">{exp.productName}</div>
                  </td>
                  <td className="p-3 text-secondary">
                    <div>{exp.channelName}</div>
                    <div className="text-xs">{exp.region}</div>
                  </td>
                  <td className="p-3 text-right">
                    <div className={`text-primary font-semibold ${winnerIsA ? 'text-green-500' : ''}`}>
                      ${exp.variantA.price.toFixed(2)}
                      {winnerIsA && ' ✓'}
                    </div>
                    {exp.variantA.conversionRate !== undefined && (
                      <div className="text-xs text-secondary">CVR: {exp.variantA.conversionRate}%</div>
                    )}
                    {exp.variantA.revenue !== undefined && (
                      <div className="text-xs text-secondary">
                        Rev: ${exp.variantA.revenue.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className={`text-primary font-semibold ${winnerIsB ? 'text-green-500' : ''}`}>
                      ${exp.variantB.price.toFixed(2)}
                      {winnerIsB && ' ✓'}
                    </div>
                    {exp.variantB.conversionRate !== undefined && (
                      <div className="text-xs text-secondary">CVR: {exp.variantB.conversionRate}%</div>
                    )}
                    {exp.variantB.revenue !== undefined && (
                      <div className="text-xs text-secondary">
                        Rev: ${exp.variantB.revenue.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        exp.status === 'RUNNING'
                          ? 'bg-blue-500/10 text-blue-500'
                          : exp.status === 'COMPLETED'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-gray-500/10 text-gray-500'
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-secondary">
                    {exp.endsAt ? (
                      <>
                        Ends: {new Date(exp.endsAt).toLocaleDateString()}
                      </>
                    ) : (
                      'Ongoing'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
