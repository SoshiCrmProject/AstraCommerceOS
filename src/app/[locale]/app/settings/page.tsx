/**
 * Settings Main Page - Tabbed Settings Center
 */

import { getSettingsDictionary } from '@/i18n/getSettingsDictionary';
import SettingsService from '@/lib/services/settings-service';
import { SettingsClient } from './client';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getSettingsDictionary(locale as 'en' | 'ja');

  // Load all settings data in parallel
  const [orgProfile, userProfile, teamMembers, branding, integrations, billing] =
    await Promise.all([
      SettingsService.getOrgProfile('org-123'),
      SettingsService.getUserProfile('user-456'),
      SettingsService.getTeamMembers('org-123'),
      SettingsService.getBrandingSettings('org-123'),
      SettingsService.getIntegrationSettings('org-123'),
      SettingsService.getBillingSummary('org-123'),
    ]);

  return (
    <SettingsClient
      dict={dict}
      orgProfile={orgProfile}
      userProfile={userProfile}
      teamMembers={teamMembers}
      branding={branding}
      integrations={integrations}
      billing={billing}
    />
  );
}
