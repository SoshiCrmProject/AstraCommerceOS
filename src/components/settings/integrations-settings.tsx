/**
 * Integrations Settings Tab
 */

'use client';

import { useState } from 'react';
import type { IntegrationSettings } from '@/lib/services/settings-types';
import { Check, X, Settings } from 'lucide-react';

type IntegrationsSettingsProps = {
  initialData: IntegrationSettings;
  dict: any;
  onSave: (data: IntegrationSettings) => Promise<void>;
};

export function IntegrationsSettings({ initialData, dict, onSave }: IntegrationsSettingsProps) {
  const [data, setData] = useState<IntegrationSettings>(initialData);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      alert(dict.integrations.saved);
    } finally {
      setSaving(false);
    }
  };

  const integrations = [
    { key: 'amazon', name: dict.integrations.amazon, icon: '🛒' },
    { key: 'shopify', name: dict.integrations.shopify, icon: '🛍️' },
    { key: 'shopee', name: dict.integrations.shopee, icon: '🧡' },
    { key: 'rakuten', name: dict.integrations.rakuten, icon: '🏪' },
    { key: 'walmart', name: dict.integrations.walmart, icon: '💙' },
    { key: 'ebay', name: dict.integrations.ebay, icon: '🔵' },
    { key: 'yahooShopping', name: dict.integrations.yahooShopping, icon: '🟣' },
    { key: 'mercari', name: dict.integrations.mercari, icon: '🔴' },
    { key: 'tiktokShop', name: dict.integrations.tiktokShop, icon: '🎵' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{dict.integrations.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{dict.integrations.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => {
          const isConnected = data[integration.key as keyof IntegrationSettings] as boolean;
          
          return (
            <div key={integration.key} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{integration.name}</h3>
                    <p className={`text-xs mt-0.5 ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                      {isConnected ? dict.integrations.connected : dict.integrations.notConnected}
                    </p>
                  </div>
                </div>
                {isConnected ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => setData({ ...data, [integration.key]: false })}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      {dict.integrations.disconnect}
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Settings className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setData({ ...data, [integration.key]: true })}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                  >
                    {dict.integrations.connect}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{dict.integrations.webhookUrl}</h3>
        <input
          type="url"
          value={data.webhookUrl || ''}
          onChange={(e) => setData({ ...data, webhookUrl: e.target.value })}
          placeholder="https://your-domain.com/webhooks"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? dict.common.loading : dict.integrations.saveChanges}
        </button>
      </div>
    </div>
  );
}
