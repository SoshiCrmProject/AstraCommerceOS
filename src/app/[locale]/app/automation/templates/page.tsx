import { Suspense } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { TemplatesContent } from './templates-content';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Automation Templates',
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TemplatesPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Automation Templates"
        subtitle="Start from proven workflows for pricing, inventory, orders, and reviews"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<div className="text-secondary">Loading...</div>}>
          <TemplatesContent locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
