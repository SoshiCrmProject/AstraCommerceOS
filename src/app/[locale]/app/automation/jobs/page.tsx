import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUserWithOrg } from '@/lib/supabase/auth-utils';
import { redirect } from 'next/navigation';
import { getAutomationDictionary } from '@/i18n/getAutomationDictionary';
import JobsTable from '@/components/automation/jobs-table';
import PageHeader from '@/components/app/page-header';
import Link from 'next/link';

export default async function AutoFulfillmentJobsPage({
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
        title={dict.automation.jobs.title}
        subtitle={dict.automation.jobs.subtitle}
        action={
          <Link
            href={`/${params.locale}/app/automation/settings`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Settings
          </Link>
        }
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
          <JobsTable dict={dict} />
        </Suspense>
      </div>
    </div>
  );
}
