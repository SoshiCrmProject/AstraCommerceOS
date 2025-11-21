/**
 * Organization Settings Tab
 */

'use client';

import { useState } from 'react';
import type { OrgProfile } from '@/lib/services/settings-types';
import { Save } from 'lucide-react';

type OrganizationSettingsProps = {
  initialData: OrgProfile;
  dict: any;
  onSave: (data: OrgProfile) => Promise<void>;
};

export function OrganizationSettings({ initialData, dict, onSave }: OrganizationSettingsProps) {
  const [data, setData] = useState<OrgProfile>(initialData);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      alert(dict.organization.saved);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{dict.organization.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{dict.organization.subtitle}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dict.organization.name}
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dict.organization.legalName}
            </label>
            <input
              type="text"
              value={data.legalName}
              onChange={(e) => setData({ ...data, legalName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dict.organization.contactEmail}
            </label>
            <input
              type="email"
              value={data.contactEmail}
              onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dict.organization.websiteUrl}
            </label>
            <input
              type="url"
              value={data.websiteUrl || ''}
              onChange={(e) => setData({ ...data, websiteUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dict.organization.defaultCurrency}
            </label>
            <select
              value={data.defaultCurrency}
              onChange={(e) => setData({ ...data, defaultCurrency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dict.organization.defaultTimezone}
            </label>
            <select
              value={data.defaultTimezone}
              onChange={(e) => setData({ ...data, defaultTimezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="Asia/Tokyo">Asia/Tokyo</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? dict.common.loading : dict.organization.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
}
