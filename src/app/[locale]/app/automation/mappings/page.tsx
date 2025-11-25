import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { redirect } from 'next/navigation';
import { getAutomationDictionary } from '@/i18n/getAutomationDictionary';
import MappingsTable from '@/components/automation/mappings-table';
import PageHeader from '@/components/app/page-header';

export default async function ProductMappingsPage({
  params,
}: {
  params: { locale: string };
}) {
  const supabase = await createClient();
  const user = await getUserWithOrg(supabase);
  
  if (!user || !user.org) {
    redirect('/sign-in');
  }
  
  const dict = await getAutomationDictionary(params.locale as 'en' | 'ja');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title={dict.automation.mappings.title}
        subtitle={dict.automation.mappings.subtitle}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
          <MappingsTable dict={dict} />
        </Suspense>
      </div>
    </div>
  );
}
