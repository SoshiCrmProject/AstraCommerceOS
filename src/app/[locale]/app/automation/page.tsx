import { Suspense } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { AutomationContent } from './automation-content';
import { getAutomationDictionary } from '@/i18n/getAutomationDictionary';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Automation & Workflow Engine',
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AutomationPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getAutomationDictionary(locale as 'en' | 'ja');

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={dict.title}
        subtitle={dict.subtitle}
      />
      
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-surface px-6">
        <nav className="flex gap-6">
          <Link
            href={`/${locale}/app/automation`}
            className="px-1 py-3 border-b-2 border-blue-600 text-sm font-medium text-blue-600"
          >
            {dict.tabs.overview}
          </Link>
          <Link
            href={`/${locale}/app/automation/templates`}
            className="px-1 py-3 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300"
          >
            {dict.tabs.templates}
          </Link>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<div className="text-gray-500">Loading automation...</div>}>
          <AutomationContent locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
