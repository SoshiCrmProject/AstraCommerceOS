/**
 * Admin Dashboard Page
 */

import { getAdminDictionary } from '@/i18n/getAdminDictionary';
import AdminService from '@/lib/services/admin-service';
import { AdminClient } from './client';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getAdminDictionary(locale as 'en' | 'ja');

  // Load all admin data in parallel
  const [overview, tenants] = await Promise.all([
    AdminService.getAdminOverview(),
    AdminService.getTenants(),
  ]);

  return (
    <AdminClient
      dict={dict}
      overview={overview}
      tenants={tenants}
    />
  );
}
