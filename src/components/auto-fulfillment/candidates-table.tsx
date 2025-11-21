/**
 * Auto-Fulfillment Candidates Table
 * Display all candidates with status, profit, and reasons
 */

'use client';

import type { AutoFulfillmentCandidate } from '@/lib/services/auto-fulfillment-types';
import { StatusBadge } from './status-badge';
import { ReasonChips } from './reason-chips';
import { ExternalLink, PlayCircle } from 'lucide-react';

type CandidatesTableProps = {
  candidates: AutoFulfillmentCandidate[];
  dict: any;
  locale: string;
};

export function CandidatesTable({ candidates, dict, locale }: CandidatesTableProps) {
  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-600 text-lg font-medium">{dict.table.noResults}</p>
        <p className="text-gray-500 text-sm mt-2">{dict.table.noResultsDescription}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.marketplace}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.orderId}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.product}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.orderTotal}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.amazonPrice}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.profit}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.status}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.reasons}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                {dict.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                {/* Marketplace */}
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {dict.marketplaces[candidate.marketplace] || candidate.marketplace}
                  </div>
                  <div className="text-xs text-gray-600">{candidate.shopName}</div>
                </td>

                {/* Order ID */}
                <td className="px-4 py-3">
                  <div className="text-sm font-mono text-gray-900">{candidate.marketplaceOrderId}</div>
                  <div className="text-xs text-gray-600">Qty: {candidate.quantity}</div>
                </td>

                {/* Product */}
                <td className="px-4 py-3 max-w-xs">
                  <div className="text-sm text-gray-900 truncate">{candidate.productName}</div>
                  <div className="text-xs text-gray-600 font-mono">{candidate.skuCode}</div>
                  <div className="text-xs text-blue-600 font-mono">{candidate.amazonAsin}</div>
                </td>

                {/* Order Total */}
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  ¥{candidate.orderTotal.toLocaleString()}
                </td>

                {/* Amazon Price */}
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    ¥{(candidate.amazonPrice * candidate.quantity).toLocaleString()}
                  </div>
                  {candidate.amazonPoints > 0 && (
                    <div className="text-xs text-green-600">
                      +{(candidate.amazonPoints * candidate.quantity).toLocaleString()} pts
                    </div>
                  )}
                  <div className="text-xs text-gray-600">{candidate.estimatedAmazonShipDays}d ship</div>
                </td>

                {/* Profit */}
                <td className="px-4 py-3">
                  <div
                    className={`text-sm font-bold ${
                      candidate.expectedProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ¥{candidate.expectedProfit.toLocaleString()}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={candidate.status} dict={dict} />
                  {candidate.amazonOrderId && (
                    <div className="text-xs text-gray-600 font-mono mt-1">{candidate.amazonOrderId}</div>
                  )}
                </td>

                {/* Reasons */}
                <td className="px-4 py-3 max-w-sm">
                  <ReasonChips reasons={candidate.reasons} dict={dict} />
                  {candidate.errorMessage && (
                    <div className="text-xs text-red-600 mt-1 truncate">{candidate.errorMessage}</div>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium inline-flex items-center gap-1"
                      title={dict.buttons.viewOrder}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    {candidate.status === 'ELIGIBLE' && (
                      <button
                        className="text-green-600 hover:text-green-700 text-xs font-medium inline-flex items-center gap-1"
                        title={dict.buttons.testPurchase}
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
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
