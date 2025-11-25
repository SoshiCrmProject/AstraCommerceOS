import { Suspense } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { RulesContent } from './rules-content';


// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Repricing Rules',
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RulesPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Repricing Rules"
        subtitle="Manage automated repricing rules and strategies"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<div className="text-secondary">Loading...</div>}>
          <RulesContent locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
