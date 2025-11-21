/**
 * Security Settings Tab
 */

'use client';

import { useState } from 'react';
import { Shield, Key, Monitor, Plus, Trash2 } from 'lucide-react';

type SecuritySettingsProps = {
  dict: any;
};

type ApiKey = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt: string | null;
};

type Session = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export function SecuritySettings({ dict }: SecuritySettingsProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const [apiKeys] = useState<ApiKey[]>([
    {
      id: 'key-1',
      name: 'Production API',
      key: 'sk_live_•••••••••••••••••••••••••••abc123',
      createdAt: '2024-01-15',
      lastUsedAt: '2024-01-20',
    },
    {
      id: 'key-2',
      name: 'Development API',
      key: 'sk_test_•••••••••••••••••••••••••••xyz789',
      createdAt: '2024-01-10',
      lastUsedAt: null,
    },
  ]);

  const [sessions] = useState<Session[]>([
    {
      id: 'sess-1',
      device: 'Chrome on MacBook Pro',
      location: 'Tokyo, Japan',
      lastActive: '2024-01-20T14:30:00Z',
      current: true,
    },
    {
      id: 'sess-2',
      device: 'Safari on iPhone',
      location: 'Tokyo, Japan',
      lastActive: '2024-01-19T09:15:00Z',
      current: false,
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{dict.security.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{dict.security.subtitle}</p>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{dict.security.twoFactor}</h3>
              <p className="text-sm text-gray-600 mt-1">{dict.security.twoFactorDesc}</p>
            </div>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">{dict.security.apiKeys}</h3>
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            {dict.security.createKey}
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {apiKeys.map((key) => (
            <div key={key.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{key.name}</p>
                <p className="text-xs font-mono text-gray-600 mt-1">{key.key}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{dict.security.created}: {new Date(key.createdAt).toLocaleDateString()}</span>
                  {key.lastUsedAt && (
                    <span>{dict.security.lastUsed}: {new Date(key.lastUsedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <button className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">{dict.security.sessions}</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sessions.map((session) => (
            <div key={session.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{session.device}</p>
                  {session.current && (
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {dict.security.currentSession}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span>{session.location}</span>
                  <span>{dict.security.lastActive}: {new Date(session.lastActive).toLocaleString()}</span>
                </div>
              </div>
              {!session.current && (
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  {dict.security.revoke}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
