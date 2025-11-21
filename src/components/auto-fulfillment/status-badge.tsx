/**
 * Auto-Fulfillment Status Badge
 * Color-coded status indicators
 */

import type { AutoFulfillmentStatus } from '@/lib/services/auto-fulfillment-types';

type StatusBadgeProps = {
  status: AutoFulfillmentStatus;
  dict: any;
};

export function StatusBadge({ status, dict }: StatusBadgeProps) {
  const styles: Record<AutoFulfillmentStatus, string> = {
    PENDING_EVAL: 'bg-gray-100 text-gray-700',
    ELIGIBLE: 'bg-green-100 text-green-700',
    SKIPPED_CONDITION: 'bg-yellow-100 text-yellow-700',
    QUEUED_FOR_PURCHASE: 'bg-blue-100 text-blue-700',
    PURCHASE_IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
    PURCHASE_SUCCEEDED: 'bg-emerald-100 text-emerald-700',
    PURCHASE_FAILED: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {dict.status[status]}
    </span>
  );
}
