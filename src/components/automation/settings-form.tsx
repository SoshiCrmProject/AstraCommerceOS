'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Channel {
  id: string;
  name: string;
}

interface Settings {
  enabled: boolean;
  includeAmazonPoints: boolean;
  includeDomesticShipping: boolean;
  maxDeliveryDays: number;
  minExpectedProfit: number;
  shopeeCommissionRate: number;
  eligibleChannels: string[];
  maxDailyOrders: number;
  requireManualApproval: boolean;
  amazonEmail?: string;
  hasAmazonCredentials?: boolean;
}

export default function AutoFulfillmentSettings({ dict, channels }: { dict: any, channels: Channel[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  
  const [settings, setSettings] = useState<Settings>({
    enabled: false,
    includeAmazonPoints: true,
    includeDomesticShipping: false,
    maxDeliveryDays: 7,
    minExpectedProfit: 500,
    shopeeCommissionRate: 5,
    eligibleChannels: [],
    maxDailyOrders: 10,
    requireManualApproval: false,
  });
  
  const [credentials, setCredentials] = useState({
    amazonEmail: '',
    amazonPassword: '',
    amazonTotpSecret: '',
  });
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const res = await fetch('/api/automation/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          ...data,
          shopeeCommissionRate: (data.shopeeCommissionRate || 0.05) * 100,
        });
        if (data.amazonEmail) {
          setCredentials(prev => ({ ...prev, amazonEmail: data.amazonEmail }));
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (settings.enabled && !acknowledged) {
      alert(dict.automation.settings.warningDetails);
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch('/api/automation/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          shopeeCommissionRate: settings.shopeeCommissionRate / 100,
          ...(credentials.amazonEmail && credentials.amazonPassword && {
            amazonEmail: credentials.amazonEmail,
            amazonPassword: credentials.amazonPassword,
            amazonTotpSecret: credentials.amazonTotpSecret || undefined,
          }),
        }),
      });
      
      if (res.ok) {
        alert(dict.automation.settings.saveSuccess);
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || dict.automation.settings.saveError);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert(dict.automation.settings.saveError);
    } finally {
      setSaving(false);
    }
  };
  
  const toggleChannel = (channelId: string) => {
    setSettings(prev => ({
      ...prev,
      eligibleChannels: prev.eligibleChannels.includes(channelId)
        ? prev.eligibleChannels.filter(id => id !== channelId)
        : [...prev.eligibleChannels, channelId],
    }));
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {dict.automation.settings.title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {dict.automation.settings.subtitle}
        </p>
      </div>
      
      {/* Warning Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              {dict.automation.settings.warning}
            </h3>
            <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              {dict.automation.settings.warningDetails}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        
        {/* Enable Toggle */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {dict.automation.settings.enableLabel}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {dict.automation.settings.enableDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`${
                settings.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span className={`${
                settings.enabled ? 'translate-x-5' : 'translate-x-0'
              } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
            </button>
          </div>
          
          {settings.enabled && (
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {dict.automation.settings.acknowledgeLabel}
                </span>
              </label>
            </div>
          )}
        </div>
        
        {/* Amazon Credentials */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {dict.automation.settings.amazonCredentials}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.automation.settings.amazonEmailLabel}
              </label>
              <input
                type="email"
                value={credentials.amazonEmail}
                onChange={(e) => setCredentials(prev => ({ ...prev, amazonEmail: e.target.value }))}
                placeholder={dict.automation.settings.amazonEmailPlaceholder}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.automation.settings.amazonPasswordLabel}
              </label>
              <input
                type="password"
                value={credentials.amazonPassword}
                onChange={(e) => setCredentials(prev => ({ ...prev, amazonPassword: e.target.value }))}
                placeholder={settings.hasAmazonCredentials ? "••••••••" : dict.automation.settings.amazonPasswordPlaceholder}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {settings.hasAmazonCredentials && !credentials.amazonPassword && (
                <p className="mt-1 text-xs text-gray-500">Leave blank to keep existing password</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.automation.settings.amazonTotpLabel}
              </label>
              <input
                type="text"
                value={credentials.amazonTotpSecret}
                onChange={(e) => setCredentials(prev => ({ ...prev, amazonTotpSecret: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {dict.automation.settings.amazonTotpDescription}
              </p>
            </div>
          </div>
        </div>
        
        {/* Profit Settings */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {dict.automation.settings.profitSettings}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.automation.settings.minProfitLabel}
              </label>
              <input
                type="number"
                value={settings.minExpectedProfit}
                onChange={(e) => setSettings(prev => ({ ...prev, minExpectedProfit: Number(e.target.value) }))}
                placeholder={dict.automation.settings.minProfitPlaceholder}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {dict.automation.settings.minProfitDescription}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.automation.settings.commissionRateLabel}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  value={settings.shopeeCommissionRate}
                  onChange={(e) => setSettings(prev => ({ ...prev, shopeeCommissionRate: Number(e.target.value) }))}
                  placeholder={dict.automation.settings.commissionRatePlaceholder}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {dict.automation.settings.commissionRateDescription}
              </p>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.includeAmazonPoints}
                onChange={(e) => setSettings(prev => ({ ...prev, includeAmazonPoints: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {dict.automation.settings.includePointsLabel}
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.includeDomesticShipping}
                onChange={(e) => setSettings(prev => ({ ...prev, includeDomesticShipping: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {dict.automation.settings.includeDomesticLabel}
              </span>
            </label>
          </div>
        </div>
        
        {/* Shipping Settings */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {dict.automation.settings.shippingSettings}
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {dict.automation.settings.maxDeliveryLabel}
            </label>
            <input
              type="number"
              value={settings.maxDeliveryDays}
              onChange={(e) => setSettings(prev => ({ ...prev, maxDeliveryDays: Number(e.target.value) }))}
              placeholder={dict.automation.settings.maxDeliveryPlaceholder}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {dict.automation.settings.maxDeliveryDescription}
            </p>
          </div>
        </div>
        
        {/* Channel Filters */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {dict.automation.settings.channelFilters}
          </h3>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.eligibleChannels.length === 0}
                onChange={() => setSettings(prev => ({ ...prev, eligibleChannels: [] }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.automation.settings.allChannelsLabel}
              </span>
            </label>
            
            {channels.map(channel => (
              <label key={channel.id} className="flex items-center ml-6">
                <input
                  type="checkbox"
                  checked={settings.eligibleChannels.includes(channel.id)}
                  onChange={() => toggleChannel(channel.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {channel.name}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Risk Management */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {dict.automation.settings.riskSettings}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.automation.settings.maxDailyOrdersLabel}
              </label>
              <input
                type="number"
                value={settings.maxDailyOrders}
                onChange={(e) => setSettings(prev => ({ ...prev, maxDailyOrders: Number(e.target.value) }))}
                placeholder={dict.automation.settings.maxDailyOrdersPlaceholder}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {dict.automation.settings.maxDailyOrdersDescription}
              </p>
            </div>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requireManualApproval}
                onChange={(e) => setSettings(prev => ({ ...prev, requireManualApproval: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {dict.automation.settings.requireApprovalLabel}
              </span>
            </label>
          </div>
        </div>
        
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {dict.automation.settings.cancelButton}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || (settings.enabled && !acknowledged)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : dict.automation.settings.saveButton}
        </button>
      </div>
    </div>
  );
}
