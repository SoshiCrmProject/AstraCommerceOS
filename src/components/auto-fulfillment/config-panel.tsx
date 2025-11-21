/**
 * Auto-Fulfillment Configuration Panel
 * Form for managing auto-fulfillment rules
 */

'use client';

import { useState } from 'react';
import type { AutoFulfillmentRuleConfig } from '@/lib/services/auto-fulfillment-types';
import { Save } from 'lucide-react';

type ConfigPanelProps = {
  initialConfig: AutoFulfillmentRuleConfig;
  dict: any;
  onSave: (config: AutoFulfillmentRuleConfig) => Promise<void>;
};

export function ConfigPanel({ initialConfig, dict, onSave }: ConfigPanelProps) {
  const [config, setConfig] = useState<AutoFulfillmentRuleConfig>(initialConfig);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(config);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{dict.config.title}</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : dict.buttons.saveConfig}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enable auto-fulfillment */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="enabled"
            checked={config.enabled}
            onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
            className="mt-1 w-4 h-4 text-blue-600 rounded"
          />
          <div>
            <label htmlFor="enabled" className="block text-sm font-medium text-gray-900 cursor-pointer">
              {dict.config.enabled}
            </label>
            <p className="text-xs text-gray-600 mt-1">{dict.config.enabledHelp}</p>
          </div>
        </div>

        {/* Include Amazon Points */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="includePoints"
            checked={config.includeAmazonPoints}
            onChange={(e) => setConfig({ ...config, includeAmazonPoints: e.target.checked })}
            className="mt-1 w-4 h-4 text-blue-600 rounded"
          />
          <div>
            <label htmlFor="includePoints" className="block text-sm font-medium text-gray-900 cursor-pointer">
              {dict.config.includePoints}
            </label>
            <p className="text-xs text-gray-600 mt-1">{dict.config.includePointsHelp}</p>
          </div>
        </div>

        {/* Include domestic shipping */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="includeShipping"
            checked={config.includeDomesticShippingFee}
            onChange={(e) => setConfig({ ...config, includeDomesticShippingFee: e.target.checked })}
            className="mt-1 w-4 h-4 text-blue-600 rounded"
          />
          <div>
            <label htmlFor="includeShipping" className="block text-sm font-medium text-gray-900 cursor-pointer">
              {dict.config.includeShipping}
            </label>
            <p className="text-xs text-gray-600 mt-1">{dict.config.includeShippingHelp}</p>
          </div>
        </div>

        {/* Max delivery days */}
        <div>
          <label htmlFor="maxDays" className="block text-sm font-medium text-gray-900 mb-1">
            {dict.config.maxDeliveryDays}
          </label>
          <input
            type="number"
            id="maxDays"
            value={config.maxDeliveryDays}
            onChange={(e) => setConfig({ ...config, maxDeliveryDays: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            min="1"
            max="30"
          />
          <p className="text-xs text-gray-600 mt-1">{dict.config.maxDeliveryDaysHelp}</p>
        </div>

        {/* Min profit */}
        <div>
          <label htmlFor="minProfit" className="block text-sm font-medium text-gray-900 mb-1">
            {dict.config.minProfit}
          </label>
          <input
            type="number"
            id="minProfit"
            value={config.minExpectedProfit}
            onChange={(e) => setConfig({ ...config, minExpectedProfit: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            step="100"
          />
          <p className="text-xs text-gray-600 mt-1">{dict.config.minProfitHelp}</p>
        </div>
      </div>
    </div>
  );
}
