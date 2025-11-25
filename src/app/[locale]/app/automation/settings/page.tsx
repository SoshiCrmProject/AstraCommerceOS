import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { getAutomationDictionary } from '@/i18n/getAutomationDictionary';
import SettingsForm from '@/components/automation/settings-form';
import PageHeader from '@/components/app/page-header';

const prisma = new PrismaClient();

export default async function AutoFulfillmentSettingsPage({
  params,
}: {
  params: { locale: string };
}) {
  const supabase = await createClient();
  const user = await getUserWithOrg(supabase);
  
  if (!user || !user.org) {
    redirect('/sign-in');
  }
  
  // Get channels for filtering
  const channels = await prisma.channel.findMany({
    where: { orgId: user.org.id },
    select: { id: true, name: true },
  });
  
  const dict = await getAutomationDictionary(params.locale as 'en' | 'ja');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title={dict.automation.settings.title}
        subtitle={dict.automation.settings.subtitle}
      />
      
      <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
        <SettingsForm dict={dict} channels={channels} />
      </Suspense>
    </div>
  );
}
