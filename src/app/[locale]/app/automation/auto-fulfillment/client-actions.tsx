/**
 * Auto-Fulfillment Client Actions
 * Client-side action buttons with loading states
 */

'use client';

import { useState } from 'react';
import { Play, Download, RefreshCw } from 'lucide-react';
import { evaluateCandidatesAction, queuePurchasesAction, downloadCsvAction } from './actions';

type AutoFulfillmentActionsProps = {
  dict: any;
  orgId: string;
};

export function AutoFulfillmentActions({ dict, orgId }: AutoFulfillmentActionsProps) {
  const [evaluating, setEvaluating] = useState(false);
  const [queuing, setQueuing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const result = await evaluateCandidatesAction(orgId);
      if (result.success) {
        alert(dict.messages.evaluated.replace('{count}', result.count?.toString() || '0'));
        window.location.reload();
      } else {
        alert(dict.messages.error);
      }
    } finally {
      setEvaluating(false);
    }
  };

  const handleQueue = async () => {
    if (!confirm('Queue all eligible orders for Amazon auto-purchase?')) return;
    
    setQueuing(true);
    try {
      const result = await queuePurchasesAction(orgId);
      if (result.success) {
        if (result.count === 0) {
          alert(dict.messages.noEligible);
        } else {
          alert(dict.messages.queued.replace('{count}', (result.count || 0).toString()));
          window.location.reload();
        }
      } else {
        alert(dict.messages.error);
      }
    } finally {
      setQueuing(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const result = await downloadCsvAction(orgId);
      if (result.success && result.csv) {
        // Trigger download
        const blob = new Blob([result.csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = dict.csv.filename.replace('{date}', new Date().toISOString().split('T')[0]);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert(dict.messages.error);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleEvaluate}
        disabled={evaluating}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${evaluating ? 'animate-spin' : ''}`} />
        {evaluating ? dict.messages.evaluating : dict.buttons.evaluateNow}
      </button>

      <button
        onClick={handleQueue}
        disabled={queuing}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        <Play className="w-4 h-4" />
        {queuing ? dict.messages.queuing : dict.buttons.queuePurchases}
      </button>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {downloading ? dict.messages.downloading : dict.buttons.downloadCsv}
      </button>
    </div>
  );
}
