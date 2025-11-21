/**
 * Risk Warning Banner
 * Displays important information about headless automation risks
 */

'use client';

import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

type RiskWarningProps = {
  dict: any;
};

export function RiskWarning({ dict }: RiskWarningProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-900 mb-1">
            {dict.warning.title}
          </h3>
          <p className="text-sm text-yellow-800 leading-relaxed">
            {dict.warning.message}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
