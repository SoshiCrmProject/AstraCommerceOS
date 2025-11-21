/**
 * Settings Client - Tab Navigation & Component Rendering
 */

'use client';

import { useState } from 'react';
import type {
  OrgProfile,
  UserProfile,
  TeamMember,
  BrandingSettings as BrandingSettingsType,
  IntegrationSettings,
  BillingSummary,
} from '@/lib/services/settings-types';
import { OrganizationSettings } from '@/components/settings/organization-settings';
import { ProfileSettings } from '@/components/settings/profile-settings';
import { TeamSettings } from '@/components/settings/team-settings';
import { BrandingSettings } from '@/components/settings/branding-settings';
import { IntegrationsSettings } from '@/components/settings/integrations-settings';
import { BillingSettings } from '@/components/settings/billing-settings';
import { SecuritySettings } from '@/components/settings/security-settings';
import {
  Building2,
  User,
  Users,
  Palette,
  Plug,
  CreditCard,
  Shield,
} from 'lucide-react';

type Tab = 'organization' | 'profile' | 'team' | 'branding' | 'integrations' | 'billing' | 'security';

type SettingsClientProps = {
  dict: any;
  orgProfile: OrgProfile;
  userProfile: UserProfile;
  teamMembers: TeamMember[];
  branding: BrandingSettingsType;
  integrations: IntegrationSettings;
  billing: BillingSummary;
};

export function SettingsClient({
  dict,
  orgProfile,
  userProfile,
  teamMembers,
  branding,
  integrations,
  billing,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('organization');

  const tabs: Array<{ key: Tab; label: string; icon: React.ReactNode }> = [
    { key: 'organization', label: dict.tabs.organization, icon: <Building2 className="w-4 h-4" /> },
    { key: 'profile', label: dict.tabs.profile, icon: <User className="w-4 h-4" /> },
    { key: 'team', label: dict.tabs.team, icon: <Users className="w-4 h-4" /> },
    { key: 'branding', label: dict.tabs.branding, icon: <Palette className="w-4 h-4" /> },
    { key: 'integrations', label: dict.tabs.integrations, icon: <Plug className="w-4 h-4" /> },
    { key: 'billing', label: dict.tabs.billing, icon: <CreditCard className="w-4 h-4" /> },
    { key: 'security', label: dict.tabs.security, icon: <Shield className="w-4 h-4" /> },
  ];

  // Server actions (mock implementations)
  const handleSaveOrg = async (data: OrgProfile) => {
    console.log('Saving org:', data);
    await new Promise((r) => setTimeout(r, 1000));
  };

  const handleSaveProfile = async (data: UserProfile) => {
    console.log('Saving profile:', data);
    await new Promise((r) => setTimeout(r, 1000));
  };

  const handleSaveBranding = async (data: BrandingSettingsType) => {
    console.log('Saving branding:', data);
    await new Promise((r) => setTimeout(r, 1000));
  };

  const handleSaveIntegrations = async (data: IntegrationSettings) => {
    console.log('Saving integrations:', data);
    await new Promise((r) => setTimeout(r, 1000));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{dict.title}</h1>
          <p className="text-gray-600 mt-1">{dict.subtitle}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-gray-200 p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {activeTab === 'organization' && (
                <OrganizationSettings
                  initialData={orgProfile}
                  dict={dict}
                  onSave={handleSaveOrg}
                />
              )}
              {activeTab === 'profile' && (
                <ProfileSettings
                  initialData={userProfile}
                  dict={dict}
                  onSave={handleSaveProfile}
                />
              )}
              {activeTab === 'team' && (
                <TeamSettings members={teamMembers} dict={dict} />
              )}
              {activeTab === 'branding' && (
                <BrandingSettings
                  initialData={branding}
                  dict={dict}
                  onSave={handleSaveBranding}
                />
              )}
              {activeTab === 'integrations' && (
                <IntegrationsSettings
                  initialData={integrations}
                  dict={dict}
                  onSave={handleSaveIntegrations}
                />
              )}
              {activeTab === 'billing' && (
                <BillingSettings billing={billing} dict={dict} />
              )}
              {activeTab === 'security' && (
                <SecuritySettings dict={dict} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
