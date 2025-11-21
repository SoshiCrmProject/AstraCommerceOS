/**
 * Branding Settings Tab
 */

'use client';

import { useState } from 'react';
import type { BrandingSettings as BrandingSettingsType } from '@/lib/services/settings-types';
import { Image, Palette } from 'lucide-react';

type BrandingSettingsProps = {
  initialData: BrandingSettingsType;
  dict: any;
  onSave: (data: BrandingSettingsType) => Promise<void>;
};

export function BrandingSettings({ initialData, dict, onSave }: BrandingSettingsProps) {
  const [data, setData] = useState<BrandingSettingsType>(initialData);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      alert(dict.branding.saved);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{dict.branding.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{dict.branding.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4 inline mr-1" />
              {dict.branding.logoUrl}
            </label>
            <input
              type="url"
              value={data.logoUrl || ''}
              onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Favicon URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4 inline mr-1" />
              {dict.branding.faviconUrl}
            </label>
            <input
              type="url"
              value={data.faviconUrl || ''}
              onChange={(e) => setData({ ...data, faviconUrl: e.target.value })}
              placeholder="https://example.com/favicon.ico"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              {dict.branding.primaryColor}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={data.primaryColor}
                onChange={(e) => setData({ ...data, primaryColor: e.target.value })}
                className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={data.primaryColor}
                onChange={(e) => setData({ ...data, primaryColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              {dict.branding.accentColor}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={data.accentColor}
                onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={data.accentColor}
                onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{dict.branding.preview}</h3>
          <div className="space-y-4">
            {/* Logo Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              {data.logoUrl ? (
                <img src={data.logoUrl} alt="Logo" className="h-12 object-contain" />
              ) : (
                <div className="h-12 flex items-center text-gray-400 text-sm">{dict.branding.noLogo}</div>
              )}
            </div>

            {/* Color Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-10 rounded-lg border border-gray-300"
                  style={{ backgroundColor: data.primaryColor }}
                />
                <span className="text-xs text-gray-600">{dict.branding.primaryColor}</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-10 rounded-lg border border-gray-300"
                  style={{ backgroundColor: data.accentColor }}
                />
                <span className="text-xs text-gray-600">{dict.branding.accentColor}</span>
              </div>
            </div>

            {/* Sample Button */}
            <button
              className="w-full py-2 text-white text-sm font-medium rounded-lg"
              style={{ backgroundColor: data.primaryColor }}
            >
              {dict.branding.sampleButton}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? dict.common.loading : dict.branding.saveChanges}
        </button>
      </div>
    </div>
  );
}
