/**
 * Profile Settings Tab
 */

'use client';

import { useState } from 'react';
import type { UserProfile } from '@/lib/services/settings-types';

type ProfileSettingsProps = {
  initialData: UserProfile;
  dict: any;
  onSave: (data: UserProfile) => Promise<void>;
};

export function ProfileSettings({ initialData, dict, onSave }: ProfileSettingsProps) {
  const [data, setData] = useState<UserProfile>(initialData);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      alert(dict.profile.saved);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{dict.profile.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{dict.profile.subtitle}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{dict.profile.avatarUrl}</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
              {data.name.charAt(0).toUpperCase()}
            </div>
            <input
              type="url"
              value={data.avatarUrl || ''}
              onChange={(e) => setData({ ...data, avatarUrl: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{dict.profile.name}</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{dict.profile.email}</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Locale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{dict.profile.locale}</label>
            <select
              value={data.locale}
              onChange={(e) => setData({ ...data, locale: e.target.value as 'en' | 'ja' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{dict.profile.timezone}</label>
            <select
              value={data.timezone}
              onChange={(e) => setData({ ...data, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
            </select>
          </div>
        </div>

        {/* Role (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{dict.profile.role}</label>
          <input
            type="text"
            value={data.role}
            readOnly
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? dict.common.loading : dict.profile.saveChanges}
        </button>
      </div>
    </div>
  );
}
