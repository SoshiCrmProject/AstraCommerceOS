/**
 * Auto-Fulfillment Reason Chips
 * Display condition failure reasons as chips
 */

import type { AutoFulfillmentConditionReason } from '@/lib/services/auto-fulfillment-types';

type ReasonChipsProps = {
  reasons: AutoFulfillmentConditionReason[];
  dict: any;
};

export function ReasonChips({ reasons, dict }: ReasonChipsProps) {
  if (reasons.length === 0) {
    return <span className="text-sm text-gray-400">—</span>;
  }

  const chipStyles: Record<string, string> = {
    NEGATIVE_PROFIT: 'bg-red-50 text-red-600 border-red-200',
    PROFIT_BELOW_THRESHOLD: 'bg-orange-50 text-orange-600 border-orange-200',
    DELIVERY_TOO_SLOW: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    AMAZON_OUT_OF_STOCK: 'bg-red-50 text-red-600 border-red-200',
    AMAZON_USED_ONLY: 'bg-gray-50 text-gray-600 border-gray-200',
    AMAZON_LISTING_MISSING: 'bg-red-50 text-red-600 border-red-200',
    CAPTCHA_REQUIRED: 'bg-purple-50 text-purple-600 border-purple-200',
    TWO_FACTOR_REQUIRED: 'bg-purple-50 text-purple-600 border-purple-200',
    HEADLESS_ERROR: 'bg-red-50 text-red-600 border-red-200',
    default: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  return (
    <div className="flex flex-wrap gap-1">
      {reasons.map((reason, index) => (
        <span
          key={index}
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
            chipStyles[reason] || chipStyles.default
          }`}
        >
          {dict.reasons[reason] || reason}
        </span>
      ))}
    </div>
  );
}
